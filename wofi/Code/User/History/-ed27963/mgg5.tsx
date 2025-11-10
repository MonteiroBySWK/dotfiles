'use client';

import dynamic from 'next/dynamic';

// Importar os componentes com carregamento dinâmico para evitar problemas de SSR com Three.js
const AsciiBackground = dynamic(() => import('../components/AsciiBackground'), {
  loading: () => <div className="ascii-background" style={{ backgroundColor: 'var(--background)' }}></div>
});

const HeroTitle = dynamic(() => import('../components/HeroTitle'), {
  loading: () => <div className="hero-title-container"></div>
});

export default function Home() {
  return (
    <div className="min-h-screen overflow-hidden">
      <AsciiBackground />
      <HeroTitle />
    </div>
  );
}
