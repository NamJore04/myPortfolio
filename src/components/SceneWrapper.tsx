'use client';

import dynamic from 'next/dynamic';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { PerformanceProvider } from '@/hooks/usePerformance';
import { usePortfolioStore } from '@/stores/usePortfolioStore';

// Dynamic import for 3D scene - disable SSR (only works in Client Components)
const Scene = dynamic(
  () => import('@/components/3d/Scene').then((mod) => mod.Scene),
  {
    ssr: false,
    loading: () => null, // Don't use fallback, we handle loading separately
  }
);

export const SceneWrapper = () => {
  const isLoading = usePortfolioStore((state) => state.isLoading);
  
  return (
    <PerformanceProvider>
      {/* Loading Screen - overlays scene during load */}
      {isLoading && <LoadingScreen />}
      
      {/* 3D Scene - renders underneath loading screen */}
      <Scene />
    </PerformanceProvider>
  );
};
