'use client';

import { useRef, useMemo } from 'react';
import { useFrame, extend } from '@react-three/fiber';
import { MeshReflectorMaterial, Grid } from '@react-three/drei';
import * as THREE from 'three';

/**
 * DigitalHexGridLake - Reflective floor with animated grid
 * Creates a synth-wave/matrix style "digital water" effect
 * 
 * Visual: Deep blue/purple reflective surface with cyan grid overlay
 * Animation: Grid lines flow slowly to simulate data streams beneath
 */
export const DigitalHexGridLake = () => {
  return (
    <group position={[0, -2, 0]}>
      {/* Reflective floor surface */}
      <ReflectiveFloor />
      
      {/* Animated grid overlay */}
      <AnimatedGridOverlay />
      
      {/* Ambient glow rings for depth */}
      <FloorGlowRings />
      
      {/* Edge fog/fade effect */}
      <EdgeFade />
    </group>
  );
};

/**
 * ReflectiveFloor - Main reflective surface using MeshReflectorMaterial
 */
const ReflectiveFloor = () => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <circleGeometry args={[60, 64]} />
      <MeshReflectorMaterial
        blur={[400, 100]}
        resolution={1024}
        mixBlur={0.8}
        mixStrength={0.5}
        roughness={0.6}
        depthScale={1.2}
        minDepthThreshold={0.4}
        maxDepthThreshold={1.4}
        color="#0a0f1a"
        metalness={0.6}
        mirror={0.5}
      />
    </mesh>
  );
};

/**
 * AnimatedGridOverlay - Flowing grid lines on top of reflector
 */
const AnimatedGridOverlay = () => {
  const gridRef = useRef<THREE.Group>(null);
  const secondaryGridRef = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    const time = clock.elapsedTime;
    
    // Animate primary grid - slow flow toward center
    if (gridRef.current) {
      // Subtle wave effect
      gridRef.current.position.z = Math.sin(time * 0.1) * 2;
      gridRef.current.position.x = Math.cos(time * 0.08) * 1;
    }
    
    // Secondary grid - opposite direction for depth
    if (secondaryGridRef.current) {
      secondaryGridRef.current.position.z = Math.cos(time * 0.12) * 1.5;
      secondaryGridRef.current.position.x = Math.sin(time * 0.1) * 1.5;
    }
  });
  
  return (
    <>
      {/* Primary Grid - Cyan */}
      <group ref={gridRef} position={[0, 0.01, 0]}>
        <Grid
          args={[100, 100]}
          cellSize={2}
          cellThickness={0.8}
          cellColor="#00d4ff"
          sectionSize={8}
          sectionThickness={1.2}
          sectionColor="#a855f7"
          fadeDistance={50}
          fadeStrength={1}
          followCamera={false}
          infiniteGrid
        />
      </group>
      
      {/* Secondary Grid - Purple (offset for depth) */}
      <group ref={secondaryGridRef} position={[0, 0.005, 0]} rotation={[0, Math.PI / 6, 0]}>
        <Grid
          args={[100, 100]}
          cellSize={4}
          cellThickness={0.4}
          cellColor="#a855f7"
          sectionSize={16}
          sectionThickness={0.6}
          sectionColor="#00d4ff"
          fadeDistance={40}
          fadeStrength={1.5}
          followCamera={false}
          infiniteGrid
        />
      </group>
    </>
  );
};

/**
 * FloorGlowRings - Concentric glow rings for visual depth
 */
const FloorGlowRings = () => {
  const ringsRef = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    if (!ringsRef.current) return;
    // Slow rotation
    ringsRef.current.rotation.z = clock.elapsedTime * 0.02;
  });
  
  const rings = useMemo(() => {
    const ringData = [];
    const radii = [8, 15, 25, 38, 52];
    const colors = ['#00d4ff', '#a855f7', '#00d4ff', '#a855f7', '#00d4ff'];
    const opacities = [0.4, 0.3, 0.25, 0.2, 0.15];
    
    for (let i = 0; i < radii.length; i++) {
      ringData.push({
        radius: radii[i],
        color: colors[i],
        opacity: opacities[i],
        thickness: 0.08 - i * 0.01,
      });
    }
    return ringData;
  }, []);
  
  return (
    <group ref={ringsRef} position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      {rings.map((ring, i) => (
        <mesh key={i}>
          <torusGeometry args={[ring.radius, ring.thickness, 8, 128]} />
          <meshBasicMaterial 
            color={ring.color} 
            transparent 
            opacity={ring.opacity}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
};

/**
 * EdgeFade - Gradient fade at the edges for infinite look
 */
const EdgeFade = () => {
  const fadeRef = useRef<THREE.Mesh>(null);
  
  // Create radial gradient texture
  const gradientTexture = useMemo(() => {
    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;
    
    // Radial gradient from transparent center to dark edges
    const gradient = ctx.createRadialGradient(
      size / 2, size / 2, 0,
      size / 2, size / 2, size / 2
    );
    gradient.addColorStop(0, 'rgba(10, 15, 26, 0)');
    gradient.addColorStop(0.5, 'rgba(10, 15, 26, 0)');
    gradient.addColorStop(0.7, 'rgba(10, 15, 26, 0.3)');
    gradient.addColorStop(0.85, 'rgba(10, 15, 26, 0.7)');
    gradient.addColorStop(1, 'rgba(10, 15, 26, 1)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);
  
  return (
    <mesh ref={fadeRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
      <circleGeometry args={[65, 64]} />
      <meshBasicMaterial 
        map={gradientTexture}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
};

/**
 * DataFlowParticles - Particles flowing across the floor
 * Creates the illusion of data streams beneath the surface
 */
export const DataFlowParticles = ({ count = 500 }: { count?: number }) => {
  const pointsRef = useRef<THREE.Points>(null);
  
  const { positions, velocities } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 2); // x, z velocities
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const i2 = i * 2;
      
      // Random position on the floor
      const angle = Math.random() * Math.PI * 2;
      const radius = 5 + Math.random() * 45;
      
      pos[i3] = Math.cos(angle) * radius;
      pos[i3 + 1] = -1.9 + Math.random() * 0.1; // Just above floor
      pos[i3 + 2] = Math.sin(angle) * radius;
      
      // Velocity toward center with some variation
      const speed = 0.02 + Math.random() * 0.03;
      vel[i2] = -Math.cos(angle) * speed;
      vel[i2 + 1] = -Math.sin(angle) * speed;
    }
    
    return { positions: pos, velocities: vel };
  }, [count]);
  
  useFrame(() => {
    if (!pointsRef.current) return;
    
    const posArray = pointsRef.current.geometry.attributes.position.array as Float32Array;
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const i2 = i * 2;
      
      // Move toward center
      posArray[i3] += velocities[i2];
      posArray[i3 + 2] += velocities[i2 + 1];
      
      // Check if reached center, reset to edge
      const dist = Math.sqrt(posArray[i3] ** 2 + posArray[i3 + 2] ** 2);
      if (dist < 3) {
        const newAngle = Math.random() * Math.PI * 2;
        const newRadius = 45 + Math.random() * 10;
        posArray[i3] = Math.cos(newAngle) * newRadius;
        posArray[i3 + 2] = Math.sin(newAngle) * newRadius;
        
        // Update velocity
        const speed = 0.02 + Math.random() * 0.03;
        velocities[i2] = -Math.cos(newAngle) * speed;
        velocities[i2 + 1] = -Math.sin(newAngle) * speed;
      }
    }
    
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });
  
  // Create geometry with positions
  const geometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geom;
  }, [positions]);
  
  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        color="#00d4ff"
        size={0.15}
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

export default DigitalHexGridLake;
