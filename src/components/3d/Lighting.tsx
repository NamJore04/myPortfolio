'use client';

interface LightingProps {
  shadowQuality?: 'none' | 'low' | 'high';
}

/**
 * Toon-friendly lighting setup
 * - Directional light for main shadows (hard edge for cel-shading)
 * - Ambient for fill
 * - Hemisphere for subtle color variation
 * 
 * @param shadowQuality - Shadow map quality based on device
 */
export const Lighting = ({ shadowQuality = 'high' }: LightingProps) => {
  const shadowMapSize = shadowQuality === 'high' ? 1024 : shadowQuality === 'low' ? 512 : 0;
  const castShadow = shadowQuality !== 'none';

  return (
    <>
      {/* Main directional light - creates hard shadows for toon effect */}
      <directionalLight
        position={[5, 10, 5]}
        intensity={1.5}
        color="#ffffff"
        castShadow={castShadow}
        shadow-mapSize={[shadowMapSize, shadowMapSize]}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      
      {/* Ambient light - base illumination */}
      <ambientLight intensity={0.4} color="#e0e7ff" />
      
      {/* Hemisphere light - sky/ground color variation */}
      <hemisphereLight
        args={['#87ceeb', '#362d59', 0.5]}
        position={[0, 50, 0]}
      />
      
      {/* Subtle rim light for depth */}
      <directionalLight
        position={[-5, 5, -5]}
        intensity={0.3}
        color="#a855f7"
      />
    </>
  );
};
