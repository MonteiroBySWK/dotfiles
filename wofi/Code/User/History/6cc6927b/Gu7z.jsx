'use client';

import React, { useEffect, useState, memo } from 'react';

// Usando memo para prevenir renderizações desnecessárias
const HeroTitle = memo(function HeroTitle() {
  const [mounted, setMounted] = useState(false);
  
  // Usar useEffect para garantir que o componente só é renderizado no cliente
  useEffect(() => {
    setMounted(true);
  }, []);

  // Efeito para pre-carregar fontes (opcional)
  useEffect(() => {
    if (mounted) {
      // Precarregar fontes para melhor desempenho visual
      document.fonts.ready.then(() => {
        // Fontes estão carregadas, poderia adicionar uma animação suave se necessário
      });
    }
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div className="hero-title-container select-none pointer-events-none">
      <h1 className="text-center">
        <span 
          className="hero-title text-4xl md:text-6xl lg:text-7xl tracking-widest text-foreground mb-2 block"
          style={{ 
            textShadow: '0 0 15px rgba(137, 55, 230, 0.3)',
            fontFeatureSettings: '"calt" 1, "liga" 1',  // Otimizações de renderização de fonte
          }}
        >
          THERA
        </span>
        <span 
          className="hero-subtitle text-xl md:text-2xl lg:text-3xl text-foreground/90 mt-2 block"
          style={{ 
            fontFeatureSettings: '"calt" 1, "kern" 1',  // Otimizações de renderização de fonte
          }}
        >
          <span className="opacity-80 mr-2">|</span> Software House
        </span>
      </h1>
    </div>
  );
});

export default HeroTitle;