"use client";

import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";

/** High-tier only. Lazy-loaded so phones never download postprocessing. */
export default function Effects() {
  return (
    <EffectComposer multisampling={0} enableNormalPass={false}>
      <Bloom mipmapBlur luminanceThreshold={0.92} luminanceSmoothing={0.15} intensity={0.25} />
      <Vignette offset={0.25} darkness={0.55} />
    </EffectComposer>
  );
}
