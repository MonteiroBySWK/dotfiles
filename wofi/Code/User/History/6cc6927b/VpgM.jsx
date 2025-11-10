'use client';

import React, { useEffect, useState } from 'react';

export default function HeroTitle() {
  const [mounted, setMounted] = useState(false);

  // Usar useEffect para garantir que o componente só é renderizado no cliente
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="hero-title-container">
      <h1 className="text-center">
        <span className="hero-title text-4xl md:text-6xl lg:text-7xl tracking-widest text-foreground mb-2 block">
          THERA
        </span>
        <span className="hero-subtitle text-xl md:text-2xl lg:text-3xl text-foreground/90 mt-2 block">
          <span className="opacity-80 mr-2">|</span> Software House
        </span>
      </h1>
    </div>
  );
}