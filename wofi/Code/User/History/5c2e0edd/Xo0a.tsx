"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { useMobile } from "../hooks/use-mobile";
import { COLORS } from "../constants";

export function RotatingSegmentedRing() {
  const segments = useRef<THREE.Group>(null);
  const isMobile = useMobile();

  useFrame((state) => {
    if (!segments.current) return;

    const time = state.clock.getElapsedTime();
    segments.current.rotation.z = time * 0.4;

    segments.current.children.forEach((segment, i) => {
      const mesh = segment as THREE.Mesh;

      const scalePhase = Math.sin(time * 2 + i * 0.3) * 0.5 + 0.5;
      mesh.scale.set(1, 1 + scalePhase * 0.5, 1);
      mesh.rotation.y = time * 1.5 + i;

      if (mesh.material && "emissiveIntensity" in mesh.material) {
        const baseIntensity = isMobile ? 0.4 : 0.2;
        mesh.material.emissiveIntensity = baseIntensity + scalePhase * 0.3;
      }
    });
  });

  const segmentCount = 24;

  return (
    <group ref={segments} position={[0, 0, 0]}>
      {Array.from({ length: segmentCount }).map((_, i) => {
        const angle = (i / segmentCount) * Math.PI * 2;
        const radius = 3.8;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;

        return (
          <mesh key={i} position={[x, 0, z]} rotation={[0, 0, angle]}>
            <boxGeometry args={[0.3, 0.1, 0.08]} />
            <meshStandardMaterial
              color={i % 2 === 0 ? COLORS.primary : COLORS.secondary}
              emissive={i % 2 === 0 ? COLORS.primary : COLORS.secondary}
              emissiveIntensity={isMobile ? 0.5 : 0.3}
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>
        );
      })}
    </group>
  );
}
