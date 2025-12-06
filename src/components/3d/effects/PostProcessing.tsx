'use client';

import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';

/**
 * PostProcessing - Visual effects pipeline
 * - Bloom: Glow effect for emissive materials
 * - Vignette: Subtle edge darkening for focus
 * 
 * Note: Outline effect removed - using material-based outlines instead
 * for better performance and toon aesthetic control
 */
export const PostProcessing = () => {
  return (
    <EffectComposer>
      {/* Bloom - Creates glow on bright/emissive surfaces */}
      <Bloom
        intensity={0.5}
        luminanceThreshold={0.6}
        luminanceSmoothing={0.9}
        mipmapBlur
      />
      
      {/* Vignette - Subtle edge darkening */}
      <Vignette
        offset={0.3}
        darkness={0.5}
        blendFunction={BlendFunction.NORMAL}
      />
    </EffectComposer>
  );
};
