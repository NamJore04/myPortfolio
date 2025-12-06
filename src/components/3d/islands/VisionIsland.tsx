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

interface VisionIslandProps {
  position?: [number, number, number];
  enableFloat?: boolean;
}

// Get traffic-vision project data
const visionProject = projects.find(p => p.id === 'traffic-vision')!;

/**
 * VisionIsland - Represents Computer Vision projects
 * Visual: Scanning camera/drone + wireframe city
 * Theme: YOLO detection, OCR, real-time analysis
 */
export const VisionIsland = ({ position = [0, 0, 8], enableFloat = true }: VisionIslandProps) => {
  const groupRef = useRef<Group>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  // Click-to-zoom interaction
  const { handleClick, isActive } = useIslandClick({
    project: visionProject,
    islandId: 'vision-island',
  });

  const content = (
    <>
      {/* Island Base */}
      <IslandBase isHovered={isHovered || isActive} />
      
      {/* Scanner/Camera */}
      <Scanner position={[0, 2, 0]} />
      
      {/* Wireframe City Target */}
      <WireframeCity position={[0, 0.5, 0]} />
      
      {/* Scan Beam Effect */}
      <ScanBeam />
      
      {/* Detection Boxes */}
      <DetectionBoxes />
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
        position={[0, 3.8, 0]}
        center
        distanceFactor={15}
        className="pointer-events-none select-none"
      >
        <div className={`bg-gradient-to-r from-green-900/80 to-cyan-900/80 backdrop-blur-sm px-4 py-2 rounded-lg border transition-all duration-300 cursor-pointer ${isHovered || isActive ? 'border-green-400 shadow-lg shadow-green-500/30' : 'border-green-500/30'}`}>
          <h3 className="text-white font-bold text-sm whitespace-nowrap">
            Computer Vision
          </h3>
          <div className="flex gap-3 mt-1 text-xs text-gray-300">
            <span>85% mAP</span>
            <span>YOLO v5</span>
          </div>
          {(isHovered || isActive) && (
            <p className="text-green-400 text-xs mt-1 animate-pulse">[ Click to explore ]</p>
          )}
        </div>
      </Html>
    </group>
  );
};

/**
 * Island Base Platform - Green theme for Vision
 */
const IslandBase = ({ isHovered = false }: { isHovered?: boolean }) => {
  const gradientMap = useMemo(() => createToonGradient(), []);

  return (
    <group>
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[2.5, 3, 0.4, 6]} />
        <meshToonMaterial color={isHovered ? '#2a5f50' : '#1e3a5f'} gradientMap={gradientMap} />
      </mesh>
      
      {/* Glow ring - Green theme */}
      <mesh position={[0, 0.21, 0]}>
        <torusGeometry args={[2.5, isHovered ? 0.05 : 0.03, 8, 6]} />
        <meshBasicMaterial color="#34d399" transparent opacity={isHovered ? 1 : 0.8} />
      </mesh>
      
      {/* Anti-Gravity Turbine underneath */}
      <MiniTurbine color="#34d399" scale={0.7} />
    </group>
  );
};

/**
 * Scanner - Floating camera/drone device
 */
const Scanner = ({ position }: { position: [number, number, number] }) => {
  const groupRef = useRef<Group>(null);
  
  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = clock.elapsedTime * 0.3;
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Main body */}
      <mesh castShadow>
        <boxGeometry args={[0.6, 0.3, 0.4]} />
        <meshToonMaterial color="#1e293b" />
      </mesh>
      
      {/* Lens */}
      <mesh position={[0, -0.1, 0.25]}>
        <cylinderGeometry args={[0.15, 0.12, 0.1, 16]} />
        <meshToonMaterial color="#34d399" />
      </mesh>
      
      {/* Lens glow */}
      <mesh position={[0, -0.1, 0.31]}>
        <circleGeometry args={[0.1, 16]} />
        <meshBasicMaterial color="#34d399" transparent opacity={0.8} />
      </mesh>
      
      {/* Antenna */}
      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.3, 8]} />
        <meshToonMaterial color="#94a3b8" />
      </mesh>
      
      {/* Antenna tip */}
      <mesh position={[0, 0.42, 0]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshBasicMaterial color="#34d399" />
      </mesh>
    </group>
  );
};

/**
 * Wireframe City - Target for scanning
 */
const WireframeCity = ({ position }: { position: [number, number, number] }) => {
  const buildings = useMemo(() => [
    { x: -0.5, z: -0.5, h: 0.6, w: 0.3 },
    { x: 0.5, z: -0.3, h: 0.8, w: 0.25 },
    { x: -0.3, z: 0.4, h: 0.5, w: 0.35 },
    { x: 0.4, z: 0.5, h: 0.7, w: 0.28 },
    { x: 0, z: 0, h: 1.0, w: 0.4 },
  ], []);

  return (
    <group position={position}>
      {buildings.map((b, i) => (
        <mesh key={i} position={[b.x, b.h / 2, b.z]}>
          <boxGeometry args={[b.w, b.h, b.w]} />
          <meshBasicMaterial color="#34d399" transparent opacity={0.3} wireframe />
        </mesh>
      ))}
    </group>
  );
};

/**
 * Scan Beam - Animated scanning effect
 */
const ScanBeam = () => {
  const meshRef = useRef<Mesh>(null);
  
  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    // Oscillate scale to simulate scanning
    const scale = 0.5 + Math.sin(clock.elapsedTime * 2) * 0.3;
    meshRef.current.scale.set(scale, 1, scale);
    meshRef.current.rotation.y = clock.elapsedTime * 0.5;
  });

  return (
    <mesh ref={meshRef} position={[0, 1, 0]} rotation={[0, 0, 0]}>
      <coneGeometry args={[2, 1.5, 32, 1, true]} />
      <meshBasicMaterial 
        color="#34d399" 
        transparent 
        opacity={0.1} 
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

/**
 * Detection Boxes - Animated bounding boxes
 */
const DetectionBoxes = () => {
  const boxes = useMemo(() => [
    { x: -0.4, y: 0.7, z: -0.3, size: 0.25 },
    { x: 0.5, y: 0.9, z: 0.2, size: 0.2 },
    { x: 0, y: 1.2, z: 0, size: 0.3 },
  ], []);

  return (
    <group>
      {boxes.map((box, i) => (
        <DetectionBox key={i} {...box} delay={i * 0.3} />
      ))}
    </group>
  );
};

const DetectionBox = ({
  x, y, z, size, delay,
}: {
  x: number;
  y: number;
  z: number;
  size: number;
  delay: number;
}) => {
  const meshRef = useRef<Mesh>(null);
  
  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    // Pulsing opacity
    const pulse = (Math.sin(clock.elapsedTime * 3 + delay * 5) + 1) * 0.5;
    (meshRef.current.material as THREE.MeshBasicMaterial).opacity = 0.3 + pulse * 0.4;
  });

  return (
    <mesh ref={meshRef} position={[x, y, z]}>
      <boxGeometry args={[size, size, size]} />
      <meshBasicMaterial color="#34d399" transparent opacity={0.5} wireframe />
    </mesh>
  );
};
