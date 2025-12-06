'use client';

import { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import gsap from 'gsap';
import * as THREE from 'three';
import { usePortfolioStore } from '@/stores/usePortfolioStore';
import { projects } from '@/data/projects';

// Default camera position (final resting position)
const DEFAULT_CAMERA_POS = { x: 25, y: 25, z: 25 };

// Starting position for intro (further away, different angle)
const INTRO_CAMERA_POS = { x: 40, y: 40, z: 40 };

/**
 * CameraController - Manages camera zoom/pan based on store state
 * Uses GSAP for smooth animations (per project-rules.md)
 * Includes intro animation when scene first loads
 */
export const CameraController = () => {
  const { camera } = useThree();
  const { cameraPosition, targetIsland, isLoading } = usePortfolioStore();
  const hasAnimated = useRef(false);
  const hasPlayedIntro = useRef(false);
  
  // Intro animation - plays once when loading completes
  useEffect(() => {
    if (isLoading || hasPlayedIntro.current) return;
    
    hasPlayedIntro.current = true;
    
    // Set starting position (far away)
    camera.position.set(
      INTRO_CAMERA_POS.x,
      INTRO_CAMERA_POS.y,
      INTRO_CAMERA_POS.z
    );
    
    // Animate to default position with cinematic ease
    gsap.to(camera.position, {
      x: DEFAULT_CAMERA_POS.x,
      y: DEFAULT_CAMERA_POS.y,
      z: DEFAULT_CAMERA_POS.z,
      duration: 2,
      delay: 0.3, // Small delay for loading screen exit
      ease: 'power2.out',
    });
    
  }, [isLoading, camera]);
  
  // React to camera state changes (zoom to island)
  useEffect(() => {
    if (cameraPosition === 'focused' && targetIsland) {
      // Find target project position
      const project = projects.find(p => 
        targetIsland.includes(p.islandType) || targetIsland.includes(p.id)
      );
      
      if (project?.position) {
        const target = new THREE.Vector3(...project.position);
        
        // Calculate offset camera position (keep isometric angle)
        const offset = new THREE.Vector3(8, 8, 8);
        const newCameraPos = target.clone().add(offset);
        
        // Animate camera movement
        gsap.to(camera.position, {
          x: newCameraPos.x,
          y: newCameraPos.y,
          z: newCameraPos.z,
          duration: 1.2,
          ease: 'power3.inOut',
        });
        
        // Zoom in for focus (OrthographicCamera only)
        if (camera instanceof THREE.OrthographicCamera) {
          gsap.to(camera, {
            zoom: 70,
            duration: 1.2,
            ease: 'power3.inOut',
            onUpdate: () => camera.updateProjectionMatrix(),
          });
        }
        
        hasAnimated.current = true;
      }
    } else if (cameraPosition === 'overview' && hasAnimated.current) {
      // Return to default position
      gsap.to(camera.position, {
        ...DEFAULT_CAMERA_POS,
        duration: 1,
        ease: 'power3.inOut',
      });
      
      if (camera instanceof THREE.OrthographicCamera) {
        gsap.to(camera, {
          zoom: 50,
          duration: 1,
          ease: 'power3.inOut',
          onUpdate: () => camera.updateProjectionMatrix(),
        });
      }
    }
  }, [camera, cameraPosition, targetIsland]);
  
  return null;
};
