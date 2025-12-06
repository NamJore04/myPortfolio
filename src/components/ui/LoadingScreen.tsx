'use client';

import { useEffect, useState } from 'react';
import { usePortfolioStore } from '@/stores/usePortfolioStore';

/**
 * LoadingScreen - Initial loading state
 * Clean, minimal design with animated elements
 * Syncs with store to trigger entry animations
 * Uses Tailwind CSS classes to avoid hydration mismatch
 */
export const LoadingScreen = () => {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const setLoading = usePortfolioStore((state) => state.setLoading);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        // Smooth progress curve
        const remaining = 100 - prev;
        const increment = Math.max(1, remaining * 0.1 + Math.random() * 5);
        return Math.min(prev + increment, 100);
      });
    }, 150);

    return () => clearInterval(interval);
  }, []);

  // Handle exit animation when progress reaches 100
  useEffect(() => {
    if (progress >= 100 && !isExiting) {
      // Start exit animation
      const exitTimer = setTimeout(() => {
        setIsExiting(true);
        setLoading(false); // This triggers entry animations
      }, 500);

      // Hide completely after exit animation
      const hideTimer = setTimeout(() => {
        setIsHidden(true);
      }, 1200);

      return () => {
        clearTimeout(exitTimer);
        clearTimeout(hideTimer);
      };
    }
  }, [progress, isExiting, setLoading]);

  if (isHidden) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0f172a] transition-all duration-700 ${
        isExiting ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
      }`}
    >
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0 animate-grid-move"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 212, 255, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 212, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Logo */}
      <div className="relative mb-8">
        <div 
          className="w-16 h-16 border-2 border-cyan-400 rounded-lg animate-pulse-glow glow-cyan"
        />
        <div 
          className="absolute inset-0 w-16 h-16 border-2 border-purple-500 rounded-lg opacity-50 animate-spin-slow"
        />
        {/* Center dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div 
            className="w-2 h-2 bg-cyan-400 rounded-full"
            style={{ boxShadow: '0 0 10px rgba(0, 212, 255, 0.8)' }}
          />
        </div>
      </div>

      {/* Text */}
      <h2 className="text-white text-xl font-light tracking-[0.3em] mb-8">
        INITIALIZING
      </h2>

      {/* Progress Bar */}
      <div className="w-48 h-1 bg-gray-800/50 rounded-full overflow-hidden backdrop-blur">
        <div
          className="h-full rounded-full transition-all duration-200 ease-out"
          style={{
            width: `${Math.min(progress, 100)}%`,
            background: 'linear-gradient(90deg, #00d4ff, #a855f7)',
            boxShadow: '0 0 10px rgba(0, 212, 255, 0.5)',
          }}
        />
      </div>

      {/* Progress Text */}
      <p className="text-gray-500 text-xs mt-4 font-mono tabular-nums">
        {Math.min(Math.floor(progress), 100)}%
      </p>

      {/* Loading tip */}
      <p className="text-gray-600 text-xs mt-8 max-w-xs text-center">
        Building the Digital Nexus Garden...
      </p>
    </div>
  );
};
