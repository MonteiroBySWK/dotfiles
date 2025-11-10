'use client';

import { useEffect, useState } from 'react';

const CATEGORIES = ['Software House', 'Academic', 'Creative Studio', 'Laboratory'];

export default function HeroTitle() {
  const [mounted, setMounted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % CATEGORIES.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center pointer-events-none px-4">
      <div
        className={`text-center transition-all duration-1000 ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        {/* Título principal lado a lado */}
        <h1 className="flex items-baseline justify-center gap-3 sm:gap-4 md:gap-5 lg:gap-6">
          {/* "Thera" - sempre visível */}
          <span
            className="font-mono text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold shrink-0"
            style={{
              color: 'var(--color-primary)',
              letterSpacing: '0.1em',
              textShadow: '0 0 30px rgba(137, 55, 230, 0.4)',
            }}
          >
            thera
          </span>

          {/* Separador */}
          <span 
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light opacity-50"
            style={{
              color: 'var(--color-primary)',
            }}
          >
            /
          </span>

          {/* Categoria animada - com fade simples */}
          <span
            className="font-sans text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light relative inline-block min-w-[180px] sm:min-w-[220px] md:min-w-[280px] lg:min-w-[340px]"
          >
            {CATEGORIES.map((category, index) => (
              <span
                key={category}
                className="absolute left-0 top-0 w-full transition-all duration-700 ease-in-out whitespace-nowrap"
                style={{
                  color: 'var(--color-text)',
                  letterSpacing: '0.02em',
                  textShadow: '0 0 20px rgba(247, 247, 247, 0.3)',
                  opacity: currentIndex === index ? 1 : 0,
                  transform: currentIndex === index 
                    ? 'translateY(0) scale(1)' 
                    : 'translateY(15px) scale(0.95)',
                }}
              >
                {category}
              </span>
            ))}
          </span>
        </h1>

        {/* Tagline */}
        <div
          className={`mt-6 sm:mt-8 md:mt-10 transition-all duration-1000 delay-300 ${
            mounted ? 'opacity-70 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <p
            className="font-mono text-[10px] sm:text-xs md:text-sm tracking-widest"
            style={{
              color: 'var(--color-primary)',
              letterSpacing: '0.12em',
            }}
          >
            {'<'}TORNANDO IDEIAS EM REALIDADE{'/>'}
          </p>
        </div>
      </div>
    </div>
  );
}
