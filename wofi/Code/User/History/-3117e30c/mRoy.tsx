'use client';

import { useEffect, useState, useRef } from 'react';

const CATEGORIES = ['Software House', 'Academic', 'Art Studio', 'Laboratory'];

export default function HeroTitle() {
  const [mounted, setMounted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const currentRef = useRef<HTMLSpanElement>(null);
  const nextRef = useRef<HTMLSpanElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Atualiza a largura do container baseado no texto atual e próximo
  useEffect(() => {
    if (currentRef.current) {
      setContainerWidth(currentRef.current.offsetWidth);
    }
  }, [currentIndex]);

  useEffect(() => {
    const interval = setInterval(() => {
      const next = (currentIndex + 1) % CATEGORIES.length;
      setNextIndex(next);
      setIsAnimating(true);
      
      // Calcula a largura do próximo elemento antes de animar
      setTimeout(() => {
        if (nextRef.current) {
          setContainerWidth(nextRef.current.offsetWidth);
        }
      }, 50);
      
      setTimeout(() => {
        setCurrentIndex(next);
        setIsAnimating(false);
      }, 500);
    }, 3000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center pointer-events-none px-4">
      <div
        className={`text-center transition-alcolor-secondaryl duration-1000 ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <h1 className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 transition-all duration-700 ease-in-out">
          {/* "Thera" - Geist Mono com letter-spacing aumentado */}
          <span
            className="font-mono text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold bg-clip-text text-transparent"
            style={{
              backgroundImage: 'linear-gradient(90deg, var(--color-primary), var(--color-secondary))',
              letterSpacing: '0.15em',
              textShadow: '0 0 40px rgba(137, 55, 230, 0.3), 0 0 80px rgba(0, 105, 204, 0.2)',
            }}
          >
            thera
          </span>

          {/* Separator */}
          <span 
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light"
            style={{
              color: 'var(--color-primary)',
              textShadow: '0 0 20px rgba(0, 105, 204, 0.5)',
            }}
          >
            |
          </span>

          {/* Wrapper com transição de largura suave baseada no conteúdo */}
          <span
            className="inline-flex items-center justify-center overflow-visible relative"
            style={{
              width: containerWidth > 0 ? `${containerWidth}px` : 'auto',
              transition: 'width 700ms cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            {/* Elemento invisível para calcular a largura do próximo texto */}
            <span
              ref={nextRef}
              className="font-sans text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light whitespace-nowrap absolute opacity-0 pointer-events-none"
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
              className="font-sans text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light whitespace-nowrap"
              style={{
                color: 'var(--color-text)',
                letterSpacing: '0.02em',
                textShadow: '0 0 30px rgba(247, 247, 247, 0.2)',
                opacity: isAnimating ? 0 : 1,
                transform: isAnimating ? 'translateY(-20px) scale(0.95)' : 'translateY(0) scale(1)',
                transition: 'opacity 500ms cubic-bezier(0.4, 0, 0.2, 1), transform 500ms cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              {CATEGORIES[currentIndex]}
            </span>
          </span>
        </h1>

        {/* Subtle tagline ou efeito adicional */}
        <div
          className={`mt-8 transition-all duration-1000 delay-300 ${
            mounted ? 'opacity-100 translate-y-2' : 'opacity-0 translate-y-4'
          }`}
        >
          <p
            className="font-mono text-sm sm:text-base tracking-widest"
            style={{
              color: 'var(--color-secondary)',
              letterSpacing: '0.2em',
            }}
          >
            {'<'}Tornando Ideias em Realidade {'/>'}
          </p>
        </div>
      </div>
    </div>
  );
}
