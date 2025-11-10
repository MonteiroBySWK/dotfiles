"use client";

import { useState, useEffect } from 'react';

/**
 * Hook to track mouse position with debounce to avoid excessive rerenders
 * @param debounceTime Time in ms to debounce mouse movement updates
 * @returns Current mouse position as percentage of screen dimensions {x, y}
 */
export function useMousePosition(debounceTime: number = 50) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
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
      }, debounceTime);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [debounceTime]);

  return mousePosition;
}