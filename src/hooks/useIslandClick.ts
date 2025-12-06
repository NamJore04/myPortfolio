'use client';

import { useCallback } from 'react';
import { useThree } from '@react-three/fiber';
import gsap from 'gsap';
import { usePortfolioStore } from '@/stores/usePortfolioStore';
import type { Project } from '@/types';

interface UseIslandClickOptions {
  project: Project;
  islandId: string;
}

/**
 * useIslandClick - Handles island click interaction
 * - Zooms camera back to Hero island (center)
 * - Shows project info on TV screen
 * - Does NOT open modal directly (user clicks "View Details" on TV)
 */
export const useIslandClick = ({ project, islandId }: UseIslandClickOptions) => {
  const { camera } = useThree();
  const { selectIsland, activeIsland, cameraPosition } = usePortfolioStore();

  const handleClick = useCallback(() => {
    // Don't re-click same island
    if (activeIsland === islandId) return;

    // Select the project immediately (shows on TV)
    selectIsland(islandId, project);

    // Animate camera back to Hero island (center) for better TV view
    gsap.to(camera.position, {
      x: 15,
      y: 12,
      z: 15,
      duration: 1.2,
      ease: 'power3.inOut',
    });
    
    // Also animate camera to look at center (Hero island)
    gsap.to(camera.rotation, {
      x: -0.6,
      y: 0.6,
      z: 0.35,
      duration: 1.2,
      ease: 'power3.inOut',
    });
  }, [camera, project, islandId, selectIsland, activeIsland]);

  return {
    handleClick,
    isActive: activeIsland === islandId,
    isFocused: cameraPosition === 'focused' && activeIsland === islandId,
  };
};

/**
 * useResetView - Hook to reset camera to overview position
 */
export const useResetView = () => {
  const { camera } = useThree();
  const { closeModal, cameraPosition } = usePortfolioStore();

  const resetView = useCallback(() => {
    // Animate camera back to default
    gsap.to(camera.position, {
      x: 25,
      y: 25,
      z: 25,
      duration: 1,
      ease: 'power3.inOut',
    });

    closeModal();
  }, [camera, closeModal]);

  return {
    resetView,
    isOverview: cameraPosition === 'overview',
  };
};
