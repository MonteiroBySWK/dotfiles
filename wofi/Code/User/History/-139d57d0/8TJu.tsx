'use client';

import Home from './page';

// A página not-found usa o mesmo conteúdo da página inicial
'use client';

import dynamic from 'next/dynamic';

// Importamos com nomes diferentes para evitar conflito
const AsciiBackgroundNotFound = dynamic(() => import('../components/AsciiBackground'), {
  loading: () => <div className="ascii-background" style={{ backgroundColor: 'var(--background)' }}></div>
});

const HeroTitleNotFound = dynamic(() => import('../components/HeroTitle'), {
  loading: () => <div className="hero-title-container"></div>
});

export default function NotFound() {
  return (
    <div className="min-h-screen overflow-hidden">
      <AsciiBackgroundNotFound />
      <HeroTitleNotFound />
    </div>
  );
}