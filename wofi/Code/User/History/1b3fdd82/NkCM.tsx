"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { useMobile } from "@/hooks/useMobile";
import { COLORS } from "./constants";

export function OuterRing() {
  const ringRef = useRef<THREE.Mesh>(null);
  const isMobile = useMobile();

  useFrame((state) => {
    if (!ringRef.current) return;

    const time = state.clock.getElapsedTime();
    const speedMultiplier = isMobile ? 0.5 : 1;
    
    ringRef.current.rotation.z = time * 0.3 * speedMultiplier;
    
    const pulseAmount = isMobile ? 0.1 : 0.2;
    const pulseScale = 3.5 + Math.sin(time * 0.4) * pulseAmount;
    ringRef.current.scale.set(pulseScale, pulseScale, 1);
  });

  return (
    <mesh ref={ringRef} position={[0, 0, -1]}>
      <ringGeometry args={[3.3, 3.5, 64]} />
      <meshBasicMaterial
        color={COLORS.primary}
        transparent
        opacity={isMobile ? 0.5 : 0.3}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
