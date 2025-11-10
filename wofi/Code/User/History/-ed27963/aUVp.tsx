"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [currentFrame, setCurrentFrame] = useState(0);

  // Linux-style boot terminal frames
  const bootFrames = [
    `[    0.000000] TheraOS 2.0.1 booting...
[    0.001243] Initializing kernel modules
[    0.002847] Loading CPU microcode
[    0.003921] Memory: 32GB available
[    0.004155] Detecting hardware...
[    0.005234] 
[    0.005234] Starting Thera Labs services:
[    0.006789] * Loading development environment... [  OK  ]
[    0.007234] * Initializing code repositories... [  OK  ]
[    0.008945] * Starting React compiler... [     ]`,
    `[    0.000000] TheraOS 2.0.1 booting...
[    0.001243] Initializing kernel modules
[    0.002847] Loading CPU microcode
[    0.003921] Memory: 32GB available
[    0.004155] Detecting hardware...
[    0.005234] 
[    0.005234] Starting Thera Labs services:
[    0.006789] * Loading development environment... [  OK  ]
[    0.007234] * Initializing code repositories... [  OK  ]
[    0.008945] * Starting React compiler... [  OK  ]
[    0.009567] * Loading TypeScript engine... [     ]
[    0.010234] * Connecting to cloud services... [     ]`,
    `[    0.000000] TheraOS 2.0.1 booting...
[    0.001243] Initializing kernel modules
[    0.002847] Loading CPU microcode
[    0.003921] Memory: 32GB available
[    0.004155] Detecting hardware...
[    0.005234] 
[    0.005234] Starting Thera Labs services:
[    0.006789] * Loading development environment... [  OK  ]
[    0.007234] * Initializing code repositories... [  OK  ]
[    0.008945] * Starting React compiler... [  OK  ]
[    0.009567] * Loading TypeScript engine... [  OK  ]
[    0.010234] * Connecting to cloud services... [  OK  ]
[    0.011789] * Optimizing build pipeline... [  OK  ]
[    0.012456] * Testing deployment scripts... [     ]`,
    `[    0.000000] TheraOS 2.0.1 booting...
[    0.001243] Initializing kernel modules
[    0.002847] Loading CPU microcode
[    0.003921] Memory: 32GB available
[    0.004155] Detecting hardware...
[    0.005234] 
[    0.005234] Starting Thera Labs services:
[    0.006789] * Loading development environment... [  OK  ]
[    0.007234] * Initializing code repositories... [  OK  ]
[    0.008945] * Starting React compiler... [  OK  ]
[    0.009567] * Loading TypeScript engine... [  OK  ]
[    0.010234] * Connecting to cloud services... [  OK  ]
[    0.011789] * Optimizing build pipeline... [  OK  ]
[    0.012456] * Testing deployment scripts... [  OK  ]
[    0.013234] 
[    0.013234] TheraOS ready. Welcome to the future.
[    0.013234] thera@lab:~$ █`
  ];

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFrame((prev) => (prev + 1) % pcFrames.length);
    }, 1200);
    return () => clearInterval(interval);
  }, [pcFrames.length]);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-6 text-center font-mono">
      {/* Strong base gradient background */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#8937E6]/30 via-black to-[#0069CC]/30" />

      {/* Enhanced mouse interaction */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40 transition-all duration-500 ease-out"
        style={{
          background: `radial-gradient(700px 500px at ${mousePosition.x}% ${mousePosition.y}%, rgba(137,55,230,0.3) 0%, rgba(0,105,204,0.25) 35%, transparent 65%)`,
        }}
      />

      {/* Ambient pulse overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(137,55,230,0.1)_0%,_transparent_50%)] animate-pulse" />

      <div className="relative z-10 space-y-8">
        {/* Loading ASCII Animation */}
        <div className="mx-auto transform transition-all duration-300 hover:scale-[1.02]">
          <pre className="text-sm leading-tight text-[#8937E6] drop-shadow-[0_0_10px_rgba(137,55,230,0.6)] transition-all duration-300 hover:brightness-110 md:text-base lg:text-lg selection:bg-[#8937E6]/10 whitespace-pre">
            {pcFrames[currentFrame]}
          </pre>
        </div>

        {/* Main title */}
        <div className="space-y-4">
          <h1 className="animate-fade-in bg-gradient-to-r from-[#F7F7F7] via-[#8937E6] to-[#0069CC] bg-clip-text text-4xl font-medium tracking-tight text-transparent transition-all duration-300 hover:tracking-normal md:text-6xl">
            thera | Software House
          </h1>

          {/* Animated underline */}
          <div className="mx-auto h-[2px] w-0 animate-expand-width bg-gradient-to-r from-[#8937E6] to-[#0069CC] transition-all duration-1000" />
        </div>
      </div>
    </div>
  );
}