'use client';

import { PerspectiveCamera } from '@react-three/drei';

/**
 * Camera - Isometric-style perspective camera
 * Uses perspective for better Html overlay handling
 */
export const Camera = () => {
  return (
    <PerspectiveCamera
      makeDefault
      fov={35}
      position={[25, 25, 25]}
      near={0.1}
      far={1000}
    />
  );
};
