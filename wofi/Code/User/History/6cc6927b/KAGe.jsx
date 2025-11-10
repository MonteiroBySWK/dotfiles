"use client";

import React, { useEffect, useState, memo } from "react";

// Usando memo para prevenir renderizações desnecessárias
const HeroTitle = memo(function HeroTitle() {
  const [mounted, setMounted] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [visibleText, setVisibleText] = useState("");
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [opacity, setOpacity] = useState(0);
  
  const fullText = "thera";

  // Usar useEffect para garantir que o componente só é renderizado no cliente
  useEffect(() => {
    setMounted(true);
  }, []);

  // Efeito para pre-carregar fontes e iniciar animações
  useEffect(() => {
    if (mounted) {
      // Precarregar fontes para melhor desempenho visual
      document.fonts.ready.then(() => {
        // Iniciar fade-in do container
        setOpacity(1);
        
        // Iniciar animação de digitação após um pequeno atraso
        let index = 0;
        const typingInterval = setInterval(() => {
          setVisibleText(fullText.substring(0, index + 1));
          index++;
          
          if (index >= fullText.length) {
            clearInterval(typingInterval);
            
            // Mostrar subtítulo após terminar a digitação
            setTimeout(() => {
              setShowSubtitle(true);
              
              // Marcar todas as animações como concluídas
              setTimeout(() => {
                setAnimationComplete(true);
              }, 600);
            }, 400);
          }
        }, 180); // velocidade de digitação
      });
    }
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div 
      className="hero-title-container select-none pointer-events-none"
      style={{
        opacity: opacity,
        transition: "opacity 1s ease-in-out",
      }}
    >
      <h1 className="text-center">
        <span
          className="hero-title text-4xl md:text-6xl lg:text-7xl tracking-widest text-foreground mb-2"
          style={{
            textShadow: animationComplete ? "0 0 15px rgba(137, 55, 230, 0.6)" : "0 0 10px rgba(137, 55, 230, 0.3)",
            fontFeatureSettings: '"calt" 1, "liga" 1', // Otimizações de renderização de fonte
            transition: "text-shadow 0.5s ease",
            position: "relative",
            display: "inline-block",
          }}
        >
          {visibleText}
          <span 
            style={{ 
              opacity: visibleText.length < fullText.length ? 1 : 0,
              animation: "blink 1s infinite",
              marginLeft: "0.1em",
              fontWeight: "lighter",
              position: "absolute" 
            }}
          >
            |
          </span>
        </span>
        
        {showSubtitle && (
          <span
            className="hero-subtitle text-4xl md:text-6xl lg:text-7xl text-foreground/90 mt-2 text-pri"
            style={{
              fontFeatureSettings: '"calt" 1, "kern" 1', // Otimizações de renderização de fonte
              opacity: showSubtitle ? 1 : 0,
              transform: showSubtitle ? "translateY(0)" : "translateY(10px)",
              transition: "opacity 0.6s ease, transform 0.6s ease",
            }}
          >
            <span className="opacity-80 mr-2">|</span> Software House
          </span>
        )}
      </h1>
      
      <style jsx global>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        
        @keyframes pulse {
          0%, 100% { text-shadow: 0 0 15px rgba(137, 55, 230, 0.3); }
          50% { text-shadow: 0 0 25px rgba(137, 55, 230, 0.7); }
        }
        
        .hero-title {
          animation: pulse 3s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
});

export default HeroTitle;