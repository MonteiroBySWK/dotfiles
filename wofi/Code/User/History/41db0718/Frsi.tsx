"use client";

import { useEffect, useState } from 'react';

interface MouseTrackingBackgroundProps {
  className?: string;
}

export default function MouseTrackingBackground({ className }: MouseTrackingBackgroundProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Handle mouse movement for subtle gradient effect
  useEffect(() => {
    // Debounce function to limit updates and prevent infinite loop
    let timeoutId: NodeJS.Timeout | null = null;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      
      timeoutId = setTimeout(() => {
        setMousePosition({
          x: (e.clientX / window.innerWidth) * 100,
          y: (e.clientY / window.innerHeight) * 100,
        });
      }, 50); // Only update every 50ms
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

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