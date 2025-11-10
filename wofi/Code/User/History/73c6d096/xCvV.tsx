"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import { Scene } from "./Scene";
import { AsciiEffect } from "./AsciiEffect";
import { ANIMATION_TIMINGS } from "./constants";

export default function AsciiBackground() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, ANIMATION_TIMINGS.sceneReady);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="fixed inset-0 w-full h-full bg-[var(--color-background)]"
      style={{
        opacity: isReady ? 1 : 0,
        transition: `opacity ${ANIMATION_TIMINGS.fadeIn}ms ease-out`,
      }}
    >
      <Suspense
        fallback={
          <div className="w-full h-full bg-[var(--color-background)]" />
        }
      >
        <Canvas
          camera={{ position: [0, 0, 5], fov: 75 }}
          gl={{
            antialias: false,
            alpha: true,
            powerPreference: "high-performance",
          }}
          dpr={[1, 1.5]}
        >
          <Scene />
          <AsciiEffect />
        </Canvas>
      </Suspense>
    </div>
  );
}
