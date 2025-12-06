'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

interface EnvironmentProps {
  particleCount?: number;
}

/**
 * Environment component - Optimized space background
 * Lightweight version without heavy reflections
 * 
 * @param particleCount - Number of floating particles (based on device performance)
 */
export const Environment = ({ particleCount = 500 }: EnvironmentProps) => {
  return (
    <>
      {/* Deep space background */}
      <color attach="background" args={['#030508']} />
      
      {/* Distant Sun - main light source */}
      <DistantSun />
      
      {/* Enhanced star field */}
      <StarField count={particleCount * 8} />
      
      {/* Orbiting Mini Planets around scene */}
      <OrbitingAsteroids />
      
      {/* Simple floor plane with subtle glow */}
      <SimpleFloor />
    </>
  );
};

/**
 * DistantSun - Large glowing orb representing the sun
 * Provides ambient lighting and visual anchor
 */
const DistantSun = () => {
  const sunRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const raysRef = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    const time = clock.elapsedTime;
    
    // Subtle pulsing
    if (glowRef.current) {
      glowRef.current.scale.setScalar(1 + Math.sin(time * 0.5) * 0.05);
    }
    
    // Rotate rays slowly
    if (raysRef.current) {
      raysRef.current.rotation.z = time * 0.02;
    }
  });
  
  return (
    <group position={[80, 40, -60]}>
      {/* Sun core */}
      <mesh ref={sunRef}>
        <sphereGeometry args={[8, 32, 32]} />
        <meshBasicMaterial color="#fff5e6" />
      </mesh>
      
      {/* Inner glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[12, 32, 32]} />
        <meshBasicMaterial 
          color="#ffaa44" 
          transparent 
          opacity={0.3}
        />
      </mesh>
      
      {/* Outer glow */}
      <mesh>
        <sphereGeometry args={[18, 32, 32]} />
        <meshBasicMaterial 
          color="#ff8822" 
          transparent 
          opacity={0.15}
        />
      </mesh>
      
      {/* Light rays */}
      <group ref={raysRef}>
        {[...Array(8)].map((_, i) => (
          <mesh 
            key={i} 
            rotation={[0, 0, (Math.PI / 4) * i]}
            position={[0, 0, -0.1]}
          >
            <planeGeometry args={[2, 40]} />
            <meshBasicMaterial 
              color="#ffcc66" 
              transparent 
              opacity={0.1}
              side={THREE.DoubleSide}
            />
          </mesh>
        ))}
      </group>
      
      {/* Sun light casting onto scene */}
      <directionalLight
        position={[0, 0, 0]}
        target-position={[-80, -40, 60]}
        intensity={0.8}
        color="#fff5e6"
      />
      
      {/* Ambient warm glow */}
      <pointLight
        color="#ffaa44"
        intensity={2}
        distance={200}
        decay={2}
      />
    </group>
  );
};

/**
 * StarField - Enhanced twinkling stars with varied brightness
 */
const StarField = ({ count = 2000 }: { count?: number }) => {
  const pointsRef = useRef<THREE.Points>(null);
  
  const { positions, sizes, twinkleOffsets } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const siz = new Float32Array(count);
    const offsets = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      // Spherical distribution around scene
      const radius = 80 + Math.random() * 120;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.cos(phi);
      pos[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
      
      // Varied star sizes - increased base size
      siz[i] = 0.15 + Math.random() * 0.4;
      offsets[i] = Math.random() * Math.PI * 2;
    }
    
    return { positions: pos, sizes: siz, twinkleOffsets: offsets };
  }, [count]);
  
  // Animate twinkling
  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    
    const time = clock.elapsedTime;
    const material = pointsRef.current.material as THREE.PointsMaterial;
    
    // Global brightness pulsing - increased base opacity
    material.opacity = 0.85 + Math.sin(time * 0.3) * 0.15;
  });
  
  return (
    <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#ffffff"
        size={0.25}
        sizeAttenuation
        depthWrite={false}
        opacity={0.9}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
};

/**
 * OrbitingAsteroids - Mini planets orbiting in rings 3-4-5
 * Creates dynamic space environment
 */
const OrbitingAsteroids = () => {
  const groupRef = useRef<THREE.Group>(null);
  
  // Generate asteroids for rings 3, 4, 5 (radii: 24, 32, 40)
  const asteroids = useMemo(() => {
    const rocks: {
      ring: number;
      radius: number;
      size: number;
      angle: number;
      speed: number;
      yOffset: number;
      color: string;
      wobbleSpeed: number;
      wobbleAmount: number;
    }[] = [];
    
    const ringConfigs = [
      { ring: 3, radius: 24, count: 12 },
      { ring: 4, radius: 32, count: 18 },
      { ring: 5, radius: 40, count: 24 },
    ];
    
    const colors = ['#4a5568', '#718096', '#a0aec0', '#2d3748', '#1a202c'];
    
    ringConfigs.forEach(({ ring, radius, count }) => {
      for (let i = 0; i < count; i++) {
        rocks.push({
          ring,
          radius: radius + (Math.random() - 0.5) * 4, // Slight radius variation
          size: 0.15 + Math.random() * 0.35,
          angle: (Math.PI * 2 / count) * i + Math.random() * 0.5,
          speed: 0.02 + Math.random() * 0.03 * (ring === 3 ? 1 : ring === 4 ? 0.8 : 0.6),
          yOffset: (Math.random() - 0.5) * 2,
          color: colors[Math.floor(Math.random() * colors.length)],
          wobbleSpeed: 0.5 + Math.random() * 1,
          wobbleAmount: 0.1 + Math.random() * 0.2,
        });
      }
    });
    
    return rocks;
  }, []);
  
  return (
    <group ref={groupRef}>
      {asteroids.map((asteroid, i) => (
        <Asteroid key={i} {...asteroid} />
      ))}
    </group>
  );
};

/**
 * Individual Asteroid with independent orbit
 */
interface AsteroidProps {
  radius: number;
  size: number;
  angle: number;
  speed: number;
  yOffset: number;
  color: string;
  wobbleSpeed: number;
  wobbleAmount: number;
}

const Asteroid = ({ radius, size, angle, speed, yOffset, color, wobbleSpeed, wobbleAmount }: AsteroidProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const initialAngle = useRef(angle);
  
  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    
    const time = clock.elapsedTime;
    const currentAngle = initialAngle.current + time * speed;
    
    // Orbital position with wobble
    const wobble = Math.sin(time * wobbleSpeed) * wobbleAmount;
    meshRef.current.position.x = Math.cos(currentAngle) * (radius + wobble);
    meshRef.current.position.z = Math.sin(currentAngle) * (radius + wobble);
    meshRef.current.position.y = yOffset + Math.sin(time * wobbleSpeed * 0.5) * 0.3;
    
    // Self rotation
    meshRef.current.rotation.x += 0.01;
    meshRef.current.rotation.y += 0.015;
  });
  
  return (
    <mesh ref={meshRef}>
      <dodecahedronGeometry args={[size, 0]} />
      <meshStandardMaterial 
        color={color}
        roughness={0.8}
        metalness={0.2}
      />
    </mesh>
  );
};

/**
 * SimpleFloor - Lightweight floor plane
 */
const SimpleFloor = () => {
  return (
    <group position={[0, -3, 0]}>
      {/* Dark floor plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[80, 64]} />
        <meshStandardMaterial 
          color="#0a0f15"
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>
      
      {/* Subtle center glow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <circleGeometry args={[20, 64]} />
        <meshBasicMaterial 
          color="#0a1628"
          transparent
          opacity={0.5}
        />
      </mesh>
      
      {/* Glow rings */}
      {[15, 25, 35].map((r, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
          <torusGeometry args={[r, 0.05, 8, 64]} />
          <meshBasicMaterial 
            color={i % 2 === 0 ? '#00d4ff' : '#a855f7'}
            transparent
            opacity={0.15 - i * 0.03}
          />
        </mesh>
      ))}
    </group>
  );
};
