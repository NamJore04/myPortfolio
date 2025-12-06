import { useCallback, useState } from 'react';
import { usePortfolioStore } from '@/stores/usePortfolioStore';
import type { Project } from '@/types';

/**
 * useIslandInteraction - Handles hover and click for islands
 * Follows project-rules.md: Extract logic to custom hooks
 */
export const useIslandInteraction = (islandId: string, project?: Project) => {
  const { 
    hoveredIsland, 
    setHoveredIsland, 
    selectIsland,
  } = usePortfolioStore();
  
  const isHovered = hoveredIsland === islandId;
  
  const handlers = {
    onPointerEnter: useCallback(() => {
      setHoveredIsland(islandId);
      document.body.style.cursor = 'pointer';
    }, [islandId, setHoveredIsland]),
    
    onPointerLeave: useCallback(() => {
      setHoveredIsland(null);
      document.body.style.cursor = 'default';
    }, [setHoveredIsland]),
    
    onClick: useCallback(() => {
      if (project) {
        selectIsland(islandId, project);
      }
    }, [islandId, project, selectIsland]),
  };
  
  return { isHovered, handlers };
};
