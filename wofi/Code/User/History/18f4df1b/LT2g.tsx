"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { useMobile } from "../hooks/use-mobile";
import { COLORS } from "../constants";

export function WireframeSphere() {
  const wireframeRef = useRef<THREE.LineSegments>(null);
  const isMobile = useMobile();

  useFrame((state) => {
    if (!wireframeRef.current) return;

    const time = state.clock.getElapsedTime();
    const speedMultiplier = isMobile ? 0.5 : 1;
    
    wireframeRef.current.rotation.x = -time * 0.1 * speedMultiplier;
    wireframeRef.current.rotation.y = time * 0.15 * speedMultiplier;
    wireframeRef.current.rotation.z = -time * 0.08 * speedMultiplier;
  });

  return (
    <lineSegments ref={wireframeRef}>
      <sphereGeometry args={[2.8, 32, 32]} />
      <lineBasicMaterial
        color={COLORS.primary}
        transparent
        opacity={isMobile ? 0.25 : 0.15}
      />
    </lineSegments>
  );
}
