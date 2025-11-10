"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { FloatingParticle } from "./particles/floating-particle";
import { OuterRing } from "./geometries/outer-ring";
import { InnerRing } from "./geometries/inner-ring";
import { WireframeSphere } from "./geometries/wireframe-sphere";
import { MainIcosahedron } from "./geometries/main-icosahedron";
import { WaveRings } from "./effects/wave-rings";
import { SpiralParticles } from "./effects/spiral-particles";
import { FrequencyWaves } from "./effects/frequency-waves";
import { RotatingSegmentedRing } from "./effects/rotating-segmented-ring";
import { useMobile } from "./hooks/use-mobile";
import { PARTICLE_CONFIG, COLORS, ANIMATION_TIMINGS } from "./constants";

export function Scene() {
  const [isReady, setIsReady] = useState(false);
  const mousePosition = useRef(new THREE.Vector2(0.5, 0.5));
  const targetMousePosition = useRef(new THREE.Vector2(0.5, 0.5));
  const isMobile = useMobile();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, ANIMATION_TIMINGS.sceneReady);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const handleMouseMove = (event: MouseEvent) => {
      targetMousePosition.current.x = event.clientX / window.innerWidth;
      targetMousePosition.current.y = 1 - event.clientY / window.innerHeight;
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isMobile]);

  const particleCount = isMobile
    ? PARTICLE_CONFIG.mobile.count
    : PARTICLE_CONFIG.desktop.count;

  return (
    <group scale={isReady ? 1 : 0.95} position={[0, 0, 0]}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} color={COLORS.primary} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color={COLORS.secondary} />

      <OuterRing />
      <InnerRing />
      <WireframeSphere />
      <MainIcosahedron mousePosition={mousePosition} />

      {Array.from({ length: particleCount }).map((_, i) => (
        <FloatingParticle key={i} index={i} />
      ))}

      <WaveRings />
      
      {!isMobile && <SpiralParticles />}
      {!isMobile && <FrequencyWaves />}
      {!isMobile && <RotatingSegmentedRing />}
    </group>
  );
}
