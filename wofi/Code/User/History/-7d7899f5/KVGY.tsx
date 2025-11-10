"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { useMobile } from "@/hooks/useMobile";
import { COLORS } from "./constants";

interface MainIcosahedronProps {
  mousePosition: React.MutableRefObject<THREE.Vector2>;
}

export function MainIcosahedron({ mousePosition }: MainIcosahedronProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const isMobile = useMobile();

  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.getElapsedTime();

    const mouseInfluence = isMobile ? 0 : 0.1;
    meshRef.current.rotation.x =
      Math.sin(time * 0.2) * 0.1 +
      (mousePosition.current.y - 0.5) * mouseInfluence;
    meshRef.current.rotation.y =
      Math.cos(time * 0.15) * 0.1 +
      (mousePosition.current.x - 0.5) * mouseInfluence;
    meshRef.current.rotation.z = time * 0.05;

    const scaleAmount = isMobile ? 0.02 : 0.05;
    const scale = 1 + Math.sin(time * 0.3) * scaleAmount;
    meshRef.current.scale.set(scale, scale, scale);
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[2, 4]} />
      <meshStandardMaterial
        color={COLORS.primary}
        wireframe={false}
        emissive={COLORS.secondary}
        emissiveIntensity={isMobile ? 0.3 : 0.2}
        roughness={0.3}
        metalness={0.8}
      />
    </mesh>
  );
}
