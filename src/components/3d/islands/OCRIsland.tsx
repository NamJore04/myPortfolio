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

interface OCRIslandProps {
  position?: [number, number, number];
  enableFloat?: boolean;
}

// Get OCR project data
const ocrProject = projects.find(p => p.id === 'ocr')!;

/**
 * OCRIsland - Represents OCR Recognition Project
 * Visual: Document with scanning beam + extracted text floating
 * Theme: Text extraction, document processing, AI
 */
export const OCRIsland = ({ position = [-4, 0, 8], enableFloat = true }: OCRIslandProps) => {
  const groupRef = useRef<Group>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  // Click-to-zoom interaction
  const { handleClick, isActive } = useIslandClick({
    project: ocrProject,
    islandId: 'ocr-island',
  });

  const content = (
    <>
      {/* Island Base */}
      <IslandBase isHovered={isHovered || isActive} />
      
      {/* Document Stack */}
      <DocumentStack position={[0, 0.8, 0]} />
      
      {/* Scanning Beam */}
      <ScanningBeam />
      
      {/* Floating Text Characters */}
      <FloatingCharacters />
      
      {/* Processing Pipeline Visual */}
      <PipelineIndicator position={[-1, 1.5, 0]} />
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
        <div className={`bg-gradient-to-r from-orange-900/80 to-yellow-900/80 backdrop-blur-sm px-4 py-2 rounded-lg border transition-all duration-300 cursor-pointer ${isHovered || isActive ? 'border-orange-400 shadow-lg shadow-orange-500/30' : 'border-orange-500/30'}`}>
          <h3 className="text-white font-bold text-sm whitespace-nowrap">
            OCR Recognition
          </h3>
          <div className="flex gap-3 mt-1 text-xs text-gray-300">
            <span>Tesseract</span>
            <span>OpenCV</span>
          </div>
          {(isHovered || isActive) && (
            <p className="text-orange-400 text-xs mt-1 animate-pulse">[ Click to explore ]</p>
          )}
        </div>
      </Html>
    </group>
  );
};

/**
 * Island Base Platform - Orange theme for OCR
 */
const IslandBase = ({ isHovered = false }: { isHovered?: boolean }) => {
  const gradientMap = useMemo(() => createToonGradient(), []);

  return (
    <group>
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[2.2, 2.7, 0.4, 6]} />
        <meshToonMaterial color={isHovered ? '#5f3a2a' : '#1e3a5f'} gradientMap={gradientMap} />
      </mesh>
      
      {/* Glow ring - Orange theme */}
      <mesh position={[0, 0.21, 0]}>
        <torusGeometry args={[2.2, isHovered ? 0.05 : 0.03, 8, 6]} />
        <meshBasicMaterial color="#f97316" transparent opacity={isHovered ? 1 : 0.8} />
      </mesh>
      
      {/* Anti-Gravity Turbine underneath */}
      <MiniTurbine color="#f97316" scale={0.6} />
    </group>
  );
};

/**
 * Document Stack - Stack of papers being scanned
 */
const DocumentStack = ({ position }: { position: [number, number, number] }) => {
  const groupRef = useRef<Group>(null);
  
  return (
    <group ref={groupRef} position={position}>
      {/* Bottom documents */}
      {[0, 0.08, 0.16].map((yOffset, i) => (
        <mesh key={i} position={[0, yOffset, 0]} rotation={[0, i * 0.05, 0]}>
          <boxGeometry args={[1.4, 0.05, 1.8]} />
          <meshToonMaterial color={i === 2 ? '#ffffff' : '#e5e5e5'} />
        </mesh>
      ))}
      
      {/* Text lines on top document */}
      {[0.3, 0.1, -0.1, -0.3, -0.5].map((zOffset, i) => (
        <mesh key={`line-${i}`} position={[0, 0.19, zOffset]}>
          <boxGeometry args={[1.1 - i * 0.1, 0.02, 0.08]} />
          <meshBasicMaterial color="#333333" />
        </mesh>
      ))}
    </group>
  );
};

/**
 * Scanning Beam - Animated line moving across document
 */
const ScanningBeam = () => {
  const beamRef = useRef<Mesh>(null);
  
  useFrame(({ clock }) => {
    if (!beamRef.current) return;
    // Oscillate beam position
    beamRef.current.position.z = Math.sin(clock.elapsedTime * 2) * 0.7;
  });
  
  return (
    <mesh ref={beamRef} position={[0, 1, 0]}>
      <boxGeometry args={[1.5, 0.02, 0.03]} />
      <meshBasicMaterial color="#f97316" transparent opacity={0.9} />
    </mesh>
  );
};

/**
 * Floating Characters - Extracted text floating up
 */
const FloatingCharacters = () => {
  const groupRef = useRef<Group>(null);
  
  // Characters that "float up" from document
  const chars = useMemo(() => {
    return ['A', 'B', '字', '1', '2', 'α'].map((char, i) => ({
      char,
      x: (Math.random() - 0.5) * 2,
      z: (Math.random() - 0.5) * 1.5,
      speed: 0.3 + Math.random() * 0.3,
      offset: i * 0.5,
    }));
  }, []);
  
  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.children.forEach((child, i) => {
      const data = chars[i];
      // Float upward cyclically
      child.position.y = 1.5 + ((clock.elapsedTime * data.speed + data.offset) % 2);
      // Fade effect via scale
      const progress = ((clock.elapsedTime * data.speed + data.offset) % 2) / 2;
      const scale = progress < 0.5 ? progress * 2 : (1 - progress) * 2;
      child.scale.setScalar(0.3 + scale * 0.3);
    });
  });
  
  return (
    <group ref={groupRef}>
      {chars.map((data, i) => (
        <mesh key={i} position={[data.x, 1.5, data.z]}>
          <boxGeometry args={[0.2, 0.25, 0.05]} />
          <meshBasicMaterial color="#f97316" transparent opacity={0.7} />
        </mesh>
      ))}
    </group>
  );
};

/**
 * Pipeline Indicator - Shows processing stages
 */
const PipelineIndicator = ({ position }: { position: [number, number, number] }) => {
  const stages = ['Input', 'Process', 'Output'];
  
  return (
    <group position={position}>
      {stages.map((_, i) => (
        <group key={i} position={[i * 0.8, 0, 0]}>
          {/* Stage node */}
          <mesh>
            <sphereGeometry args={[0.15, 8, 8]} />
            <meshBasicMaterial color={i === 1 ? '#f97316' : '#666666'} />
          </mesh>
          
          {/* Connection line */}
          {i < stages.length - 1 && (
            <mesh position={[0.4, 0, 0]}>
              <boxGeometry args={[0.5, 0.02, 0.02]} />
              <meshBasicMaterial color="#444444" />
            </mesh>
          )}
        </group>
      ))}
    </group>
  );
};
