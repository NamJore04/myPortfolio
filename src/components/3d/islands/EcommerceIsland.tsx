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

interface EcommerceIslandProps {
  position?: [number, number, number];
  enableFloat?: boolean;
}

// Get e-commerce project data
const ecommerceProject = projects.find(p => p.id === 'ecommerce')!;

/**
 * EcommerceIsland - Represents the Full-stack E-commerce project
 * Visual: Stacked tech blocks forming a virtual store
 * Theme: MERN Stack, modular architecture
 */
export const EcommerceIsland = ({ position = [8, 0, -2], enableFloat = true }: EcommerceIslandProps) => {
  const groupRef = useRef<Group>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  // Click-to-zoom interaction
  const { handleClick, isActive } = useIslandClick({
    project: ecommerceProject,
    islandId: 'ecommerce-island',
  });

  const content = (
    <>
      {/* Island Base */}
      <IslandBase isHovered={isHovered || isActive} />
      
      {/* Tech Stack Tower */}
      <TechStackTower position={[0, 0.4, 0]} />
      
      {/* Shopping Cart Icon */}
      <ShoppingCart position={[1.2, 1.2, 0.5]} />
      
      {/* Floating Data Cubes */}
      <DataCubes />
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
        <div className={`bg-gradient-to-r from-cyan-900/80 to-green-900/80 backdrop-blur-sm px-4 py-2 rounded-lg border transition-all duration-300 cursor-pointer ${isHovered || isActive ? 'border-cyan-400 shadow-lg shadow-cyan-500/30' : 'border-cyan-500/30'}`}>
          <h3 className="text-white font-bold text-sm whitespace-nowrap">
            E-Commerce Platform
          </h3>
          <div className="flex gap-3 mt-1 text-xs text-gray-300">
            <span>&lt;200ms API</span>
            <span>500+ Users</span>
          </div>
          {(isHovered || isActive) && (
            <p className="text-cyan-400 text-xs mt-1 animate-pulse">[ Click to explore ]</p>
          )}
        </div>
      </Html>
    </group>
  );
};

/**
 * Island Base Platform - Cyan theme for Full-stack
 */
const IslandBase = ({ isHovered = false }: { isHovered?: boolean }) => {
  const gradientMap = useMemo(() => createToonGradient(), []);

  return (
    <group>
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[2.5, 3, 0.4, 6]} />
        <meshToonMaterial color={isHovered ? '#2a5080' : '#1e3a5f'} gradientMap={gradientMap} />
      </mesh>
      
      {/* Glow ring - Cyan theme */}
      <mesh position={[0, 0.21, 0]}>
        <torusGeometry args={[2.5, isHovered ? 0.05 : 0.03, 8, 6]} />
        <meshBasicMaterial color="#00d4ff" transparent opacity={isHovered ? 1 : 0.8} />
      </mesh>
      
      {/* Anti-Gravity Turbine underneath */}
      <MiniTurbine color="#00d4ff" scale={0.7} />
    </group>
  );
};

/**
 * Tech Stack Tower - MERN Stack visualization
 * Blocks stacked representing different layers
 */
const TechStackTower = ({ position }: { position: [number, number, number] }) => {
  const layers = [
    { name: 'MongoDB', color: '#47a248', y: 0 },
    { name: 'Express', color: '#1e293b', y: 0.5 },
    { name: 'React', color: '#61dafb', y: 1.0 },
    { name: 'Node.js', color: '#339933', y: 1.5 },
  ];

  return (
    <group position={position}>
      {layers.map((layer, i) => (
        <TechBlock
          key={layer.name}
          color={layer.color}
          position={[0, layer.y, 0]}
          delay={i * 0.2}
        />
      ))}
    </group>
  );
};

/**
 * Single Tech Block with hover animation
 */
const TechBlock = ({
  color,
  position,
  delay,
}: {
  color: string;
  position: [number, number, number];
  delay: number;
}) => {
  const meshRef = useRef<Mesh>(null);
  
  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    // Subtle floating offset per block
    meshRef.current.position.y = position[1] + Math.sin(clock.elapsedTime * 1.5 + delay * 5) * 0.03;
    meshRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.5 + delay) * 0.1;
  });

  return (
    <mesh ref={meshRef} position={position} castShadow>
      <boxGeometry args={[0.8, 0.35, 0.6]} />
      <meshToonMaterial color={color} />
    </mesh>
  );
};

/**
 * Shopping Cart - Simple geometric representation
 */
const ShoppingCart = ({ position }: { position: [number, number, number] }) => {
  const groupRef = useRef<Group>(null);
  
  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = Math.sin(clock.elapsedTime) * 0.2;
    groupRef.current.position.y = position[1] + Math.sin(clock.elapsedTime * 1.5) * 0.1;
  });

  return (
    <group ref={groupRef} position={position} scale={0.5}>
      {/* Cart body */}
      <mesh>
        <boxGeometry args={[0.6, 0.4, 0.4]} />
        <meshToonMaterial color="#00d4ff" />
      </mesh>
      {/* Handle */}
      <mesh position={[0, 0.35, 0]}>
        <torusGeometry args={[0.2, 0.03, 8, 16, Math.PI]} />
        <meshToonMaterial color="#00d4ff" />
      </mesh>
      {/* Wheels */}
      <mesh position={[-0.2, -0.25, 0.15]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshToonMaterial color="#1e293b" />
      </mesh>
      <mesh position={[0.2, -0.25, 0.15]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshToonMaterial color="#1e293b" />
      </mesh>
    </group>
  );
};

/**
 * Floating Data Cubes - Represent data flow
 */
const DataCubes = () => {
  const cubes = useMemo(() => 
    Array.from({ length: 5 }, (_, i) => ({
      id: i,
      position: [
        (Math.random() - 0.5) * 3,
        Math.random() * 1.5 + 1,
        (Math.random() - 0.5) * 3,
      ] as [number, number, number],
      speed: 0.5 + Math.random() * 0.5,
      offset: Math.random() * Math.PI * 2,
    })),
  []);

  return (
    <group>
      {cubes.map((cube) => (
        <FloatingCube key={cube.id} {...cube} />
      ))}
    </group>
  );
};

const FloatingCube = ({
  position,
  speed,
  offset,
}: {
  position: [number, number, number];
  speed: number;
  offset: number;
}) => {
  const meshRef = useRef<Mesh>(null);
  
  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x = clock.elapsedTime * speed;
    meshRef.current.rotation.y = clock.elapsedTime * speed * 0.7;
    meshRef.current.position.y = position[1] + Math.sin(clock.elapsedTime + offset) * 0.2;
  });

  return (
    <mesh ref={meshRef} position={position}>
      <boxGeometry args={[0.15, 0.15, 0.15]} />
      <meshBasicMaterial color="#00d4ff" transparent opacity={0.4} wireframe />
    </mesh>
  );
};
