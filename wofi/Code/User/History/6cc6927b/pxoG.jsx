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
        // Pequeno atraso para garantir que a cena 3D comece a carregar primeiro
        setTimeout(() => {
          // Iniciar fade-in do container
          setOpacity(1);
          
          // Variação de velocidade para dar sensação mais natural na digitação
          const typingSpeeds = [220, 180, 150, 210, 170];
          
          // Iniciar animação de digitação após um pequeno atraso
          let index = 0;
          let typingInterval;
          
          // Função para simular digitação com velocidade variável
          const typeNextChar = () => {
            if (index < fullText.length) {
              setVisibleText(fullText.substring(0, index + 1));
              index++;
              
              // Variação sutil na velocidade de digitação para efeito mais natural
              const currentSpeed = typingSpeeds[index % typingSpeeds.length];
              
              setTimeout(typeNextChar, currentSpeed);
            } else {
              // Mostrar subtítulo após terminar a digitação
              setTimeout(() => {
                setShowSubtitle(true);
                
                // Marcar todas as animações como concluídas
                setTimeout(() => {
                  setAnimationComplete(true);
                }, 600);
              }, 400);
            }
          };
          
          // Iniciar a animação de digitação
          setTimeout(typeNextChar, 220);
        }, 300); // atraso inicial para sincronizar com o carregamento do background
      });
    }
  }, [mounted, fullText]);

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
          className="hero-title text-4xl md:text-6xl lg:text-7xl tracking-[0.2em] text-foreground mb-2"
          style={{
            textShadow: animationComplete ? "0 0 15px rgba(137, 55, 230, 0.6)" : "0 0 10px rgba(137, 55, 230, 0.3)",
            fontFeatureSettings: '"calt" 1, "liga" 1', // Otimizações de renderização de fonte
            transition: "text-shadow 0.5s ease",
            position: "relative",
            display: "inline-block",
            background: "var(--primary-gradient)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
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
            className="hero-subtitle text-xl md:text-2xl lg:text-3xl text-foreground/90 mt-3 tracking-normal"
            style={{
              fontFeatureSettings: '"calt" 1, "kern" 1', // Otimizações de renderização de fonte
              opacity: showSubtitle ? 1 : 0,
              transform: showSubtitle ? "translateY(0)" : "translateY(10px)",
              transition: "opacity 0.6s ease, transform 0.6s ease",
              fontWeight: "400",
              letterSpacing: "normal",
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
          0%, 100% { 
            text-shadow: 0 0 15px rgba(137, 55, 230, 0.3);
            filter: brightness(1);
          }
          50% { 
            text-shadow: 0 0 25px rgba(137, 55, 230, 0.7);
            filter: brightness(1.1);
          }
        }
        
        @keyframes gradientFlow {
          0% { background-position: 0% 50% }
          50% { background-position: 100% 50% }
          100% { background-position: 0% 50% }
        }
        
        .hero-title {
          animation: pulse 3s infinite ease-in-out, gradientFlow 8s ease infinite;
          background-size: 200% 200%;
        }
      `}</style>
    </div>
  );
});

export default HeroTitle;