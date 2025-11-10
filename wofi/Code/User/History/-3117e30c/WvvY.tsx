'use client';

import { useEffect, useState, useRef } from 'react';

const CATEGORIES = ['Software House', 'Academic', 'Creative Studio', 'Laboratory'];

export default function HeroTitle() {
  const [mounted, setMounted] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const currentRef = useRef<HTMLSpanElement>(null);
  const nextRef = useRef<HTMLSpanElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [isMobile, setIsMobile] = useState(false);

  // Evitar hydration error
  useEffect(() => {
    setMounted(true);
    setIsMobile(window.innerWidth < 640);
    
    // Mostra as categorias após a transição (3.5s total: 2s loading + 1.5s transition)
    const categoryTimer = setTimeout(() => {
      setShowCategories(true);
    }, 3500);
    
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(categoryTimer);
    };
  }, []);

  // Atualiza a largura do container baseado no texto atual e próximo
  useEffect(() => {
    if (showCategories && currentRef.current) {
      setContainerWidth(currentRef.current.offsetWidth);
    }
  }, [currentIndex, showCategories]);

  useEffect(() => {
    if (!showCategories) return;
    
    const interval = setInterval(() => {
      const next = (currentIndex + 1) % CATEGORIES.length;
      setNextIndex(next);
      setIsAnimating(true);
      
      // Aguarda o texto atual desaparecer completamente antes de ajustar o width
      setTimeout(() => {
        if (nextRef.current) {
          setContainerWidth(nextRef.current.offsetWidth);
        }
      }, 400); // Espera a animação de saída completar
      
      // Troca o texto após o width ter ajustado
      setTimeout(() => {
        setCurrentIndex(next);
        setIsAnimating(false);
      }, 900); // 400ms saída + 500ms width
    }, 3000);

    return () => clearInterval(interval);
  }, [currentIndex, showCategories]);

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center pointer-events-none px-4">
      <div
        className={`text-center transition-alcolor-secondaryl duration-1000 ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <h1 className="flex flex-row items-center justify-center gap-2 sm:gap-4 transition-all duration-700 ease-in-out">
          {/* "Thera" - Geist Mono com letter-spacing aumentado */}
          <span
            className="font-mono text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold bg-clip-text text-transparent"
            style={{
              color: 'var(--color-primary)',
              letterSpacing: '0.15em',
              textShadow: isMobile ? 'none' : '0 0 40px rgba(137, 55, 230, 0.3), 0 0 80px rgba(0, 105, 204, 0.2)',
            }}
          >
            thera
          </span>

          {/* Container fixo para separator e categorias */}
          <div 
            className="flex flex-row items-center gap-2 sm:gap-4"
            style={{
              maxWidth: showCategories ? '1000px' : '0px',
              opacity: showCategories ? 1 : 0,
              overflow: 'hidden',
              transition: 'max-width 500ms cubic-bezier(0.4, 0, 0.2, 1), opacity 400ms cubic-bezier(0.4, 0, 0.2, 1) 100ms',
            }}
          >
            {/* Separator */}
            <span 
              className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-light whitespace-nowrap"
              style={{
                color: 'var(--color-primary)',
                textShadow: isMobile ? 'none' : '0 0 20px rgba(0, 105, 204, 0.5)',
              }}
            >
              |
            </span>

            {/* Wrapper com transição de largura suave baseada no conteúdo */}
            <span
              className="inline-flex items-center justify-center overflow-visible relative"
              style={{
                width: containerWidth > 0 ? `${containerWidth}px` : 'auto',
                transition: 'width 500ms cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              {/* Elemento invisível para calcular a largura do próximo texto */}
              <span
                ref={nextRef}
                className="font-sans text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-light whitespace-nowrap absolute opacity-0 pointer-events-none"
                style={{
                  letterSpacing: '0.02em',
                }}
                aria-hidden="true"
              >
                {CATEGORIES[nextIndex]}
              </span>

              {/* Texto atual visível */}
              <span
                ref={currentRef}
                className="font-sans text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-light whitespace-nowrap"
                style={{
                  color: 'var(--color-text)',
                  letterSpacing: '0.02em',
                  textShadow: isMobile ? 'none' : '0 0 30px rgba(247, 247, 247, 0.2)',
                  opacity: isAnimating ? 0 : 1,
                  transform: isAnimating ? 'translateY(-20px) scale(0.95)' : 'translateY(0) scale(1)',
                  transition: 'opacity 400ms cubic-bezier(0.4, 0, 0.2, 1), transform 400ms cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                {CATEGORIES[currentIndex]}
              </span>
            </span>
          </div>
        </h1>

        {/* Subtle tagline ou efeito adicional */}
        <div
          className={`mt-8 transition-all duration-1000 delay-300 ${
            mounted ? 'opacity-50 translate-y-2.5' : 'opacity-0 translate-y-6'
          }`}
        >
          <p
            className="font-mono text-sm sm:text-base tracking-widest"
            style={{
              color: 'var(--color-text)',
              letterSpacing: '0.1em',
            }}
          >
            {'<'}Tornando Ideias em Realidade {'/>'}
          </p>
        </div>
      </div>
    </div>
  );
}
