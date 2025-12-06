'use client';

import { useRef, useState, useMemo } from 'react';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import { Html, useTexture, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import type { Group, Mesh } from 'three';

/**
 * Contact Token Configuration
 * Sci-Fi style tokens with glass effect and brand logos
 */
interface ContactConfig {
  id: string;
  label: string;
  value: string;
  href: string;
  brandColor: string;
  glowColor: string;
  orbit: number;
  speed: number;
  offset: number;
  yOffset: number;
}

export const CONTACTS: ContactConfig[] = [
  { 
    id: 'email',
    label: 'Gmail',
    value: 'huynhhoainam.work@gmail.com',
    href: 'mailto:huynhhoainam.work@gmail.com',
    brandColor: '#ea4335',
    glowColor: '#ff6b6b',
    orbit: 6.5,
    speed: 0.18,
    offset: 0,
    yOffset: 0.3,
  },
  { 
    id: 'github',
    label: 'GitHub',
    value: 'NamJore04',
    href: 'https://github.com/NamJore04',
    brandColor: '#ffffff',
    glowColor: '#a855f7',
    orbit: 7,
    speed: -0.14,
    offset: Math.PI * 0.4,
    yOffset: 0.5,
  },
  { 
    id: 'linkedin',
    label: 'LinkedIn',
    value: 'Jore Nam',
    href: 'https://linkedin.com/in/jore-nam-943a02236',
    brandColor: '#0077b5',
    glowColor: '#00d4ff',
    orbit: 6.5,
    speed: 0.16,
    offset: Math.PI * 0.8,
    yOffset: 0.2,
  },
  { 
    id: 'phone',
    label: 'Phone',
    value: '0376 985 763',
    href: 'tel:+84376985763',
    brandColor: '#34d399',
    glowColor: '#34d399',
    orbit: 7,
    speed: -0.2,
    offset: Math.PI * 1.2,
    yOffset: 0.4,
  },
  { 
    id: 'facebook',
    label: 'Facebook',
    value: 'Nam Huỳnh',
    href: 'https://www.facebook.com/nam.huynh.224968',
    brandColor: '#1877f2',
    glowColor: '#4da3ff',
    orbit: 6.5,
    speed: 0.12,
    offset: Math.PI * 1.6,
    yOffset: 0.35,
  },
];

/**
 * OrbitingContactTokens - All contact tokens orbiting the hero
 */
export const OrbitingContactTokens = () => {
  return (
    <group>
      {CONTACTS.map((contact) => (
        <ContactTokenOrbit key={contact.id} {...contact} />
      ))}
    </group>
  );
};

/**
 * ContactTokenOrbit - Individual orbiting token
 */
const ContactTokenOrbit = (props: ContactConfig) => {
  const { id, label, value, href, brandColor, glowColor, orbit, speed, offset, yOffset } = props;
  const groupRef = useRef<Group>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    
    const angle = clock.elapsedTime * speed + offset;
    groupRef.current.position.x = Math.cos(angle) * orbit;
    groupRef.current.position.z = Math.sin(angle) * orbit;
    groupRef.current.position.y = Math.sin(clock.elapsedTime * 0.8 + yOffset * 10) * 0.3 + 2.5;
    
    // Face outward from center
    groupRef.current.rotation.y = -angle + Math.PI;
  });
  
  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    window.open(href, '_blank', 'noopener,noreferrer');
  };
  
  return (
    <group 
      ref={groupRef}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <SciFiToken 
        id={id} 
        brandColor={brandColor} 
        glowColor={glowColor}
        isHovered={isHovered} 
      />
      
      {/* Hover tooltip */}
      <Html
        position={[0, 1.5, 0]}
        center
        distanceFactor={12}
        className="pointer-events-none select-none"
        style={{
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 0.3s ease',
          transform: isHovered ? 'scale(1)' : 'scale(0.8)',
        }}
      >
        <div className="text-center whitespace-nowrap bg-[#0a0f1a]/95 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/20 shadow-2xl">
          <p className="text-sm font-bold tracking-wide" style={{ color: glowColor }}>{label}</p>
          <p className="text-xs text-gray-300 mt-0.5">{value}</p>
        </div>
      </Html>
    </group>
  );
};

/**
 * SciFiToken - Glass-like coin token with logo
 * Uses MeshPhysicalMaterial for realistic glass effect
 */
interface SciFiTokenProps {
  id: string;
  brandColor: string;
  glowColor: string;
  isHovered: boolean;
}

const SciFiToken = ({ id, brandColor, glowColor, isHovered }: SciFiTokenProps) => {
  const tokenRef = useRef<Group>(null);
  const glowRingRef = useRef<Mesh>(null);
  
  const scale = isHovered ? 1.15 : 1;
  const glowIntensity = isHovered ? 2.5 : 1;
  
  useFrame(({ clock }) => {
    if (!tokenRef.current) return;
    // Subtle self-rotation
    tokenRef.current.rotation.y = clock.elapsedTime * 0.4;
    
    // Pulsing glow ring
    if (glowRingRef.current) {
      const pulse = Math.sin(clock.elapsedTime * 3) * 0.1 + 0.9;
      glowRingRef.current.scale.setScalar(pulse);
    }
  });
  
  return (
    <group ref={tokenRef} scale={[scale, scale, scale]}>
      {/* Main token body - Dark glass cylinder */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.55, 0.55, 0.12, 32]} />
        <meshPhysicalMaterial
          color="#0a0f1a"
          metalness={0.3}
          roughness={0.15}
          transmission={0.4}
          thickness={0.5}
          envMapIntensity={1}
          clearcoat={1}
          clearcoatRoughness={0.1}
          transparent
          opacity={0.9}
        />
      </mesh>
      
      {/* Inner glow disc */}
      <mesh position={[0, 0.061, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.48, 32]} />
        <meshBasicMaterial 
          color={glowColor} 
          transparent 
          opacity={isHovered ? 0.4 : 0.2}
        />
      </mesh>
      
      {/* Logo/Icon on front face */}
      <TokenLogo id={id} brandColor={brandColor} isHovered={isHovered} />
      
      {/* Outer glow ring */}
      <mesh 
        ref={glowRingRef}
        position={[0, 0.07, 0]} 
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <torusGeometry args={[0.58, 0.035, 16, 48]} />
        <meshBasicMaterial 
          color={glowColor} 
          transparent 
          opacity={isHovered ? 0.9 : 0.5}
        />
      </mesh>
      
      {/* Secondary inner ring */}
      <mesh position={[0, 0.065, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.45, 0.015, 8, 32]} />
        <meshBasicMaterial 
          color={brandColor} 
          transparent 
          opacity={0.4}
        />
      </mesh>
      
      {/* Bottom glow ring */}
      <mesh position={[0, -0.065, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.55, 0.02, 8, 32]} />
        <meshBasicMaterial 
          color={glowColor} 
          transparent 
          opacity={0.3}
        />
      </mesh>
      
      {/* Point light for glow effect */}
      <pointLight 
        color={glowColor} 
        intensity={glowIntensity} 
        distance={4}
        position={[0, 0.2, 0]}
      />
    </group>
  );
};

/**
 * TokenLogo - Renders the appropriate brand logo on the token
 * Using geometric shapes to create recognizable logos
 */
const TokenLogo = ({ id, brandColor, isHovered }: { id: string; brandColor: string; isHovered: boolean }) => {
  const logoOpacity = isHovered ? 1 : 0.85;
  
  switch (id) {
    case 'email':
      return (
        <group position={[0, 0.065, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          {/* Gmail M icon */}
          <mesh>
            <planeGeometry args={[0.55, 0.4]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={logoOpacity} />
          </mesh>
          {/* M left diagonal */}
          <mesh position={[-0.12, 0.08, 0.001]} rotation={[0, 0, 0.6]}>
            <planeGeometry args={[0.25, 0.06]} />
            <meshBasicMaterial color={brandColor} />
          </mesh>
          {/* M right diagonal */}
          <mesh position={[0.12, 0.08, 0.001]} rotation={[0, 0, -0.6]}>
            <planeGeometry args={[0.25, 0.06]} />
            <meshBasicMaterial color={brandColor} />
          </mesh>
          {/* M center V */}
          <mesh position={[0, -0.02, 0.001]}>
            <planeGeometry args={[0.08, 0.18]} />
            <meshBasicMaterial color={brandColor} />
          </mesh>
        </group>
      );
      
    case 'github':
      return (
        <group position={[0, 0.065, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          {/* GitHub octocat simplified - circle with cat silhouette */}
          <mesh>
            <circleGeometry args={[0.32, 32]} />
            <meshBasicMaterial color="#24292e" transparent opacity={logoOpacity} />
          </mesh>
          {/* Cat head */}
          <mesh position={[0, 0.05, 0.001]}>
            <circleGeometry args={[0.15, 32]} />
            <meshBasicMaterial color={brandColor} />
          </mesh>
          {/* Left ear */}
          <mesh position={[-0.1, 0.18, 0.001]} rotation={[0, 0, -0.3]}>
            <coneGeometry args={[0.06, 0.1, 3]} />
            <meshBasicMaterial color={brandColor} />
          </mesh>
          {/* Right ear */}
          <mesh position={[0.1, 0.18, 0.001]} rotation={[0, 0, 0.3]}>
            <coneGeometry args={[0.06, 0.1, 3]} />
            <meshBasicMaterial color={brandColor} />
          </mesh>
          {/* Body */}
          <mesh position={[0, -0.12, 0.001]}>
            <circleGeometry args={[0.1, 32]} />
            <meshBasicMaterial color={brandColor} />
          </mesh>
        </group>
      );
      
    case 'linkedin':
      return (
        <group position={[0, 0.065, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          {/* LinkedIn square background */}
          <mesh>
            <planeGeometry args={[0.5, 0.5]} />
            <meshBasicMaterial color={brandColor} transparent opacity={logoOpacity} />
          </mesh>
          {/* "i" dot */}
          <mesh position={[-0.12, 0.14, 0.001]}>
            <circleGeometry args={[0.045, 16]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          {/* "i" stem */}
          <mesh position={[-0.12, -0.04, 0.001]}>
            <planeGeometry args={[0.07, 0.22]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          {/* "n" left stem */}
          <mesh position={[0.04, -0.04, 0.001]}>
            <planeGeometry args={[0.06, 0.22]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          {/* "n" top */}
          <mesh position={[0.1, 0.06, 0.001]}>
            <planeGeometry args={[0.14, 0.05]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          {/* "n" right stem */}
          <mesh position={[0.16, -0.04, 0.001]}>
            <planeGeometry args={[0.06, 0.22]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        </group>
      );
      
    case 'phone':
      return (
        <group position={[0, 0.065, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          {/* Phone body */}
          <RoundedBox args={[0.22, 0.4, 0.02]} radius={0.03} smoothness={4}>
            <meshBasicMaterial color={brandColor} transparent opacity={logoOpacity} />
          </RoundedBox>
          {/* Screen */}
          <mesh position={[0, 0, 0.011]}>
            <planeGeometry args={[0.17, 0.32]} />
            <meshBasicMaterial color="#0a1628" />
          </mesh>
          {/* Screen glow */}
          <mesh position={[0, 0, 0.012]}>
            <planeGeometry args={[0.15, 0.28]} />
            <meshBasicMaterial color={brandColor} transparent opacity={0.3} />
          </mesh>
        </group>
      );
      
    case 'facebook':
      return (
        <group position={[0, 0.065, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          {/* Facebook circle background */}
          <mesh>
            <circleGeometry args={[0.32, 32]} />
            <meshBasicMaterial color={brandColor} transparent opacity={logoOpacity} />
          </mesh>
          {/* "f" vertical stem */}
          <mesh position={[0.02, -0.02, 0.001]}>
            <planeGeometry args={[0.08, 0.38]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          {/* "f" horizontal bar */}
          <mesh position={[0, 0.06, 0.001]}>
            <planeGeometry args={[0.22, 0.06]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          {/* "f" top curve */}
          <mesh position={[0.1, 0.15, 0.001]}>
            <planeGeometry args={[0.1, 0.06]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        </group>
      );
      
    default:
      return (
        <mesh position={[0, 0.065, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.3, 32]} />
          <meshBasicMaterial color={brandColor} transparent opacity={logoOpacity} />
        </mesh>
      );
  }
};

export default OrbitingContactTokens;
