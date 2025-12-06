'use client';

import { useRef, useEffect, createContext, useContext, useState, ReactNode } from 'react';
import { Group } from 'three';
import gsap from 'gsap';
import { usePortfolioStore } from '@/stores/usePortfolioStore';

// ============================================
// Entry Animation Context
// ============================================

interface EntryAnimationContextValue {
  isReady: boolean;
  triggerAnimations: () => void;
}

const EntryAnimationContext = createContext<EntryAnimationContextValue>({
  isReady: false,
  triggerAnimations: () => {},
});

export const useEntryAnimationContext = () => useContext(EntryAnimationContext);

/**
 * EntryAnimationProvider - Coordinates all entry animations
 * Waits for loading to complete, then triggers staggered animations
 */
export const EntryAnimationProvider = ({ children }: { children: ReactNode }) => {
  const [isReady, setIsReady] = useState(false);
  const isLoading = usePortfolioStore((state) => state.isLoading);

  useEffect(() => {
    if (!isLoading) {
      // Small delay after loading completes for smooth transition
      const timer = setTimeout(() => setIsReady(true), 300);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  const triggerAnimations = () => setIsReady(true);

  return (
    <EntryAnimationContext.Provider value={{ isReady, triggerAnimations }}>
      {children}
    </EntryAnimationContext.Provider>
  );
};

// ============================================
// Entry Animation Component
// ============================================

interface EntryAnimationProps {
  children: React.ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'scale';
  distance?: number;
}

/**
 * EntryAnimation - Wraps 3D objects with GSAP entry animation
 * Objects scale up and slide in from specified direction
 * 
 * NOTE: The wrapped component should have its position prop passed directly,
 * not relying on the wrapper's position. The animation operates on scale
 * and local position offset.
 * 
 * @param delay - Stagger delay in seconds
 * @param direction - Direction to animate from
 * @param distance - Distance to travel (default: 3)
 */
export const EntryAnimation = ({ 
  children, 
  delay = 0,
  direction = 'up',
  distance = 3,
}: EntryAnimationProps) => {
  const groupRef = useRef<Group>(null);
  const { isReady } = useEntryAnimationContext();
  const hasAnimated = useRef(false);
  
  // Initial setup - hide until ready
  useEffect(() => {
    if (!groupRef.current) return;
    
    const group = groupRef.current;
    group.scale.setScalar(0.001); // Near-zero scale
    group.visible = true; // Keep visible but scaled down
  }, []);
  
  // Animation when ready
  useEffect(() => {
    if (!groupRef.current || !isReady || hasAnimated.current) return;
    
    const group = groupRef.current;
    hasAnimated.current = true;
    
    // Calculate start offset based on direction (for position animation)
    const getOffset = () => {
      switch (direction) {
        case 'up': return { x: 0, y: -distance, z: 0 };
        case 'down': return { x: 0, y: distance, z: 0 };
        case 'left': return { x: -distance, y: 0, z: 0 };
        case 'right': return { x: distance, y: 0, z: 0 };
        case 'scale': return { x: 0, y: 0, z: 0 };
        default: return { x: 0, y: -distance, z: 0 };
      }
    };
    
    const offset = getOffset();
    
    // Set starting position offset
    group.position.set(offset.x, offset.y, offset.z);
    group.scale.setScalar(0.3);
    
    // Create animation timeline
    const tl = gsap.timeline({ delay });
    
    // Position animation - animate back to 0,0,0 (wrapper origin)
    tl.to(group.position, {
      x: 0,
      y: 0,
      z: 0,
      duration: 1,
      ease: 'power3.out',
    }, 0);
    
    // Scale animation with bounce
    tl.to(group.scale, {
      x: 1,
      y: 1,
      z: 1,
      duration: 1.2,
      ease: 'elastic.out(1, 0.5)',
    }, 0);
    
    return () => {
      tl.kill();
    };
  }, [isReady, delay, direction, distance]);
  
  return <group ref={groupRef}>{children}</group>;
};

// ============================================
// useEntryAnimation Hook
// ============================================

/**
 * useEntryAnimation - Hook for custom entry animations
 * Returns ref to attach to group
 * 
 * @param delay - Animation delay in seconds
 * @param options - Animation options
 */
export const useEntryAnimation = (
  delay: number = 0,
  options: {
    direction?: 'up' | 'down' | 'left' | 'right';
    distance?: number;
    scale?: number;
  } = {}
) => {
  const groupRef = useRef<Group>(null);
  const { isReady } = useEntryAnimationContext();
  const hasAnimated = useRef(false);
  const originalY = useRef(0);
  
  const { direction = 'up', distance = 2, scale = 0.5 } = options;
  
  useEffect(() => {
    if (!groupRef.current) return;
    originalY.current = groupRef.current.position.y;
  }, []);
  
  useEffect(() => {
    if (!groupRef.current || !isReady || hasAnimated.current) return;
    
    hasAnimated.current = true;
    const group = groupRef.current;
    
    // Set initial state
    const offsetY = direction === 'up' ? -distance : direction === 'down' ? distance : 0;
    gsap.set(group.position, { y: originalY.current + offsetY });
    gsap.set(group.scale, { x: scale, y: scale, z: scale });
    
    // Animate in
    gsap.to(group.position, {
      y: originalY.current,
      duration: 1.2,
      delay,
      ease: 'power3.out',
    });
    
    gsap.to(group.scale, {
      x: 1,
      y: 1,
      z: 1,
      duration: 1,
      delay: delay + 0.1,
      ease: 'elastic.out(1, 0.6)',
    });
  }, [isReady, delay, direction, distance, scale]);
  
  return groupRef;
};

// ============================================
// Animation Presets
// ============================================

export const ENTRY_DELAYS = {
  hero: 0,
  aiIsland: 0.2,
  ecommerceIsland: 0.4,
  visionIsland: 0.6,
  ocrIsland: 0.7,
  flutterIsland: 0.8,
  dataStreams: 1.0,
} as const;
