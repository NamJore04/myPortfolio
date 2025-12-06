'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { Preload, OrbitControls } from '@react-three/drei';
import { Camera } from './Camera';
import { CameraController } from './CameraController';
import { Lighting } from './Lighting';
import { Environment } from './Environment';
import { SceneContent } from './SceneContent';
import { PostProcessing } from './effects/PostProcessing';
import { EntryAnimationProvider } from '@/hooks/useEntryAnimation';
import { usePerformance } from '@/hooks/usePerformance';
import { usePortfolioStore } from '@/stores/usePortfolioStore';

const SceneCanvas = () => {
  const { device, settings } = usePerformance();
  const isDragging = usePortfolioStore((state) => state.isDragging);

  return (
    <div className="fixed inset-0 w-full h-full">
      <Canvas
        gl={{
          antialias: !device.isMobile,
          alpha: false,
          powerPreference: device.isLowEnd ? 'low-power' : 'high-performance',
          failIfMajorPerformanceCaveat: false,
        }}
        dpr={settings.dpr}
        style={{ background: '#0f172a' }}
      >
        <Suspense fallback={null}>
          <EntryAnimationProvider>
            <Camera />
            <CameraController />
            <Lighting shadowQuality={settings.shadowQuality} />
            <Environment particleCount={settings.particleCount} />
            <SceneContent 
              enableDataStreams={settings.enableDataStreams}
              enableFloatAnimation={settings.enableFloatAnimation}
            />
            {settings.enablePostProcessing && <PostProcessing />}
          </EntryAnimationProvider>
          
          <OrbitControls 
            enabled={!isDragging}
            enablePan={!device.isMobile && !isDragging}
            enableZoom={!isDragging}
            enableRotate={!isDragging}
            target={[0, 0, 0]}
            // Limit rotation on mobile for better UX
            minPolarAngle={device.isMobile ? Math.PI / 4 : 0}
            maxPolarAngle={device.isMobile ? Math.PI / 2.2 : Math.PI}
          />
          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  );
};

export const Scene = () => {
  return <SceneCanvas />;
};
