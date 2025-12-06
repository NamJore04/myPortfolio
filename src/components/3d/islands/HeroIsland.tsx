'use client';

import { useRef, useMemo, useState } from 'react';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import { Html, Float } from '@react-three/drei';
import * as THREE from 'three';
import type { Group, Mesh } from 'three';
import { createToonGradient } from '@/utils/textures';
import { usePortfolioStore } from '@/stores/usePortfolioStore';
import { OrbitingContactTokens } from '../ContactToken';
import { AntiGravityTurbine } from '../AntiGravityTurbine';
import type { Project } from '@/types';

interface HeroIslandProps {
  enableFloat?: boolean;
}

/**
 * HeroIsland - Central terminal platform
 * Displays name, role, and orbiting contact icons
 * TV screen shows: welcome → project info → YouTube lofi
 */
export const HeroIsland = ({ enableFloat = true }: HeroIslandProps) => {
  const groupRef = useRef<Group>(null);
  const { selectedProject, tvState, openModal } = usePortfolioStore();
  
  const content = (
    <>
      {/* Island Base Platform */}
      <IslandBase />
      
      {/* Terminal/Screen - Shows different content based on tvState */}
      <Terminal 
        position={[0, 1.5, 0]} 
        selectedProject={selectedProject}
        tvState={tvState}
        onViewDetails={openModal}
      />
      
      {/* Glow ring */}
      <GlowRing />
      
      {/* Anti-Gravity Turbine - explains why island floats */}
      <AntiGravityTurbine scale={1.1} />
    </>
  );
  
  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Floating animation wrapper */}
      {enableFloat ? (
        <Float
          speed={2}
          rotationIntensity={0.1}
          floatIntensity={0.3}
          floatingRange={[-0.1, 0.1]}
        >
          {content}
        </Float>
      ) : content}
      
      {/* Orbiting Contact Tokens - New Sci-Fi style */}
      <OrbitingContactTokens />
      
      {/* HTML Overlay - Profile Info */}
      <Html
        position={[0, 4, 0]}
        center
        distanceFactor={15}
        className="pointer-events-none select-none"
      >
        <div className="text-center whitespace-nowrap">
          <h1 className="text-2xl font-bold text-white tracking-wider">
            HUYNH HOAI NAM
          </h1>
          <p className="text-sm text-cyan-400 mt-1">
            CS Student @ TDTU / AI & Fullstack Engineer
          </p>
          <p className="text-xs text-gray-400 mt-2 italic">
            &quot;Building the future, one project at a time.&quot;
          </p>
        </div>
      </Html>
    </group>
  );
};

/**
 * Island Base - Floating platform with toon material
 */
const IslandBase = () => {
  const meshRef = useRef<Mesh>(null);
  
  // Create gradient texture for toon shading (SSR-safe)
  const gradientMap = useMemo(() => createToonGradient(), []);
  
  return (
    <group>
      {/* Main platform */}
      <mesh ref={meshRef} position={[0, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[3, 3.5, 0.5, 32]} />
        <meshToonMaterial
          color="#1e3a5f"
          gradientMap={gradientMap}
        />
      </mesh>
      
      {/* Platform rim glow */}
      <mesh position={[0, 0.26, 0]}>
        <torusGeometry args={[3, 0.05, 8, 64]} />
        <meshBasicMaterial color="#00d4ff" transparent opacity={0.8} />
      </mesh>
      
      {/* Bottom glow */}
      <mesh position={[0, -0.3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[3.5, 32]} />
        <meshBasicMaterial color="#00d4ff" transparent opacity={0.1} />
      </mesh>
    </group>
  );
};

/**
 * Terminal - Central display screen with 3 states
 * 1. Welcome: Instructions for new users
 * 2. Project: Show project info with "View Details" button
 * 3. YouTube: Lofi stream after viewing project
 */
interface TerminalProps {
  position: [number, number, number];
  selectedProject: Project | null;
  tvState: 'welcome' | 'project' | 'youtube';
  onViewDetails: () => void;
}

const Terminal = ({ position, selectedProject, tvState, onViewDetails }: TerminalProps) => {
  const getScreenColor = () => {
    switch (tvState) {
      case 'project': return '#a855f7';
      case 'youtube': return '#ff6b35'; // Warm orange for lofi vibe
      default: return '#00d4ff';
    }
  };
  
  const screenColor = getScreenColor();
  
  return (
    <group position={position}>
      {/* Screen frame */}
      <mesh castShadow>
        <boxGeometry args={[2.5, 1.8, 0.1]} />
        <meshToonMaterial color="#0f172a" />
      </mesh>
      
      {/* Screen surface with glow */}
      <mesh position={[0, 0, 0.06]}>
        <planeGeometry args={[2.3, 1.6]} />
        <meshBasicMaterial color={screenColor} transparent opacity={0.15} />
      </mesh>
      
      {/* Screen border glow */}
      <mesh position={[0, 0, 0.051]}>
        <planeGeometry args={[2.4, 1.7]} />
        <meshBasicMaterial color={screenColor} transparent opacity={0.3} />
      </mesh>
      
      {/* HTML content on screen */}
      <Html
        position={[0, 0, 0.07]}
        center
        distanceFactor={8}
        transform
        className="select-none"
      >
        <div 
          className="w-[180px] h-[130px] overflow-hidden"
          style={{ 
            background: tvState === 'youtube' ? 'transparent' : 'rgba(15, 23, 42, 0.9)',
            borderRadius: '4px',
          }}
        >
          {tvState === 'welcome' && <WelcomeScreen />}
          {tvState === 'project' && selectedProject && (
            <ProjectScreen project={selectedProject} onViewDetails={onViewDetails} />
          )}
          {tvState === 'youtube' && <YouTubeScreen />}
        </div>
      </Html>
      
      {/* Stand */}
      <mesh position={[0, -1.1, 0]} castShadow>
        <boxGeometry args={[0.3, 0.4, 0.3]} />
        <meshToonMaterial color="#1e293b" />
      </mesh>
    </group>
  );
};

/**
 * Welcome Screen - Instructions for new users
 */
const WelcomeScreen = () => (
  <div className="text-center h-full flex flex-col justify-center p-2">
    <div className="mb-2">
      <p className="text-[11px] font-mono text-cyan-400 animate-pulse font-bold">
        WELCOME
      </p>
    </div>
    <div className="space-y-1.5 text-left px-2">
      <p className="text-[7px] text-gray-300 flex items-center gap-1">
        <span className="text-cyan-400">▸</span> Click trên đảo dự án để xem
      </p>
      <p className="text-[7px] text-gray-300 flex items-center gap-1">
        <span className="text-purple-400">▸</span> Click icon liên lạc để kết nối
      </p>
      <p className="text-[7px] text-gray-300 flex items-center gap-1">
        <span className="text-green-400">▸</span> Kéo chuột để xoay góc nhìn
      </p>
    </div>
    <div className="mt-2 flex justify-center gap-1">
      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
      <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" style={{ animationDelay: '0.2s' }} />
      <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" style={{ animationDelay: '0.4s' }} />
    </div>
  </div>
);

/**
 * Project Screen - Shows project info with View Details button
 */
const ProjectScreen = ({ project, onViewDetails }: { project: Project; onViewDetails: () => void }) => (
  <div className="text-center h-full flex flex-col p-2">
    <p className="text-[10px] font-bold tracking-wider mb-1 truncate text-purple-400">
      {project.title}
    </p>
    <p className="text-[7px] text-gray-400 mb-1">
      {project.role}
    </p>
    
    {/* Tech stack badges */}
    <div className="flex flex-wrap justify-center gap-0.5 mb-1">
      {project.techStack.slice(0, 4).map((tech) => (
        <span 
          key={tech}
          className="text-[5px] px-1 py-0.5 rounded bg-white/10 text-cyan-300"
        >
          {tech}
        </span>
      ))}
    </div>
    
    {/* Highlights */}
    <div className="flex justify-center gap-2 mb-2">
      {project.highlights.slice(0, 2).map((h, i) => (
        <div key={i} className="text-center">
          <p className="text-[8px] font-bold text-purple-400">{h.metric}</p>
          <p className="text-[5px] text-gray-500">{h.description}</p>
        </div>
      ))}
    </div>
    
    {/* View Details Button */}
    <button
      onClick={onViewDetails}
      className="pointer-events-auto mt-auto px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white text-[8px] rounded transition-colors font-medium"
    >
      XEM CHI TIẾT →
    </button>
  </div>
);

/**
 * YouTube Screen - Embedded lofi stream
 */
const YouTubeScreen = () => (
  <div className="w-full h-full flex items-center justify-center bg-[#0f172a] rounded overflow-hidden">
    <img
      src="/lofi-boy.gif"
      alt="Lofi Boy"
      className="w-full h-full object-cover"
      style={{ imageRendering: 'auto' }}
    />
  </div>
);

/**
 * Glow Ring - Animated ring around platform
 */
const GlowRing = () => {
  const ringRef = useRef<Mesh>(null);
  
  useFrame(({ clock }) => {
    if (!ringRef.current) return;
    ringRef.current.rotation.z = clock.elapsedTime * 0.2;
  });
  
  return (
    <mesh ref={ringRef} position={[0, 0.3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <torusGeometry args={[4, 0.02, 8, 64]} />
      <meshBasicMaterial color="#a855f7" transparent opacity={0.6} />
    </mesh>
  );
};

