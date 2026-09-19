"use client";

import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { siteConfig } from "@/config/site";
import type { QualityTier } from "./quality";

const C = siteConfig.burger3D;
const { smoothstep, lerp, clamp } = THREE.MathUtils;

/* ------------------------------------------------------------------ */
/* Deterministic noise (no textures: all surface detail is geometry + */
/* vertex colour, generated once when the scene mounts)               */
/* ------------------------------------------------------------------ */

function mulberry32(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hash3(x: number, y: number, z: number) {
  let h = Math.imul(x, 374761393) ^ Math.imul(y, 668265263) ^ Math.imul(z, 1440662683);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
}

/** Smooth 3D value noise in [-1, 1]. */
function noise3(x: number, y: number, z: number) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const zi = Math.floor(z);
  const u = smoothstep(x - xi, 0, 1);
  const v = smoothstep(y - yi, 0, 1);
  const w = smoothstep(z - zi, 0, 1);
  const c = (dx: number, dy: number, dz: number) => hash3(xi + dx, yi + dy, zi + dz);
  const x00 = lerp(c(0, 0, 0), c(1, 0, 0), u);
  const x10 = lerp(c(0, 1, 0), c(1, 1, 0), u);
  const x01 = lerp(c(0, 0, 1), c(1, 0, 1), u);
  const x11 = lerp(c(0, 1, 1), c(1, 1, 1), u);
  return lerp(lerp(x00, x10, v), lerp(x01, x11, v), w) * 2 - 1;
}

/** Fractal noise (3 octaves) in roughly [-1, 1]. */
function fbm(x: number, y: number, z: number) {
  return noise3(x, y, z) * 0.57 + noise3(x * 2.03, y * 2.03, z * 2.03) * 0.29 + noise3(x * 4.1, y * 4.1, z * 4.1) * 0.14;
}

/** Lathe seams / axis points are duplicated; weld them so noise + normals stay seamless. */
function weld(geo: THREE.BufferGeometry) {
  geo.deleteAttribute("normal");
  geo.deleteAttribute("uv");
  const merged = mergeVertices(geo, 1e-4);
  geo.dispose();
  return merged;
}

function setColors(geo: THREE.BufferGeometry, colorAt: (p: THREE.Vector3, out: THREE.Color) => void) {
  const pos = geo.attributes.position;
  const colors = new Float32Array(pos.count * 3);
  const p = new THREE.Vector3();
  const col = new THREE.Color();
  for (let i = 0; i < pos.count; i++) {
    p.fromBufferAttribute(pos, i);
    colorAt(p, col);
    col.toArray(colors, i * 3);
  }
  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
}

const shade = (hex: string, k: number) => new THREE.Color(hex).multiplyScalar(k);

/* ------------------------------------------------------------------ */
/* Shapes                                                             */
/* ------------------------------------------------------------------ */

/** Disc with rounded edges; `rings` adds interior vertices on the flat faces so they can be displaced. */
function puck(radius: number, height: number, bevel: number, radial: number, steps: number, rings: number) {
  const h = height / 2;
  const inner = radius - bevel;
  const pts: THREE.Vector2[] = [];
  for (let i = 0; i < rings; i++) pts.push(new THREE.Vector2((i / rings) * inner, -h));
  for (let i = 0; i <= steps; i++) {
    const a = -Math.PI / 2 + (i / steps) * (Math.PI / 2);
    pts.push(new THREE.Vector2(inner + Math.cos(a) * bevel, -h + bevel + Math.sin(a) * bevel));
  }
  for (let i = 0; i <= steps; i++) {
    const a = (i / steps) * (Math.PI / 2);
    pts.push(new THREE.Vector2(inner + Math.cos(a) * bevel, h - bevel + Math.sin(a) * bevel));
  }
  for (let i = rings - 1; i >= 0; i--) pts.push(new THREE.Vector2((i / rings) * inner, h));
  return weld(new THREE.LatheGeometry(pts, radial));
}

// Top bun dome (shared with seed placement)
const DOME = { radius: 1.5, rim: 0.14, height: 0.92 };

/** Organic lumpiness of the crown, sampled from the undisplaced position (used by the bun AND the seeds). */
function bunBump(p: THREE.Vector3) {
  // Only broad lumps: finer detail can't be resolved by low-tier vertex spacing (and would bury the seeds).
  const w = smoothstep(p.y, DOME.rim, DOME.rim + 0.25);
  return w * (0.045 * noise3(p.x * 1.1 + 3.1, p.y * 1.1, p.z * 1.1) + 0.02 * noise3(p.x * 2.3, p.y * 2.3 + 8, p.z * 2.3));
}

function domeNormal(p: THREE.Vector3, out: THREE.Vector3) {
  const { radius: R, rim: b, height: H } = DOME;
  return out.set(p.x / (R * R), Math.max(p.y - b, 0) / (H * H), p.z / (R * R)).normalize();
}

const _n = new THREE.Vector3();
/** Deforms a point on the ideal dome (bumps along the normal + slight oval squash). Shared by bun and seeds. */
function warpDome(p: THREE.Vector3, lift = 0) {
  const d = bunBump(p) + lift;
  domeNormal(p, _n);
  const squash = 1 + 0.025 * noise3(p.x * 0.6, 7.7, p.z * 0.6);
  return p.set((p.x + _n.x * d) * squash, p.y + _n.y * d, (p.z + _n.z * d) * (2 - squash));
}

function topBun(radial: number, steps: number) {
  const { radius: R, rim: b, height: H } = DOME;
  const pts = [new THREE.Vector2(0, 0), new THREE.Vector2(R * 0.5, 0), new THREE.Vector2(R - b, 0)];
  for (let i = 1; i <= 3; i++) {
    const a = -Math.PI / 2 + (i / 3) * (Math.PI / 2);
    pts.push(new THREE.Vector2(R - b + Math.cos(a) * b, b + Math.sin(a) * b));
  }
  for (let i = 1; i <= steps; i++) {
    const a = (i / steps) * (Math.PI / 2);
    // slightly flattened crown, like a real brioche
    pts.push(new THREE.Vector2(R * Math.cos(a), b + H * Math.pow(Math.sin(a), 0.85)));
  }
  const geo = weld(new THREE.LatheGeometry(pts, radial));

  const pos = geo.attributes.position;
  const p = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    p.fromBufferAttribute(pos, i);
    if (p.y < 1e-3) continue;
    warpDome(p);
    pos.setXYZ(i, p.x, p.y, p.z);
  }

  const crumb = new THREE.Color(C.crumb);
  const rimCol = new THREE.Color(C.bun).lerp(crumb, 0.42);
  const crown = shade(C.bun, 0.8);
  const toasted = shade(C.bun, 0.55);
  setColors(geo, (q, out) => {
    if (q.y < 1e-3) {
      // cut side: crumb, darker toward the edge where it meets the lettuce
      const r = Math.hypot(q.x, q.z) / R;
      out.copy(crumb).multiplyScalar(lerp(0.95, 0.7, smoothstep(r, 0.6, 1)));
      return;
    }
    out.copy(rimCol).lerp(crown, smoothstep(q.y, 0.12, 0.7));
    // uneven toasting, darkest around the crown
    const crownT = smoothstep(q.y, 0.5, 1.05);
    out.lerp(toasted, clamp(fbm(q.x * 1.6, q.y * 1.6 + 5, q.z * 1.6) * 0.8 + crownT * 0.45, 0, 0.7));
    // contact shadow near the rim (fake AO)
    out.multiplyScalar(lerp(0.72, 1, smoothstep(q.y, 0.0, 0.22)));
  });
  geo.computeVertexNormals();
  return geo;
}

function bottomBun(radial: number, steps: number) {
  const geo = puck(1.42, 0.46, 0.2, radial, steps, 2);
  const pos = geo.attributes.position;
  const p = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    p.fromBufferAttribute(pos, i);
    const k = 1 + 0.025 * fbm(p.x * 1.4, p.y * 2, p.z * 1.4);
    pos.setXYZ(i, p.x * k, p.y + (p.y < 0 ? 0 : 0.015 * noise3(p.x * 3, 1, p.z * 3)), p.z * k);
  }
  const side = new THREE.Color(C.bunBottom);
  const crumb = shade(C.crumb, 0.85);
  setColors(geo, (q, out) => {
    const r = Math.hypot(q.x, q.z);
    if (q.y > 0.2 && r < 1.22) out.copy(crumb).multiplyScalar(0.8); // cut face, mostly hidden
    else out.copy(side).lerp(shade(C.bunBottom, 0.7), clamp(fbm(q.x * 2, q.y * 3, q.z * 2) * 0.8, 0, 0.4));
    // shadowed top edge under the patty
    out.multiplyScalar(lerp(1, 0.62, smoothstep(q.y, 0.02, 0.23)));
  });
  geo.computeVertexNormals();
  return geo;
}

function patty(radial: number, rings: number) {
  const h = 0.2;
  const geo = puck(1.5, h * 2, 0.17, radial, 4, rings);
  const pos = geo.attributes.position;
  const p = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    p.fromBufferAttribute(pos, i);
    const r = Math.hypot(p.x, p.z);
    if (r > 1e-3) {
      const ang = Math.atan2(p.z, p.x);
      // ragged, smashed edge + slight bulge in the middle of the side wall
      const edge = 0.075 * fbm(Math.cos(ang) * 2.2, p.y * 2, Math.sin(ang) * 2.2);
      const bulge = 0.035 * (1 - (p.y / h) ** 2) * smoothstep(r, 1.2, 1.5);
      const k = 1 + (edge + bulge) * smoothstep(r, 0.6, 1.4);
      p.x *= k;
      p.z *= k;
    }
    // seared, craggy top and bottom
    p.y += Math.sign(p.y) * (0.035 * fbm(p.x * 2.6, 0.5, p.z * 2.6) + 0.012 * noise3(p.x * 9, 2, p.z * 9));
    pos.setXYZ(i, p.x, p.y, p.z);
  }
  const base = new THREE.Color(C.patty);
  const char = shade(C.patty, 0.45);
  const browned = shade(C.patty, 1.55);
  setColors(geo, (q, out) => {
    const n = fbm(q.x * 5, q.y * 6, q.z * 5);
    out.copy(base).lerp(n > 0 ? browned : char, Math.min(Math.abs(n) * 1.3, 0.8));
    // side wall a touch darker (crust), mid-seam in shadow
    const r = Math.hypot(q.x, q.z);
    out.multiplyScalar(lerp(1, 0.78, smoothstep(r, 1.2, 1.55)));
  });
  geo.computeVertexNormals();
  return geo;
}

function cheese(segments: number) {
  const size = 1.3;
  const geo = new THREE.BoxGeometry(size * 2, 0.05, size * 2, segments, 1, segments);
  const pos = geo.attributes.position;
  const p = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    p.fromBufferAttribute(pos, i);
    const x0 = p.x;
    const z0 = p.z;
    // wobbly, soft-cornered outline
    const edge = smoothstep(Math.max(Math.abs(x0), Math.abs(z0)), size * 0.55, size);
    p.x += 0.06 * edge * noise3(x0 * 2.1, 4, z0 * 2.1);
    p.z += 0.06 * edge * noise3(x0 * 2.1, 9, z0 * 2.1);
    // melted drape: past the patty edge the slice rolls over an arc and the corners hang straight down,
    // staying just outside the patty's (noisy, bulging) side wall so nothing clips through.
    const d = Math.hypot(p.x, p.z);
    const D0 = 1.45;
    if (d > D0) {
      const t = d - D0;
      const rho = 0.22 * (1 + 0.3 * noise3(x0 * 1.7, 1, z0 * 1.7));
      const arc = (rho * Math.PI) / 2;
      let dr = rho;
      let dy = rho + Math.min(t - arc, 0.12);
      if (t < arc) {
        const th = t / rho;
        dr = rho * Math.sin(th);
        dy = rho * (1 - Math.cos(th));
      }
      const r = D0 + dr;
      p.x *= r / d;
      p.z *= r / d;
      p.y -= dy;
    }
    p.y -= 0.012 * noise3(x0 * 3, 3, z0 * 3);
    pos.setXYZ(i, p.x, p.y, p.z);
  }
  const base = new THREE.Color(C.cheese);
  setColors(geo, (q, out) => {
    out.copy(base).multiplyScalar(1 + 0.08 * noise3(q.x * 4, 0, q.z * 4));
    out.multiplyScalar(lerp(1, 0.8, smoothstep(Math.hypot(q.x, q.z), 1.1, 1.6)));
  });
  geo.computeVertexNormals();
  return geo;
}

function lettuce(radial: number) {
  const geo = weld(new THREE.CylinderGeometry(1.62, 1.62, 0.04, radial, 1));
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const z = pos.getZ(i);
    const r = Math.hypot(x, z);
    if (r < 1) continue;
    const ang = Math.atan2(z, x);
    const cx = Math.cos(ang) * 3;
    const cz = Math.sin(ang) * 3;
    const k = 1 + 0.06 * fbm(cx, 1.3, cz);
    const ruffle = 0.05 * noise3(cx * 2.2, 0, cz * 2.2) + 0.03 * Math.sin(ang * 11);
    const droop = 0.07 * smoothstep(r, 1.2, 1.62); // edge flops down over the cheese
    pos.setXYZ(i, x * k, pos.getY(i) + ruffle - droop, z * k);
  }
  const dark = shade(C.lettuce, 0.72);
  const light = new THREE.Color(C.lettuce).lerp(new THREE.Color("#b9c46a"), 0.35);
  setColors(geo, (q, out) => {
    out.copy(dark).lerp(light, clamp(0.5 + fbm(q.x * 3, 0, q.z * 3) * 0.8, 0, 1));
  });
  geo.computeVertexNormals();
  return geo;
}

function tomato(radial: number, rings: number) {
  const geo = puck(0.74, 0.1, 0.035, radial, 2, rings);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const k = 1 + 0.04 * noise3(pos.getX(i) * 3, 0, pos.getZ(i) * 3);
    pos.setX(i, pos.getX(i) * k);
    pos.setZ(i, pos.getZ(i) * k);
  }
  const skin = new THREE.Color(C.tomato);
  const flesh = new THREE.Color(C.tomato).lerp(new THREE.Color("#e0806a"), 0.3);
  setColors(geo, (q, out) => {
    out.copy(skin).lerp(flesh, 1 - smoothstep(Math.hypot(q.x, q.z), 0.3, 0.72));
  });
  geo.computeVertexNormals();
  return geo;
}

function useGeometries(tier: QualityTier) {
  const geos = useMemo(() => {
    // Low tier keeps roughly the same vertex budget as before; detail comes from noise, not density.
    // Low tier: ~3.5k triangles total, at or below the original model.
    const low = tier === "low";
    const radial = low ? 24 : 56;
    return {
      topBun: topBun(radial, low ? 7 : 16),
      bottomBun: bottomBun(radial, low ? 3 : 5),
      patty: patty(radial, low ? 2 : 6),
      cheese: cheese(low ? 10 : 16),
      lettuce: lettuce(low ? 40 : 96),
      tomato: tomato(low ? 16 : 32, low ? 1 : 2),
      seed: new THREE.SphereGeometry(1, 6, 4),
    };
  }, [tier]);
  useEffect(() => () => Object.values(geos).forEach((g) => g.dispose()), [geos]);
  return geos;
}

function Seeds({ geometry, count, shadows }: { geometry: THREE.BufferGeometry; count: number; shadows: boolean }) {
  const ref = useRef<THREE.InstancedMesh>(null);

  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const rand = mulberry32(7);
    const { radius: R, rim: b, height: H } = DOME;
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const twist = new THREE.Quaternion();
    const up = new THREE.Vector3(0, 1, 0);
    const n = new THREE.Vector3();
    const p = new THREE.Vector3();
    const s = new THREE.Vector3();
    for (let i = 0; i < count; i++) {
      let a = 0;
      do a = 0.45 + rand() * 1.05;
      while (rand() > Math.cos(a) + 0.15);
      const phi = rand() * Math.PI * 2;
      p.set(R * Math.cos(a) * Math.cos(phi), b + H * Math.pow(Math.sin(a), 0.85), R * Math.cos(a) * Math.sin(phi));
      domeNormal(p, n);
      warpDome(p, 0.012);
      q.setFromUnitVectors(up, n);
      twist.setFromAxisAngle(up, rand() * Math.PI);
      q.multiply(twist);
      const sz = 0.85 + rand() * 0.3;
      s.set(0.056 * sz, 0.022 * sz, 0.031 * sz);
      m.compose(p, q, s);
      mesh.setMatrixAt(i, m);
    }
    mesh.instanceMatrix.needsUpdate = true;
    mesh.computeBoundingSphere();
  }, [count]);

  return (
    <instancedMesh ref={ref} args={[geometry, undefined, count]} castShadow={shadows}>
      <meshStandardMaterial color={C.seeds} roughness={0.85} envMapIntensity={0.5} />
    </instancedMesh>
  );
}

type BurgerProps = { tier: QualityTier; interactive: boolean; shadows: boolean };

/** Procedural burger: zero downloaded assets. Layers spread apart slightly on hover. */
export function Burger({ tier, interactive, shadows }: BurgerProps) {
  const g = useGeometries(tier);
  const root = useRef<THREE.Group>(null);
  const hover = useRef(0);
  const spread = useRef(0);

  useFrame((_, dt) => {
    spread.current = THREE.MathUtils.damp(spread.current, hover.current, 6, dt);
    // direct children are the six stacked layers, bottom → top
    root.current?.children.forEach((layer, i) => {
      layer.position.y = (i - 2.5) * 0.13 * spread.current;
    });
  });

  const hoverHandlers = interactive
    ? {
        onPointerOver: (e: ThreeEvent<PointerEvent>) => {
          if (e.pointerType === "mouse") hover.current = 1;
        },
        onPointerOut: () => (hover.current = 0),
      }
    : {};

  // Matte, food-like surfaces: high roughness, reduced environment reflections.
  const mesh = { castShadow: shadows, receiveShadow: shadows };

  return (
    <group ref={root} scale={0.95} position={[0, 0.05, 0]} {...hoverHandlers}>
      <group>
        <mesh geometry={g.bottomBun} position-y={-0.93} {...mesh}>
          <meshStandardMaterial vertexColors roughness={0.88} envMapIntensity={0.45} />
        </mesh>
      </group>
      <group>
        <mesh geometry={g.patty} position-y={-0.5} {...mesh}>
          <meshStandardMaterial vertexColors roughness={0.95} envMapIntensity={0.35} />
        </mesh>
      </group>
      <group>
        <mesh geometry={g.cheese} position-y={-0.265} rotation-y={Math.PI / 4 + 0.12} {...mesh}>
          <meshStandardMaterial vertexColors roughness={0.6} envMapIntensity={0.5} side={THREE.DoubleSide} />
        </mesh>
      </group>
      <group>
        <mesh geometry={g.tomato} position={[-0.7, -0.2, 0.36]} rotation={[0.04, 0.4, -0.05]} {...mesh}>
          <meshStandardMaterial vertexColors roughness={0.5} envMapIntensity={0.55} />
        </mesh>
        <mesh geometry={g.tomato} position={[0.72, -0.195, -0.34]} rotation={[-0.03, 1.9, 0.05]} {...mesh}>
          <meshStandardMaterial vertexColors roughness={0.5} envMapIntensity={0.55} />
        </mesh>
      </group>
      <group>
        <mesh geometry={g.lettuce} position-y={-0.13} {...mesh}>
          <meshStandardMaterial vertexColors roughness={0.78} envMapIntensity={0.4} side={THREE.DoubleSide} />
        </mesh>
      </group>
      <group>
        {/* inner group: the outer layer group's y is driven by the hover spread */}
        <group position-y={-0.12}>
          <mesh geometry={g.topBun} {...mesh}>
            {/* satin egg-wash sheen, not a plastic gloss */}
            <meshStandardMaterial vertexColors roughness={0.6} envMapIntensity={0.3} />
          </mesh>
          <Seeds geometry={g.seed} count={tier === "low" ? 20 : 60} shadows={shadows} />
        </group>
      </group>
    </group>
  );
}
