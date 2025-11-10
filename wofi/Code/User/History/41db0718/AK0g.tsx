"use client";

import { useMousePosition } from '@/hooks/useMousePosition';

interface MouseTrackingBackgroundProps {
  className?: string;
}

export default function MouseTrackingBackground({ className }: MouseTrackingBackgroundProps) {
  const mousePosition = useMousePosition(50);

  return (
    <>
      {/* Base gradient background */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#8937E6]/10 via-transparent to-[#0069CC]/10" />
      
      {/* Mouse reactive gradient */}
      <div
        className={`pointer-events-none absolute inset-0 opacity-20 transition-all duration-1000 ease-out ${className}`}
        style={{
          background: `radial-gradient(1200px 900px at ${mousePosition.x}% ${mousePosition.y}%, rgba(137,55,230,0.15) 0%, rgba(0,105,204,0.12) 20%, transparent 70%)`,
        }}
      />
    </>
  );
}