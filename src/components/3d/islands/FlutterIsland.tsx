'use client';

import { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Float } from '@react-three/drei';
import * as THREE from 'three';
import type { Group, Mesh } from 'three';
import { projects } from '@/data/projects';
import { createToonGradient } from '@/utils/textures';
import { useIslandClick } from '@/hooks/useIslandClick';
import { MiniTurbine } from '../AntiGravityTurbine';

interface FlutterIslandProps {
  position?: [number, number, number];
  enableFloat?: boolean;
}

// Get Flutter project data
const flutterProject = projects.find(p => p.id === 'flutter-ecommerce')!;

/**
 * FlutterIsland - Represents Cross-platform E-commerce App
 * Visual: Mobile phone mockup + floating widgets
 * Theme: Flutter, Dart, Cross-platform, Firebase
 */
export const FlutterIsland = ({ position = [4, 0, 8], enableFloat = true }: FlutterIslandProps) => {
  const groupRef = useRef<Group>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  // Click-to-zoom interaction
  const { handleClick, isActive } = useIslandClick({
    project: flutterProject,
    islandId: 'flutter-island',
  });

  const content = (
    <>
      {/* Island Base */}
      <IslandBase isHovered={isHovered || isActive} />
      
      {/* Phone Mockup */}
      <PhoneMockup position={[0, 1.2, 0]} />
      
      {/* Floating Widgets */}
      <FloatingWidgets />
      
      {/* Platform Icons */}
      <PlatformIcons position={[0, 0.5, 1]} />
      
      {/* Flutter Logo Bird */}
      <FlutterBird position={[1.2, 2, 0]} />
    </>
  );

  return (
    <group 
      ref={groupRef} 
      position={position}
      onPointerOver={() => setIsHovered(true)}
      onPointerOut={() => setIsHovered(false)}
      onClick={handleClick}
    >
      {enableFloat ? (
        <Float
          speed={1.5}
          rotationIntensity={0.05}
          floatIntensity={0.2}
          floatingRange={[-0.1, 0.1]}
        >
          {content}
        </Float>
      ) : content}

      {/* Project Label */}
      <Html
        position={[0, 3.5, 0]}
        center
        distanceFactor={15}
        className="pointer-events-none select-none"
      >
        <div className={`bg-gradient-to-r from-blue-900/80 to-cyan-900/80 backdrop-blur-sm px-4 py-2 rounded-lg border transition-all duration-300 cursor-pointer ${isHovered || isActive ? 'border-blue-400 shadow-lg shadow-blue-500/30' : 'border-blue-500/30'}`}>
          <h3 className="text-white font-bold text-sm whitespace-nowrap">
            Flutter E-commerce
          </h3>
          <div className="flex gap-3 mt-1 text-xs text-gray-300">
            <span>iOS/Android</span>
            <span>Firebase</span>
          </div>
          {(isHovered || isActive) && (
            <p className="text-blue-400 text-xs mt-1 animate-pulse">[ Click to explore ]</p>
          )}
        </div>
      </Html>
    </group>
  );
};

/**
 * Island Base Platform - Blue theme for Mobile
 */
const IslandBase = ({ isHovered = false }: { isHovered?: boolean }) => {
  const gradientMap = useMemo(() => createToonGradient(), []);

  return (
    <group>
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[2.2, 2.7, 0.4, 6]} />
        <meshToonMaterial color={isHovered ? '#2a3a5f' : '#1e3a5f'} gradientMap={gradientMap} />
      </mesh>
      
      {/* Glow ring - Blue theme (Flutter blue) */}
      <mesh position={[0, 0.21, 0]}>
        <torusGeometry args={[2.2, isHovered ? 0.05 : 0.03, 8, 6]} />
        <meshBasicMaterial color="#02569B" transparent opacity={isHovered ? 1 : 0.8} />
      </mesh>
      
      {/* Anti-Gravity Turbine underneath */}
      <MiniTurbine color="#02569B" scale={0.6} />
    </group>
  );
};

/**
 * Phone Mockup - Stylized smartphone
 */
const PhoneMockup = ({ position }: { position: [number, number, number] }) => {
  const screenRef = useRef<Mesh>(null);
  
  useFrame(({ clock }) => {
    if (!screenRef.current) return;
    // Subtle screen pulse
    const material = screenRef.current.material as THREE.MeshBasicMaterial;
    material.opacity = 0.3 + Math.sin(clock.elapsedTime * 2) * 0.1;
  });
  
  return (
    <group position={position}>
      {/* Phone body */}
      <mesh castShadow>
        <boxGeometry args={[0.9, 1.8, 0.1]} />
        <meshToonMaterial color="#1a1a2e" />
      </mesh>
      
      {/* Screen */}
      <mesh ref={screenRef} position={[0, 0, 0.06]}>
        <planeGeometry args={[0.8, 1.6]} />
        <meshBasicMaterial color="#02569B" transparent opacity={0.4} />
      </mesh>
      
      {/* Screen border glow */}
      <mesh position={[0, 0, 0.055]}>
        <planeGeometry args={[0.85, 1.65]} />
        <meshBasicMaterial color="#54C5F8" transparent opacity={0.2} />
      </mesh>
      
      {/* App UI Elements on screen */}
      <AppUIElements />
      
      {/* Camera notch */}
      <mesh position={[0, 0.85, 0.06]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.02, 8]} />
        <meshBasicMaterial color="#333333" />
      </mesh>
    </group>
  );
};

/**
 * App UI Elements - Simplified app interface
 */
const AppUIElements = () => {
  return (
    <group position={[0, 0, 0.07]}>
      {/* Header bar */}
      <mesh position={[0, 0.65, 0]}>
        <planeGeometry args={[0.75, 0.15]} />
        <meshBasicMaterial color="#02569B" />
      </mesh>
      
      {/* Product cards */}
      {[-0.2, 0.2].map((x, i) => (
        <mesh key={i} position={[x, 0.2, 0]}>
          <planeGeometry args={[0.3, 0.4]} />
          <meshBasicMaterial color={i === 0 ? '#54C5F8' : '#01579B'} transparent opacity={0.6} />
        </mesh>
      ))}
      
      {/* Bottom nav */}
      <mesh position={[0, -0.65, 0]}>
        <planeGeometry args={[0.75, 0.12]} />
        <meshBasicMaterial color="#0277BD" />
      </mesh>
    </group>
  );
};

/**
 * Floating Widgets - Flutter widget concept
 */
const FloatingWidgets = () => {
  const groupRef = useRef<Group>(null);
  
  const widgets = useMemo(() => [
    { x: -1, y: 1.5, z: 0.5, size: 0.25, color: '#54C5F8' },
    { x: 1.3, y: 1, z: -0.3, size: 0.2, color: '#01579B' },
    { x: -0.8, y: 2.2, z: -0.2, size: 0.18, color: '#0277BD' },
  ], []);
  
  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.children.forEach((child, i) => {
      child.position.y = widgets[i].y + Math.sin(clock.elapsedTime + i) * 0.15;
      child.rotation.y = clock.elapsedTime * 0.5 + i;
    });
  });
  
  return (
    <group ref={groupRef}>
      {widgets.map((w, i) => (
        <mesh key={i} position={[w.x, w.y, w.z]}>
          <boxGeometry args={[w.size, w.size, w.size * 0.3]} />
          <meshBasicMaterial color={w.color} transparent opacity={0.8} />
        </mesh>
      ))}
    </group>
  );
};

/**
 * Platform Icons - iOS and Android
 */
const PlatformIcons = ({ position }: { position: [number, number, number] }) => {
  return (
    <group position={position}>
      {/* iOS icon (simplified apple) */}
      <mesh position={[-0.4, 0, 0]}>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshBasicMaterial color="#A2AAAD" />
      </mesh>
      
      {/* Android icon (simplified robot head) */}
      <mesh position={[0.4, 0, 0]}>
        <boxGeometry args={[0.25, 0.2, 0.1]} />
        <meshBasicMaterial color="#3DDC84" />
      </mesh>
    </group>
  );
};

/**
 * Flutter Bird - Simplified Flutter logo bird
 */
const FlutterBird = ({ position }: { position: [number, number, number] }) => {
  const birdRef = useRef<Group>(null);
  
  useFrame(({ clock }) => {
    if (!birdRef.current) return;
    birdRef.current.rotation.y = Math.sin(clock.elapsedTime) * 0.2;
    birdRef.current.position.y = position[1] + Math.sin(clock.elapsedTime * 1.5) * 0.1;
  });
  
  return (
    <group ref={birdRef} position={position}>
      {/* Bird body (triangular shape like Flutter logo) */}
      <mesh rotation={[0, 0, Math.PI / 4]}>
        <coneGeometry args={[0.2, 0.4, 4]} />
        <meshBasicMaterial color="#02569B" />
      </mesh>
      
      {/* Highlight */}
      <mesh position={[0.05, 0.1, 0.05]} rotation={[0, 0, Math.PI / 4]}>
        <coneGeometry args={[0.1, 0.2, 4]} />
        <meshBasicMaterial color="#54C5F8" />
      </mesh>
    </group>
  );
};
