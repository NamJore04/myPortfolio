'use client';

import { useEffect, useRef } from 'react';

/**
 * SkipLink - Allows keyboard users to skip navigation
 * Appears on focus, links to main content
 */
export const SkipLink = () => {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-cyan-500 focus:text-white focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-300"
    >
      Skip to main content
    </a>
  );
};

/**
 * useFocusTrap - Traps focus within a container (for modals)
 */
export const useFocusTrap = (isActive: boolean) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!isActive || !containerRef.current) return;
    
    const container = containerRef.current;
    const focusableElements = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    // Focus first element when trap activates
    firstElement?.focus();
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };
    
    container.addEventListener('keydown', handleKeyDown);
    return () => container.removeEventListener('keydown', handleKeyDown);
  }, [isActive]);
  
  return containerRef;
};

/**
 * VisuallyHidden - Screen reader only text
 */
export const VisuallyHidden = ({ children }: { children: React.ReactNode }) => {
  return (
    <span className="sr-only">
      {children}
    </span>
  );
};

/**
 * LiveRegion - Announces dynamic content changes
 */
export const LiveRegion = ({ 
  message, 
  politeness = 'polite' 
}: { 
  message: string; 
  politeness?: 'polite' | 'assertive';
}) => {
  return (
    <div
      role="status"
      aria-live={politeness}
      aria-atomic="true"
      className="sr-only"
    >
      {message}
    </div>
  );
};

/**
 * Accessible keyboard instructions for 3D scene
 */
export const SceneInstructions = () => {
  return (
    <div className="sr-only" role="note" aria-label="Keyboard navigation instructions">
      <p>
        Use mouse or touch to rotate the 3D scene. 
        Click on project islands to view details. 
        Press Escape to close modals.
        Use Tab to navigate through focusable elements.
      </p>
    </div>
  );
};
