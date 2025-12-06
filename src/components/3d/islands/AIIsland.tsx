'use client';

import { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Float } from '@react-three/drei';
import * as THREE from 'three';
import type { Group, Mesh, Points } from 'three';
import { projects } from '@/data/projects';
import { createToonGradient } from '@/utils/textures';
import { useIslandClick } from '@/hooks/useIslandClick';
import { MiniTurbine } from '../AntiGravityTurbine';

interface AIIslandProps {
  position?: [number, number, number];
  enableFloat?: boolean;
}

// Get project data
const aiProject = projects.find(p => p.id === 'crypto-bot')!;

/**
 * AIIsland - Represents the Crypto Trading Bot project
 * Visual: Neural Network structure + Candlestick chart
 * Theme: AI, Deep Learning, Real-time trading
 */
export const AIIsland = ({ position = [-8, 0, -2], enableFloat = true }: AIIslandProps) => {
  const groupRef = useRef<Group>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  // Click-to-zoom interaction
  const { handleClick, isActive } = useIslandClick({
    project: aiProject,
    islandId: 'ai-island',
  });

  const content = (
    <>
      {/* Island Base */}
      <IslandBase isHovered={isHovered || isActive} />
      
      {/* Neural Network Visualization */}
      <NeuralNetwork position={[0, 1.5, 0]} />
      
      {/* Candlestick Chart */}
      <CandlestickChart position={[0, 0.8, 0.8]} />
      
      {/* Data Flow Particles */}
      <DataFlowParticles />
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
        <div className={`bg-gradient-to-r from-purple-900/80 to-blue-900/80 backdrop-blur-sm px-4 py-2 rounded-lg border transition-all duration-300 cursor-pointer ${isHovered || isActive ? 'border-purple-400 shadow-lg shadow-purple-500/30' : 'border-purple-500/30'}`}>
          <h3 className="text-white font-bold text-sm whitespace-nowrap">
            AI Trading Bot
          </h3>
          <div className="flex gap-3 mt-1 text-xs text-gray-300">
            <span>PyTorch + LSTM</span>
            <span>Real-time</span>
          </div>
          {(isHovered || isActive) && (
            <p className="text-purple-400 text-xs mt-1 animate-pulse">[ Click to explore ]</p>
          )}
        </div>
      </Html>
    </group>
  );
};

/**
 * Island Base Platform
 */
const IslandBase = ({ isHovered }: { isHovered?: boolean }) => {
  const gradientMap = useMemo(() => createToonGradient(), []);

  return (
    <group>
      {/* Main platform */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[2.5, 3, 0.4, 6]} />
        <meshToonMaterial color={isHovered ? '#3d2a6b' : '#1e3a5f'} gradientMap={gradientMap} />
      </mesh>
      
      {/* Glow ring - Purple theme for AI */}
      <mesh position={[0, 0.21, 0]}>
        <torusGeometry args={[2.5, isHovered ? 0.05 : 0.03, 8, 6]} />
        <meshBasicMaterial color="#a855f7" transparent opacity={isHovered ? 1 : 0.8} />
      </mesh>
      
      {/* Anti-Gravity Turbine underneath */}
      <MiniTurbine color="#a855f7" scale={0.7} />
    </group>
  );
};

/**
 * Neural Network Visualization
 * 3 layers with animated connections
 */
const NeuralNetwork = ({ position }: { position: [number, number, number] }) => {
  const groupRef = useRef<Group>(null);
  
  // Node positions for 3-layer network
  const layers = useMemo(() => [
    // Input layer (3 nodes)
    [
      { x: -0.8, y: 0.6, z: 0 },
      { x: -0.8, y: 0, z: 0 },
      { x: -0.8, y: -0.6, z: 0 },
    ],
    // Hidden layer (4 nodes)
    [
      { x: 0, y: 0.9, z: 0 },
      { x: 0, y: 0.3, z: 0 },
      { x: 0, y: -0.3, z: 0 },
      { x: 0, y: -0.9, z: 0 },
    ],
    // Output layer (2 nodes)
    [
      { x: 0.8, y: 0.3, z: 0 },
      { x: 0.8, y: -0.3, z: 0 },
    ],
  ], []);

  return (
    <group ref={groupRef} position={position}>
      {/* Nodes */}
      {layers.map((layer, layerIdx) =>
        layer.map((node, nodeIdx) => (
          <NeuralNode
            key={`${layerIdx}-${nodeIdx}`}
            position={[node.x, node.y, node.z]}
            delay={layerIdx * 0.3 + nodeIdx * 0.1}
          />
        ))
      )}
      
      {/* Connections - Lines between layers */}
      <NetworkConnections layers={layers} />
    </group>
  );
};

/**
 * Single Neural Node with pulse animation
 */
const NeuralNode = ({ 
  position, 
  delay 
}: { 
  position: [number, number, number];
  delay: number;
}) => {
  const meshRef = useRef<Mesh>(null);
  
  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const pulse = Math.sin(clock.elapsedTime * 2 + delay * 5) * 0.5 + 0.5;
    (meshRef.current.material as THREE.MeshBasicMaterial).opacity = 0.5 + pulse * 0.5;
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.12, 16, 16]} />
      <meshBasicMaterial color="#a855f7" transparent opacity={0.8} />
    </mesh>
  );
};

/**
 * Network Connections - Lines between nodes
 */
const NetworkConnections = ({ 
  layers 
}: { 
  layers: { x: number; y: number; z: number }[][] 
}) => {
  const linesRef = useRef<THREE.LineSegments>(null);
  
  const geometry = useMemo(() => {
    const positions: number[] = [];
    
    // Connect each layer to the next
    for (let l = 0; l < layers.length - 1; l++) {
      const currentLayer = layers[l];
      const nextLayer = layers[l + 1];
      
      for (const current of currentLayer) {
        for (const next of nextLayer) {
          positions.push(current.x, current.y, current.z);
          positions.push(next.x, next.y, next.z);
        }
      }
    }
    
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    return geo;
  }, [layers]);

  return (
    <lineSegments ref={linesRef} geometry={geometry}>
      <lineBasicMaterial color="#a855f7" transparent opacity={0.3} />
    </lineSegments>
  );
};

/**
 * Candlestick Chart - Animated trading visualization
 */
const CandlestickChart = ({ position }: { position: [number, number, number] }) => {
  const groupRef = useRef<Group>(null);
  
  // Generate random candlestick data
  const candles = useMemo(() => {
    const data = [];
    let price = 0.5;
    for (let i = 0; i < 8; i++) {
      const change = (Math.random() - 0.5) * 0.3;
      const open = price;
      const close = price + change;
      const high = Math.max(open, close) + Math.random() * 0.1;
      const low = Math.min(open, close) - Math.random() * 0.1;
      price = close;
      data.push({ x: i * 0.2 - 0.7, open, close, high, low, isGreen: close > open });
    }
    return data;
  }, []);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    // Subtle animation
    groupRef.current.position.y = Math.sin(clock.elapsedTime) * 0.02;
  });

  return (
    <group ref={groupRef} position={position} scale={0.8}>
      {candles.map((candle, i) => (
        <group key={i} position={[candle.x, 0, 0]}>
          {/* Wick */}
          <mesh position={[0, (candle.high + candle.low) / 2, 0]}>
            <boxGeometry args={[0.02, candle.high - candle.low, 0.02]} />
            <meshBasicMaterial color={candle.isGreen ? '#34d399' : '#f87171'} />
          </mesh>
          {/* Body */}
          <mesh position={[0, (candle.open + candle.close) / 2, 0]}>
            <boxGeometry args={[0.08, Math.abs(candle.close - candle.open) || 0.02, 0.04]} />
            <meshToonMaterial color={candle.isGreen ? '#34d399' : '#f87171'} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

/**
 * Data Flow Particles - Particles flowing through the neural network
 */
const DataFlowParticles = () => {
  const pointsRef = useRef<Points>(null);
  const particleCount = 30;
  
  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 3;
      pos[i * 3 + 1] = Math.random() * 2 + 0.5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 2;
    }
    return pos;
  }, []);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      // Flow from left to right
      positions[i3] += 0.02;
      if (positions[i3] > 1.5) {
        positions[i3] = -1.5;
        positions[i3 + 1] = Math.random() * 2 + 0.5;
      }
      // Slight vertical wave
      positions[i3 + 1] += Math.sin(clock.elapsedTime * 2 + i) * 0.002;
    }
    
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  // Create geometry with positions
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [positions]);

  return (
    <points ref={pointsRef} position={[0, 1, 0]} geometry={geometry}>
      <pointsMaterial
        color="#a855f7"
        size={0.05}
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
};
