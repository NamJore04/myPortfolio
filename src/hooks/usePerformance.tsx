'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useDeviceDetection, DeviceCapabilities, PerformanceSettings } from '@/hooks/useDeviceDetection';

interface PerformanceContextValue {
  device: DeviceCapabilities;
  settings: PerformanceSettings;
}

const PerformanceContext = createContext<PerformanceContextValue | null>(null);

/**
 * PerformanceProvider - Provides device/performance context to all components
 */
export const PerformanceProvider = ({ children }: { children: ReactNode }) => {
  const { device, performance: settings } = useDeviceDetection();

  return (
    <PerformanceContext.Provider value={{ device, settings }}>
      {children}
    </PerformanceContext.Provider>
  );
};

/**
 * usePerformance - Access performance settings anywhere
 */
export const usePerformance = (): PerformanceContextValue => {
  const context = useContext(PerformanceContext);
  
  if (!context) {
    // Fallback for SSR or outside provider
    return {
      device: {
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        isTouchDevice: false,
        isLowEnd: false,
        isHighEnd: true,
        pixelRatio: 1,
        screenWidth: 1920,
        screenHeight: 1080,
        prefersReducedMotion: false,
      },
      settings: {
        particleCount: 30,
        enablePostProcessing: true,
        enableDataStreams: true,
        enableFloatAnimation: true,
        shadowQuality: 'high',
        dpr: [1, 2],
      },
    };
  }
  
  return context;
};
