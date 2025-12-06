'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import { HeroIsland } from './islands/HeroIsland';
import { AIIsland } from './islands/AIIsland';
import { EcommerceIsland } from './islands/EcommerceIsland';
import { VisionIsland } from './islands/VisionIsland';
import { OCRIsland } from './islands/OCRIsland';
import { FlutterIsland } from './islands/FlutterIsland';
import { DataStream } from './effects/DataStreams';
import { EntryAnimation, ENTRY_DELAYS } from '@/hooks/useEntryAnimation';

interface SceneContentProps {
  enableDataStreams?: boolean;
  enableFloatAnimation?: boolean;
}

/**
 * Island positions - Hexagonal layout around Hero
 * Now using polar coordinates for uniform rotation
 * All islands at same distance (radius = 12) for even distribution
 */
const ORBIT_RADIUS = 12;
const ORBIT_SPEED = 0.05; // Rotation speed (radians per second)

// Angles for 5 islands evenly distributed (360° / 5 = 72° = 1.257 rad)
const ISLAND_ANGLES = {
  aiIsland: 0,                    // 0°
  ecommerce: Math.PI * 0.4,       // 72°
  flutter: Math.PI * 0.8,         // 144°
  vision: Math.PI * 1.2,          // 216°
  ocr: Math.PI * 1.6,             // 288°
};

// Island colors for data streams
const ISLAND_COLORS = {
  aiIsland: '#a855f7',      // Purple
  ecommerce: '#00d4ff',     // Cyan
  flutter: '#02569B',       // Flutter blue
  vision: '#34d399',        // Green
  ocr: '#f97316',           // Orange
};

/**
 * Calculate static position based on angle
 */
const getPosition = (angle: number): [number, number, number] => {
  return [
    Math.cos(angle) * ORBIT_RADIUS,
    0,
    Math.sin(angle) * ORBIT_RADIUS,
  ];
};

/**
 * OrbitingIslands - Wrapper that rotates all project islands AND data streams uniformly
 * DataStreams are now INSIDE this group so they rotate together
 */
interface OrbitingIslandsProps {
  enableFloatAnimation: boolean;
  enableDataStreams: boolean;
}

const OrbitingIslands = ({ enableFloatAnimation, enableDataStreams }: OrbitingIslandsProps) => {
  const groupRef = useRef<Group>(null);
  
  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    // Uniform rotation around Y axis
    groupRef.current.rotation.y = clock.elapsedTime * ORBIT_SPEED;
  });
  
  // Pre-calculate all island positions (local to the rotating group)
  const islandPositions = useMemo(() => ({
    aiIsland: getPosition(ISLAND_ANGLES.aiIsland),
    ecommerce: getPosition(ISLAND_ANGLES.ecommerce),
    flutter: getPosition(ISLAND_ANGLES.flutter),
    vision: getPosition(ISLAND_ANGLES.vision),
    ocr: getPosition(ISLAND_ANGLES.ocr),
  }), []);
  
  // Hero position in local space (center)
  const heroLocalPos: [number, number, number] = [0, 1.5, 0];
  
  // Adjusted island Y positions for stream endpoints
  const getStreamEnd = (pos: [number, number, number]): [number, number, number] => [pos[0], pos[1] + 1.5, pos[2]];
  
  return (
    <group ref={groupRef}>
      {/* AI Island */}
      <EntryAnimation delay={ENTRY_DELAYS.aiIsland} direction="left">
        <AIIsland 
          position={islandPositions.aiIsland} 
          enableFloat={enableFloatAnimation} 
        />
      </EntryAnimation>
      
      {/* Ecommerce Island */}
      <EntryAnimation delay={ENTRY_DELAYS.ecommerceIsland} direction="right">
        <EcommerceIsland 
          position={islandPositions.ecommerce} 
          enableFloat={enableFloatAnimation} 
        />
      </EntryAnimation>
      
      {/* Flutter Island */}
      <EntryAnimation delay={ENTRY_DELAYS.flutterIsland} direction="right">
        <FlutterIsland 
          position={islandPositions.flutter} 
          enableFloat={enableFloatAnimation} 
        />
      </EntryAnimation>
      
      {/* Vision Island */}
      <EntryAnimation delay={ENTRY_DELAYS.visionIsland} direction="up">
        <VisionIsland 
          position={islandPositions.vision} 
          enableFloat={enableFloatAnimation} 
        />
      </EntryAnimation>
      
      {/* OCR Island */}
      <EntryAnimation delay={ENTRY_DELAYS.ocrIsland} direction="left">
        <OCRIsland 
          position={islandPositions.ocr} 
          enableFloat={enableFloatAnimation} 
        />
      </EntryAnimation>
      
      {/* Data Streams - INSIDE rotating group so they follow islands */}
      {enableDataStreams && (
        <EntryAnimation delay={ENTRY_DELAYS.dataStreams} direction="scale">
          <group>
            {/* Hero to AI Trading */}
            <DataStream 
              start={heroLocalPos} 
              end={getStreamEnd(islandPositions.aiIsland)} 
              color={ISLAND_COLORS.aiIsland} 
              speed={0.3}
            />
            
            {/* Hero to E-commerce */}
            <DataStream 
              start={heroLocalPos} 
              end={getStreamEnd(islandPositions.ecommerce)} 
              color={ISLAND_COLORS.ecommerce} 
              speed={0.35}
            />
            
            {/* Hero to Flutter */}
            <DataStream 
              start={heroLocalPos} 
              end={getStreamEnd(islandPositions.flutter)} 
              color={ISLAND_COLORS.flutter} 
              speed={0.38}
            />
            
            {/* Hero to Vision */}
            <DataStream 
              start={heroLocalPos} 
              end={getStreamEnd(islandPositions.vision)} 
              color={ISLAND_COLORS.vision} 
              speed={0.4}
            />
            
            {/* Hero to OCR */}
            <DataStream 
              start={heroLocalPos} 
              end={getStreamEnd(islandPositions.ocr)} 
              color={ISLAND_COLORS.ocr} 
              speed={0.32}
            />
            
            {/* Cross connections (web effect) - using adjacent islands */}
            <DataStream 
              start={getStreamEnd(islandPositions.aiIsland)} 
              end={getStreamEnd(islandPositions.ecommerce)} 
              color="#ffffff" 
              particleCount={15}
              speed={0.18}
            />
            <DataStream 
              start={getStreamEnd(islandPositions.ecommerce)} 
              end={getStreamEnd(islandPositions.flutter)} 
              color="#ffffff" 
              particleCount={15}
              speed={0.2}
            />
            <DataStream 
              start={getStreamEnd(islandPositions.flutter)} 
              end={getStreamEnd(islandPositions.vision)} 
              color="#ffffff" 
              particleCount={15}
              speed={0.22}
            />
            <DataStream 
              start={getStreamEnd(islandPositions.vision)} 
              end={getStreamEnd(islandPositions.ocr)} 
              color="#ffffff" 
              particleCount={15}
              speed={0.19}
            />
            <DataStream 
              start={getStreamEnd(islandPositions.ocr)} 
              end={getStreamEnd(islandPositions.aiIsland)} 
              color="#ffffff" 
              particleCount={15}
              speed={0.21}
            />
          </group>
        </EntryAnimation>
      )}
    </group>
  );
};

/**
 * SceneContent - Contains all 3D objects in the scene
 * Layout: Hero center, projects surrounding and rotating uniformly
 * Contact icons orbit asynchronously around Hero (handled in HeroIsland)
 */
export const SceneContent = ({ 
  enableDataStreams = true,
  enableFloatAnimation = true,
}: SceneContentProps) => {
  return (
    <group>
      {/* Hero Island - Center (animates first) */}
      <EntryAnimation delay={ENTRY_DELAYS.hero} direction="scale">
        <HeroIsland enableFloat={enableFloatAnimation} />
      </EntryAnimation>
      
      {/* Project Islands + Data Streams - All rotating uniformly together */}
      <OrbitingIslands 
        enableFloatAnimation={enableFloatAnimation} 
        enableDataStreams={enableDataStreams}
      />
    </group>
  );
};
