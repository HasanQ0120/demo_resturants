"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  Float,
  Lightformer,
  PerformanceMonitor,
  PresentationControls,
} from "@react-three/drei";
import { Suspense, lazy, useRef, useState, type ReactNode } from "react";
import * as THREE from "three";
import { siteConfig } from "@/config/site";
import { Burger } from "./Burger";
import { detectTier, isCoarsePointer, prefersReducedMotion, type QualityTier } from "./quality";

const Effects = lazy(() => import("./Effects"));

type HeroSceneProps = {
  /** false pauses the render loop (off-screen / hidden tab). */
  active: boolean;
  onReady: () => void;
};

export default function HeroScene({ active, onReady }: HeroSceneProps) {
  const [initialTier] = useState(detectTier);
  const [reducedMotion] = useState(prefersReducedMotion);
  const [coarse] = useState(isCoarsePointer);
  const [degraded, setDegraded] = useState(false);
  const tier: QualityTier = degraded ? "low" : initialTier;
  const maxDpr = tier === "low" ? 1.5 : 2;
  const [dpr, setDpr] = useState(maxDpr);

  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={Math.min(dpr, maxDpr)}
      // MSAA is cheap on tile-based mobile GPUs and avoids jagged edges at DPR ≤ 1.5
      gl={{ antialias: true, powerPreference: "high-performance", alpha: true }}
      camera={{ position: [0, 0.55, 7], fov: 35 }}
      // Real shadow maps only on capable devices; low tier relies on baked vertex-colour AO instead.
      shadows={initialTier === "high" ? "percentage" : false}
      style={{ touchAction: "pan-y" }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 0.95;
        requestAnimationFrame(onReady);
      }}
    >
      {/* Adaptive resolution: measures real FPS and scales DPR; drops to the low tier if the device struggles. */}
      <PerformanceMonitor
        flipflops={3}
        onChange={({ factor }) => setDpr(Math.round((1 + (maxDpr - 1) * factor) * 4) / 4)}
        onDecline={() => setDegraded(true)}
        onFallback={() => {
          setDegraded(true);
          setDpr(1);
        }}
      />

      {/* Low-key food lighting: one strong warm key from upper right, dim cool fill, soft warm rim. */}
      <ambientLight intensity={0.08} />
      <hemisphereLight args={["#fff1de", "#1a0f08", 0.35]} />
      <directionalLight
        position={[4.5, 6, 3]}
        intensity={3}
        color="#ffe6c7"
        castShadow={tier === "high"}
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.03}
        shadow-radius={3}
        shadow-camera-left={-2.5}
        shadow-camera-right={2.5}
        shadow-camera-top={2.5}
        shadow-camera-bottom={-2.5}
        shadow-camera-near={1}
        shadow-camera-far={16}
      />
      <directionalLight position={[-5, 0.5, 3]} intensity={0.3} color="#c9d4e6" />
      <pointLight position={[-3.5, 1.8, -3.5]} intensity={18} color={siteConfig.burger3D.rimLight} />

      <Environment resolution={tier === "low" ? 16 : 64} frames={1} environmentIntensity={0.55}>
        <Lightformer form="rect" intensity={1.6} position={[2, 5, 2]} scale={[5, 2, 1]} target={[0, 0, 0]} />
        <Lightformer
          form="rect"
          intensity={0.8}
          color={siteConfig.burger3D.rimLight}
          position={[-5, 0.5, -2]}
          scale={[2, 6, 1]}
          target={[0, 0, 0]}
        />
      </Environment>

      <PresentationControls
        global={false}
        cursor={!coarse}
        snap={0.5}
        speed={1.6}
        rotation={[0.18, -0.4, 0]}
        polar={[-0.05, 0.05]}
        azimuth={[-Math.PI, Math.PI]}
      >
        <Float speed={reducedMotion ? 0 : 1.6} rotationIntensity={0.15} floatIntensity={0.5} floatingRange={[-0.06, 0.06]}>
          <Spinner autoRotate={!reducedMotion}>
            <Burger tier={tier} interactive={!coarse} shadows={tier === "high"} />
          </Spinner>
        </Float>
      </PresentationControls>

      {tier === "high" && (
        <ContactShadows position={[0, -1.55, 0]} opacity={0.75} scale={6} blur={2.2} far={3} resolution={256} frames={1} />
      )}

      {tier === "high" && (
        <Suspense fallback={null}>
          <Effects />
        </Suspense>
      )}
    </Canvas>
  );
}

/** Slow idle spin + a gentle tilt/lift tied to page scroll (read per frame, no React re-renders). */
function Spinner({ children, autoRotate }: { children: ReactNode; autoRotate: boolean }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    const g = ref.current;
    if (!g) return;
    if (autoRotate) g.rotation.y += dt * 0.35;
    const t = Math.min(window.scrollY / window.innerHeight, 1);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, t * 0.45, 4, dt);
    g.position.y = THREE.MathUtils.damp(g.position.y, t * 0.35, 4, dt);
  });
  return <group ref={ref}>{children}</group>;
}
