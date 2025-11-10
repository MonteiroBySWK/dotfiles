"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { useMobile } from "../hooks/use-mobile";
import { COLORS } from "../constants";

export function SpiralParticles() {
  const particles = useRef<THREE.Group>(null);
  const isMobile = useMobile();

  useFrame((state) => {
    if (!particles.current) return;

    const time = state.clock.getElapsedTime();

    particles.current.children.forEach((particle, i) => {
      const angle = (time * 0.5 + i * 0.3) % (Math.PI * 2);
      const radius = 3 + Math.sin(time * 0.3 + i) * 0.5;
      const height = Math.sin(time * 0.4 + i * 0.5) * 2;

      particle.position.x = Math.cos(angle) * radius;
      particle.position.y = height;
      particle.position.z = Math.sin(angle) * radius;

      const baseOpacity = isMobile ? 0.4 : 0.3;
      const opacity = baseOpacity + Math.sin(time * 2 + i) * 0.2;
      const mesh = particle as THREE.Mesh;
      if (mesh.material && "opacity" in mesh.material) {
        mesh.material.opacity = opacity;
      }
    });
  });

  return (
    <group ref={particles}>
      {Array.from({ length: 12 }).map((_, i) => (
        <mesh key={i}>
          <sphereGeometry args={[isMobile ? 0.06 : 0.05, 8, 8]} />
          <meshBasicMaterial
            color={
              i % 3 === 0
                ? COLORS.primary
                : i % 3 === 1
                ? COLORS.secondary
                : COLORS.text
            }
            transparent
            opacity={isMobile ? 0.6 : 0.5}
          />
        </mesh>
      ))}
    </group>
  );
}
