"use client";

import { useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";
import { useMobile } from "@/hooks/useMobile";
import { PARTICLE_CONFIG, COLORS } from "./constants";

interface FloatingParticleProps {
  index: number;
}

export function FloatingParticle({ index }: FloatingParticleProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const isMobile = useMobile();
  
  const offset = useMemo(
    () => ({
      x: (Math.random() - 0.5) * 15,
      y: (Math.random() - 0.5) * 15,
      z: (Math.random() - 0.5) * 15,
      speed: Math.random() * 0.5 + 0.2,
      phase: Math.random() * Math.PI * 2,
    }),
    []
  );

  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.getElapsedTime();
    meshRef.current.position.x =
      offset.x + Math.sin(time * offset.speed + offset.phase) * 2;
    meshRef.current.position.y =
      offset.y + Math.cos(time * offset.speed * 0.7 + offset.phase) * 2;
    meshRef.current.position.z =
      offset.z + Math.sin(time * offset.speed * 0.5 + offset.phase) * 2;
  });

  const config = isMobile ? PARTICLE_CONFIG.mobile : PARTICLE_CONFIG.desktop;

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[config.size, 8, 8]} />
      <meshBasicMaterial
        color={index % 2 === 0 ? COLORS.primary : COLORS.secondary}
        opacity={config.opacity}
        transparent
      />
    </mesh>
  );
}
