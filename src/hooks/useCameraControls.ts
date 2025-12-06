import { useCallback, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import gsap from 'gsap';
import * as THREE from 'three';
import { usePortfolioStore } from '@/stores/usePortfolioStore';

/**
 * useCameraControls - Camera zoom and pan controls
 * Uses GSAP for smooth animations (per project-rules.md)
 */
export const useCameraControls = () => {
  const { camera } = useThree();
  const initialPosition = useRef(new THREE.Vector3(10, 10, 10));
  const initialZoom = useRef(50);
  
  const { cameraPosition, resetCamera } = usePortfolioStore();
  
  // Zoom to specific island position
  const zoomToIsland = useCallback((targetPosition: [number, number, number]) => {
    const target = new THREE.Vector3(...targetPosition);
    
    // Calculate camera position offset from target
    const offset = new THREE.Vector3(5, 5, 5);
    const newCameraPos = target.clone().add(offset);
    
    // Animate camera movement
    gsap.to(camera.position, {
      x: newCameraPos.x,
      y: newCameraPos.y,
      z: newCameraPos.z,
      duration: 1.2,
      ease: 'power3.inOut',
    });
    
    // Animate zoom if orthographic
    if (camera instanceof THREE.OrthographicCamera) {
      gsap.to(camera, {
        zoom: 80,
        duration: 1.2,
        ease: 'power3.inOut',
        onUpdate: () => camera.updateProjectionMatrix(),
      });
    }
  }, [camera]);
  
  // Reset to overview position
  const zoomOut = useCallback(() => {
    gsap.to(camera.position, {
      x: initialPosition.current.x,
      y: initialPosition.current.y,
      z: initialPosition.current.z,
      duration: 1,
      ease: 'power3.inOut',
    });
    
    if (camera instanceof THREE.OrthographicCamera) {
      gsap.to(camera, {
        zoom: initialZoom.current,
        duration: 1,
        ease: 'power3.inOut',
        onUpdate: () => camera.updateProjectionMatrix(),
      });
    }
    
    resetCamera();
  }, [camera, resetCamera]);
  
  return { zoomToIsland, zoomOut, cameraPosition };
};
