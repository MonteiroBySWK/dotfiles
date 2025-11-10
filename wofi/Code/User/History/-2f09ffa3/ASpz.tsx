"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { useMobile } from "@/hooks/useMobile";
import { COLORS } from "./constants";

export function InnerRing() {
  const ringRef = useRef<THREE.Mesh>(null);
  const isMobile = useMobile();

  useFrame((state) => {
    if (!ringRef.current) return;

    const time = state.clock.getElapsedTime();
    const speedMultiplier = isMobile ? 0.5 : 1;
    
    ringRef.current.rotation.z = -time * 0.5 * speedMultiplier;
    
    const pulseAmount = isMobile ? 0.08 : 0.15;
    const pulseScale = 2.5 + Math.cos(time * 0.6) * pulseAmount;
    ringRef.current.scale.set(pulseScale, pulseScale, 1);
  });

  return (
    <mesh ref={ringRef} position={[0, 0, -0.5]}>
      <ringGeometry args={[2.3, 2.5, 48]} />
      <meshBasicMaterial
        color={COLORS.secondary}
        transparent
        opacity={isMobile ? 0.6 : 0.4}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
