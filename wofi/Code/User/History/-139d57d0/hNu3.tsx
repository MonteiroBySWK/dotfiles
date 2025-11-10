'use client';

import { useEffect, useState } from 'react';

export default function NotFound() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-6 text-center font-mono">
      {/* Interactive gradient that follows mouse */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40 transition-all duration-300 ease-out"
        style={{
          background: `radial-gradient(600px 400px at ${mousePosition.x}% ${mousePosition.y}%, rgba(137,55,230,0.3) 0%, rgba(0,105,204,0.2) 40%, transparent 70%)`,
        }}
      />
      
      {/* Ambient light effect */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(137,55,230,0.05)_0%,_transparent_50%)] animate-pulse" />

      <div className="relative z-10 space-y-8">
        {/* Main title with gradient */}
        <div className="space-y-4">
          <h1 className="animate-fade-in bg-gradient-to-r from-[#F7F7F7] via-[#8937E6] to-[#0069CC] bg-clip-text text-4xl font-medium tracking-tight text-transparent transition-all duration-500 hover:tracking-wide md:text-6xl">
            em breve voltaremos
          </h1>
          
          {/* Animated underline */}
          <div className="mx-auto h-[2px] w-0 animate-expand-width bg-gradient-to-r from-[#8937E6] to-[#0069CC] transition-all duration-1000" />
        </div>

        {/* 404 indicator */}
        <div className="flex items-center justify-center space-x-2 text-xs text-[#F7F7F7]/60">
          <div className="h-2 w-2 animate-pulse rounded-full bg-[#8937E6]" />
          <span>Página não encontrada</span>
          <div className="h-2 w-2 animate-pulse rounded-full bg-[#0069CC]" />
        </div>
      </div>
    </div>
  );
}