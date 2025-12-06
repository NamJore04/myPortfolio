'use client';

import { useState, useEffect, useMemo } from 'react';

export interface DeviceCapabilities {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isTouchDevice: boolean;
  isLowEnd: boolean;
  isHighEnd: boolean;
  pixelRatio: number;
  screenWidth: number;
  screenHeight: number;
  prefersReducedMotion: boolean;
}

export interface PerformanceSettings {
  particleCount: number;
  enablePostProcessing: boolean;
  enableDataStreams: boolean;
  enableFloatAnimation: boolean;
  shadowQuality: 'none' | 'low' | 'high';
  dpr: [number, number];
}

/**
 * useDeviceDetection - Detect device type and capabilities
 * Returns performance settings based on device
 */
export const useDeviceDetection = (): {
  device: DeviceCapabilities;
  performance: PerformanceSettings;
} => {
  const [device, setDevice] = useState<DeviceCapabilities>({
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
  });

  useEffect(() => {
    const detectDevice = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const pixelRatio = window.devicePixelRatio || 1;
      
      // Device type detection
      const isMobile = width < 768;
      const isTablet = width >= 768 && width < 1024;
      const isDesktop = width >= 1024;
      
      // Touch detection
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      // Performance detection
      const hardwareConcurrency = navigator.hardwareConcurrency || 4;
      const deviceMemory = (navigator as any).deviceMemory || 4;
      
      // Low-end: mobile with low specs or old devices
      const isLowEnd = (
        (isMobile && pixelRatio < 2) ||
        hardwareConcurrency <= 2 ||
        deviceMemory <= 2
      );
      
      // High-end: desktop with good specs
      const isHighEnd = (
        isDesktop &&
        pixelRatio >= 1 &&
        hardwareConcurrency >= 4 &&
        deviceMemory >= 4
      );
      
      // Check for reduced motion preference
      const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;

      setDevice({
        isMobile,
        isTablet,
        isDesktop,
        isTouchDevice,
        isLowEnd,
        isHighEnd,
        pixelRatio,
        screenWidth: width,
        screenHeight: height,
        prefersReducedMotion,
      });
    };

    detectDevice();
    
    // Re-detect on resize
    window.addEventListener('resize', detectDevice);
    return () => window.removeEventListener('resize', detectDevice);
  }, []);

  // Calculate performance settings based on device
  const performance = useMemo<PerformanceSettings>(() => {
    if (device.isLowEnd || device.prefersReducedMotion) {
      // Low-end / Reduced motion mode
      return {
        particleCount: 10,
        enablePostProcessing: false,
        enableDataStreams: false,
        enableFloatAnimation: false,
        shadowQuality: 'none',
        dpr: [1, 1],
      };
    }
    
    if (device.isMobile) {
      // Mobile mode
      return {
        particleCount: 15,
        enablePostProcessing: false,
        enableDataStreams: true,
        enableFloatAnimation: true,
        shadowQuality: 'none',
        dpr: [1, 1.5],
      };
    }
    
    if (device.isTablet) {
      // Tablet mode
      return {
        particleCount: 20,
        enablePostProcessing: true,
        enableDataStreams: true,
        enableFloatAnimation: true,
        shadowQuality: 'low',
        dpr: [1, 1.5],
      };
    }
    
    // Desktop / High-end mode
    return {
      particleCount: 30,
      enablePostProcessing: true,
      enableDataStreams: true,
      enableFloatAnimation: true,
      shadowQuality: 'high',
      dpr: [1, 2],
    };
  }, [device]);

  return { device, performance };
};

// Export singleton for use outside React
let cachedDevice: DeviceCapabilities | null = null;

export const getDeviceCapabilities = (): DeviceCapabilities => {
  if (typeof window === 'undefined') {
    return {
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
    };
  }
  
  if (cachedDevice) return cachedDevice;
  
  const width = window.innerWidth;
  cachedDevice = {
    isMobile: width < 768,
    isTablet: width >= 768 && width < 1024,
    isDesktop: width >= 1024,
    isTouchDevice: 'ontouchstart' in window,
    isLowEnd: width < 768 && (navigator.hardwareConcurrency || 4) <= 2,
    isHighEnd: width >= 1024,
    pixelRatio: window.devicePixelRatio || 1,
    screenWidth: width,
    screenHeight: window.innerHeight,
    prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  };
  
  return cachedDevice;
};
