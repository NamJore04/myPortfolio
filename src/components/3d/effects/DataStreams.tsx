'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface DataStreamProps {
  start: [number, number, number];
  end: [number, number, number];
  color?: string;
  particleCount?: number;
  speed?: number;
}

/**
 * DataStream - Animated particle flow between islands
 * Creates visual connection showing data/skill flow
 */
export const DataStream = ({
  start,
  end,
  color = '#00d4ff',
  particleCount = 30,
  speed = 0.5,
}: DataStreamProps) => {
  const pointsRef = useRef<THREE.Points>(null);
  
  // Create curve path between points
  const curve = useMemo(() => {
    const startVec = new THREE.Vector3(...start);
    const endVec = new THREE.Vector3(...end);
    const midPoint = new THREE.Vector3().lerpVectors(startVec, endVec, 0.5);
    midPoint.y += 3; // Arc height
    
    return new THREE.QuadraticBezierCurve3(startVec, midPoint, endVec);
  }, [start, end]);
  
  // Create particle geometry
  const particleGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const offsets = new Float32Array(particleCount);
    
    for (let i = 0; i < particleCount; i++) {
      offsets[i] = i / particleCount;
      const point = curve.getPoint(offsets[i]);
      positions[i * 3] = point.x;
      positions[i * 3 + 1] = point.y;
      positions[i * 3 + 2] = point.z;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    (geometry as any).offsets = offsets;
    
    return geometry;
  }, [curve, particleCount]);
  
  // Create line geometry for path
  const lineGeometry = useMemo(() => {
    const points = curve.getPoints(50);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    return geometry;
  }, [curve]);
  
  // Animate particles along curve
  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    
    const posAttr = pointsRef.current.geometry.attributes.position;
    const posArray = posAttr.array as Float32Array;
    const offsets = (pointsRef.current.geometry as any).offsets as Float32Array;
    
    for (let i = 0; i < particleCount; i++) {
      const t = (offsets[i] + clock.elapsedTime * speed) % 1;
      const point = curve.getPoint(t);
      
      posArray[i * 3] = point.x;
      posArray[i * 3 + 1] = point.y;
      posArray[i * 3 + 2] = point.z;
    }
    
    posAttr.needsUpdate = true;
  });
  
  return (
    <group>
      {/* Particle stream */}
      <points ref={pointsRef} geometry={particleGeometry}>
        <pointsMaterial
          color={color}
          size={0.12}
          transparent
          opacity={0.8}
          sizeAttenuation
          depthWrite={false}
        />
      </points>
      
      {/* Faint line showing path */}
      <primitive object={new THREE.Line(lineGeometry, new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.15 }))} />
    </group>
  );
};

/**
 * DataStreams - All connections between islands
 * Hero (center) connects to all project islands
 * Updated to match hexagonal layout with increased distances
 */
export const DataStreams = () => {
  // Island positions (matching SceneContent layout)
  const heroPos: [number, number, number] = [0, 1, 0];
  const aiPos: [number, number, number] = [-9, 1, 7];
  const ecomPos: [number, number, number] = [9, 1, 7];
  const visionPos: [number, number, number] = [0, 1, -10];
  const ocrPos: [number, number, number] = [-12, 1, 0];
  const flutterPos: [number, number, number] = [12, 1, 0];
  
  return (
    <group>
      {/* Hero to AI Trading (front-left) */}
      <DataStream 
        start={heroPos} 
        end={aiPos} 
        color="#a855f7" 
        speed={0.3}
      />
      
      {/* Hero to E-commerce (front-right) */}
      <DataStream 
        start={heroPos} 
        end={ecomPos} 
        color="#00d4ff" 
        speed={0.35}
      />
      
      {/* Hero to Vision (back-center) */}
      <DataStream 
        start={heroPos} 
        end={visionPos} 
        color="#34d399" 
        speed={0.4}
      />
      
      {/* Hero to OCR (left) */}
      <DataStream 
        start={heroPos} 
        end={ocrPos} 
        color="#f97316" 
        speed={0.32}
      />
      
      {/* Hero to Flutter (right) */}
      <DataStream 
        start={heroPos} 
        end={flutterPos} 
        color="#02569B" 
        speed={0.38}
      />
      
      {/* Cross connections (subtle) - create web effect */}
      <DataStream 
        start={aiPos} 
        end={ocrPos} 
        color="#a855f7" 
        particleCount={12}
        speed={0.2}
      />
      
      <DataStream 
        start={ecomPos} 
        end={flutterPos} 
        color="#00d4ff" 
        particleCount={12}
        speed={0.22}
      />
      
      <DataStream 
        start={visionPos} 
        end={ocrPos} 
        color="#34d399" 
        particleCount={12}
        speed={0.18}
      />
      
      <DataStream 
        start={visionPos} 
        end={flutterPos} 
        color="#34d399" 
        particleCount={12}
        speed={0.18}
      />
    </group>
  );
};
