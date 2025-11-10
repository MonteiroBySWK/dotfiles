"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { useMobile } from "../hooks/use-mobile";
import { COLORS } from "../constants";

export function WaveRings() {
  const rings = useRef<THREE.Group>(null);
  const isMobile = useMobile();

  useFrame((state) => {
    if (!rings.current) return;

    const time = state.clock.getElapsedTime();

    rings.current.children.forEach((ring, i) => {
      const offset = i * 0.5;
      const waveTime = (time + offset) % 3;
      const progress = waveTime / 3;

      const scale = 1 + progress * 4;
      ring.scale.set(scale, scale, 1);

      const mesh = ring as THREE.Mesh;
      if (mesh.material && "opacity" in mesh.material) {
        const baseOpacity = isMobile ? 0.7 : 0.6;
        mesh.material.opacity = Math.max(0, baseOpacity - progress * baseOpacity);
      }
    });
  });

  return (
    <group ref={rings}>
      {Array.from({ length: 3 }).map((_, i) => (
        <mesh key={i} position={[0, 0, -2]}>
          <ringGeometry args={[1.8, 2, 48]} />
          <meshBasicMaterial
            color={i % 2 === 0 ? COLORS.primary : COLORS.secondary}
            transparent
            opacity={isMobile ? 0.7 : 0.6}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}
