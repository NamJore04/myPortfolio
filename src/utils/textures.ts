import * as THREE from 'three';

/**
 * Creates a toon gradient texture for MeshToonMaterial
 * Safe for SSR - returns null if document is not available
 */
export const createToonGradient = (colors: string[] = ['#1a1a2e', '#16213e', '#1f3460']): THREE.Texture | null => {
  // SSR safety check
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return null;
  }
  
  const canvas = document.createElement('canvas');
  canvas.width = colors.length;
  canvas.height = 1;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) return null;
  
  colors.forEach((color, i) => {
    ctx.fillStyle = color;
    ctx.fillRect(i, 0, 1, 1);
  });
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.NearestFilter;
  texture.magFilter = THREE.NearestFilter;
  
  return texture;
};

/**
 * Default color schemes for different island types
 */
export const TOON_GRADIENTS = {
  default: ['#1a1a2e', '#16213e', '#1f3460'],
  purple: ['#1a1a2e', '#2d1b4e', '#4a1d6e'],
  cyan: ['#1a1a2e', '#16213e', '#1f3460'],
  green: ['#1a1a2e', '#163e2e', '#1f604a'],
};
