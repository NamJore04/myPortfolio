'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { Group, Mesh, Points } from 'three';

interface AntiGravityTurbineProps {
  scale?: number;
  color?: string;
  secondaryColor?: string;
}

/**
 * AntiGravityTurbine - "The Anti-Gravity Turbine" (Đế Tuabin Phản Lực Từ)
 * 
 * Creates a high-tech mecha-style floating base that explains why islands levitate.
 * 
 * Components:
 * - Outer metal ring (brushed steel)
 * - Spinning energy core in the center
 * - Magnetic rings with purple glow
 * - Particle thrust effect pointing downward
 */
export const AntiGravityTurbine = ({ 
  scale = 1, 
  color = '#a855f7',
  secondaryColor = '#00d4ff'
}: AntiGravityTurbineProps) => {
  const groupRef = useRef<Group>(null);
  const coreRef = useRef<Mesh>(null);
  const innerRingRef = useRef<Mesh>(null);
  const outerRingRef = useRef<Mesh>(null);
  const magneticRing1Ref = useRef<Mesh>(null);
  const magneticRing2Ref = useRef<Mesh>(null);
  const magneticRing3Ref = useRef<Mesh>(null);
  
  useFrame(({ clock }) => {
    const time = clock.elapsedTime;
    
    // Spin the energy core
    if (coreRef.current) {
      coreRef.current.rotation.y = time * 2;
      coreRef.current.rotation.x = time * 0.5;
    }
    
    // Counter-rotating inner ring
    if (innerRingRef.current) {
      innerRingRef.current.rotation.z = -time * 1.5;
    }
    
    // Slow outer ring rotation
    if (outerRingRef.current) {
      outerRingRef.current.rotation.z = time * 0.3;
    }
    
    // Magnetic rings - oscillating with offset phases
    if (magneticRing1Ref.current) {
      magneticRing1Ref.current.rotation.z = time * 0.8;
      magneticRing1Ref.current.position.y = -0.2 + Math.sin(time * 2) * 0.05;
    }
    if (magneticRing2Ref.current) {
      magneticRing2Ref.current.rotation.z = -time * 0.6;
      magneticRing2Ref.current.position.y = -0.35 + Math.sin(time * 2 + Math.PI / 3) * 0.05;
    }
    if (magneticRing3Ref.current) {
      magneticRing3Ref.current.rotation.z = time * 0.4;
      magneticRing3Ref.current.position.y = -0.5 + Math.sin(time * 2 + Math.PI * 2 / 3) * 0.05;
    }
  });
  
  return (
    <group ref={groupRef} scale={[scale, scale, scale]} position={[0, -0.25, 0]}>
      {/* === MAIN METAL RING (Brushed Steel) === */}
      <mesh ref={outerRingRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.8, 0.15, 16, 48]} />
        <meshStandardMaterial
          color="#8892a0"
          metalness={0.9}
          roughness={0.3}
        />
      </mesh>
      
      {/* Inner structural ring */}
      <mesh ref={innerRingRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.2, 0.08, 12, 32]} />
        <meshStandardMaterial
          color="#5a6370"
          metalness={0.95}
          roughness={0.2}
        />
      </mesh>
      
      {/* Ring connector segments */}
      {[...Array(8)].map((_, i) => (
        <mesh 
          key={i}
          position={[
            Math.cos((Math.PI / 4) * i) * 2.5,
            0,
            Math.sin((Math.PI / 4) * i) * 2.5
          ]}
          rotation={[Math.PI / 2, 0, (Math.PI / 4) * i]}
        >
          <boxGeometry args={[0.3, 0.1, 0.08]} />
          <meshStandardMaterial
            color="#4a5568"
            metalness={0.85}
            roughness={0.4}
          />
        </mesh>
      ))}
      
      {/* === ENERGY CORE (Center) === */}
      <group position={[0, 0, 0]}>
        {/* Core sphere */}
        <mesh ref={coreRef}>
          <icosahedronGeometry args={[0.5, 1]} />
          <meshBasicMaterial
            color={secondaryColor}
            transparent
            opacity={0.9}
          />
        </mesh>
        
        {/* Core inner glow */}
        <mesh>
          <sphereGeometry args={[0.35, 16, 16]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.8}
          />
        </mesh>
        
        {/* Core outer glow */}
        <mesh>
          <sphereGeometry args={[0.7, 16, 16]} />
          <meshBasicMaterial
            color={secondaryColor}
            transparent
            opacity={0.2}
          />
        </mesh>
        
        {/* Core light */}
        <pointLight
          color={secondaryColor}
          intensity={2}
          distance={5}
        />
      </group>
      
      {/* === MAGNETIC RINGS (Purple Glow) === */}
      <mesh ref={magneticRing1Ref} position={[0, -0.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.8, 0.04, 8, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.8}
        />
      </mesh>
      
      <mesh ref={magneticRing2Ref} position={[0, -0.35, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.4, 0.035, 8, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.7}
        />
      </mesh>
      
      <mesh ref={magneticRing3Ref} position={[0, -0.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.0, 0.03, 8, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.6}
        />
      </mesh>
      
      {/* Magnetic field glow */}
      <pointLight
        color={color}
        intensity={1.5}
        distance={4}
        position={[0, -0.3, 0]}
      />
      
      {/* === THRUST PARTICLES === */}
      <ThrustParticles color={color} secondaryColor={secondaryColor} />
      
      {/* === DECORATIVE ELEMENTS === */}
      {/* Tech panels on ring */}
      {[...Array(4)].map((_, i) => (
        <group 
          key={`panel-${i}`}
          rotation={[0, (Math.PI / 2) * i, 0]}
        >
          <mesh position={[2.5, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
            <boxGeometry args={[0.4, 0.15, 0.02]} />
            <meshBasicMaterial
              color={secondaryColor}
              transparent
              opacity={0.4}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
};

/**
 * ThrustParticles - Particle effect flowing downward from turbine
 */
interface ThrustParticlesProps {
  color: string;
  secondaryColor: string;
}

const ThrustParticles = ({ color, secondaryColor }: ThrustParticlesProps) => {
  const pointsRef = useRef<Points>(null);
  const particleCount = 80;
  
  // Initialize particle data
  const { positions, velocities, initialData } = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const vel = new Float32Array(particleCount);
    const init = new Float32Array(particleCount * 2); // angle, radius
    
    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 0.5 + Math.random() * 1.5;
      
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = -0.5 - Math.random() * 2;
      pos[i * 3 + 2] = Math.sin(angle) * radius;
      
      vel[i] = 0.02 + Math.random() * 0.03;
      init[i * 2] = angle;
      init[i * 2 + 1] = radius;
    }
    
    return { positions: pos, velocities: vel, initialData: init };
  }, []);
  
  useFrame(() => {
    if (!pointsRef.current) return;
    
    const posArray = pointsRef.current.geometry.attributes.position.array as Float32Array;
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Move downward
      posArray[i3 + 1] -= velocities[i];
      
      // Slight outward spread
      const angle = initialData[i * 2];
      const currentRadius = initialData[i * 2 + 1] + (-posArray[i3 + 1] - 0.5) * 0.1;
      posArray[i3] = Math.cos(angle) * currentRadius;
      posArray[i3 + 2] = Math.sin(angle) * currentRadius;
      
      // Reset when too far down
      if (posArray[i3 + 1] < -4) {
        posArray[i3 + 1] = -0.5;
        initialData[i * 2] = Math.random() * Math.PI * 2;
        initialData[i * 2 + 1] = 0.5 + Math.random() * 1.5;
      }
    }
    
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });
  
  // Create geometry
  const geometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geom;
  }, [positions]);
  
  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        color={color}
        size={0.08}
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

/**
 * MiniTurbine - Smaller version for project islands
 */
export const MiniTurbine = ({ 
  scale = 0.6,
  color = '#a855f7',
  secondaryColor = '#00d4ff'
}: AntiGravityTurbineProps) => {
  const coreRef = useRef<Mesh>(null);
  const ringRef = useRef<Mesh>(null);
  
  useFrame(({ clock }) => {
    const time = clock.elapsedTime;
    
    if (coreRef.current) {
      coreRef.current.rotation.y = time * 2.5;
    }
    
    if (ringRef.current) {
      ringRef.current.rotation.z = -time * 1.2;
    }
  });
  
  return (
    <group scale={[scale, scale, scale]} position={[0, -0.15, 0]}>
      {/* Metal ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.2, 0.1, 12, 32]} />
        <meshStandardMaterial
          color="#7a8494"
          metalness={0.9}
          roughness={0.3}
        />
      </mesh>
      
      {/* Energy core */}
      <mesh ref={coreRef}>
        <octahedronGeometry args={[0.35, 0]} />
        <meshBasicMaterial
          color={secondaryColor}
          transparent
          opacity={0.85}
        />
      </mesh>
      
      {/* Core glow */}
      <mesh>
        <sphereGeometry args={[0.5, 12, 12]} />
        <meshBasicMaterial
          color={secondaryColor}
          transparent
          opacity={0.15}
        />
      </mesh>
      
      {/* Magnetic rings */}
      <mesh position={[0, -0.12, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.5, 0.025, 8, 24]} />
        <meshBasicMaterial color={color} transparent opacity={0.7} />
      </mesh>
      
      <mesh position={[0, -0.22, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.1, 0.02, 8, 24]} />
        <meshBasicMaterial color={color} transparent opacity={0.5} />
      </mesh>
      
      {/* Core light */}
      <pointLight color={secondaryColor} intensity={1} distance={3} />
      <pointLight color={color} intensity={0.8} distance={2} position={[0, -0.2, 0]} />
    </group>
  );
};

export default AntiGravityTurbine;
