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

  useEffect(() => {
    if (mounted) {
      document.fonts.ready.then(() => {
        setTimeout(() => {
          setOpacity(1);
          
          const typingSpeeds = [220, 180, 150, 210, 170];
          
          let index = 0;
          
          const typeNextChar = () => {
            if (index < fullText.length) {
              setVisibleText(fullText.substring(0, index + 1));
              index++;
              
              const currentSpeed = typingSpeeds[index % typingSpeeds.length];
              
              setTimeout(typeNextChar, currentSpeed);
            } else {
              setTimeout(() => {
                setShowSubtitle(true);
                
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
      <h1 className="text-center flex flex-col items-center justify-center">
        <span
          className="hero-title text-6xl md:text-7xl lg:text-8xl tracking-[0.3em] mb-4 block"
          style={{
            fontFamily: "var(--font-mono)",
            textShadow: animationComplete ? "0 0 20px rgba(137, 55, 230, 0.5)" : "0 0 10px rgba(137, 55, 230, 0.3)",
            transition: "text-shadow 0.5s ease",
            position: "relative",
            color: "#F7F7F7",
            fontWeight: "bold",
            textTransform: "uppercase",
          }}
        >
          {visibleText}
          <span 
            style={{ 
              opacity: visibleText.length < fullText.length ? 1 : 0,
              animation: "blink 1s infinite",
              marginLeft: "0.15em",
              fontWeight: "lighter",
            }}
          >
            |
          </span>
        </span>
        
        {showSubtitle && (
          <span
            className="hero-subtitle text-2xl md:text-3xl lg:text-4xl block"
            style={{
              fontFamily: "var(--font-sans)",
              opacity: showSubtitle ? 1 : 0,
              transform: showSubtitle ? "translateY(0)" : "translateY(10px)",
              transition: "opacity 0.6s ease, transform 0.6s ease",
              fontWeight: "300",
              letterSpacing: "0.05em",
              color: "rgba(247, 247, 247, 0.9)",
            }}
          >
            <span className="opacity-60 mr-3">|</span> Software House
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
            text-shadow: 0 0 20px rgba(137, 55, 230, 0.4);
          }
          50% { 
            text-shadow: 0 0 30px rgba(137, 55, 230, 0.8), 0 0 40px rgba(137, 55, 230, 0.5);
          }
        }
        
        .hero-title {
          animation: pulse 4s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
});

export default HeroTitle;