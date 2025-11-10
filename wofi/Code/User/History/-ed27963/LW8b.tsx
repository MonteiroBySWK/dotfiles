'use client';

import { useEffect, useState } from 'react';
import AsciiBackground from '@/components/ascii-background';
import HeroTitle from '@/components/hero-title';

export default function Home() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Espera um momento antes de mostrar o conteúdo
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      style={{
        opacity: isReady ? 1 : 0,
        transition: 'opacity 1500ms ease-out',
      }}
    >
      <AsciiBackground />
      <HeroTitle />
    </div>
  );
}
