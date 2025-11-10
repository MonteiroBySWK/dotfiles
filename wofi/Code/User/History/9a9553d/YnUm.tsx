"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { COLORS } from "./constants";

export function FrequencyWaves() {
  const wavesRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!wavesRef.current) return;

    const time = state.clock.getElapsedTime();

    wavesRef.current.children.forEach((wave, waveIndex) => {
      const mesh = wave as THREE.Mesh;
      const geometry = mesh.geometry as THREE.TorusGeometry;
      const positions = geometry.attributes.position;

      for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i);
        const y = positions.getY(i);
        const z = positions.getZ(i);

        const distortion = Math.sin(time * 2 + i * 0.1 + waveIndex) * 0.1;
        positions.setY(i, y + distortion);
      }

      positions.needsUpdate = true;

      mesh.rotation.x = time * 0.3 + waveIndex;
      mesh.rotation.y = time * 0.2;

      if (mesh.material && "opacity" in mesh.material) {
        mesh.material.opacity = 0.2 + Math.sin(time * 1.5 + waveIndex) * 0.1;
      }
    });
  });

  return (
    <group ref={wavesRef} position={[0, 0, 0]}>
      {Array.from({ length: 5 }).map((_, i) => (
        <mesh key={i}>
          <torusGeometry args={[2 + i * 0.5, 0.05, 16, 100]} />
          <meshBasicMaterial
            color={i % 2 === 0 ? COLORS.primary : COLORS.secondary}
            transparent
            opacity={0.2}
            wireframe={true}
          />
        </mesh>
      ))}
    </group>
  );
}
