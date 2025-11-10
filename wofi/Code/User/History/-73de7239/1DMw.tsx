'use client';

import { useState, useEffect } from 'react';

export default function NavBarHero() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-[100dvw] ${
        isScrolled
          ? 'bg-black/80 backdrop-blur-md border-b border-white/10'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a
              href="/"
              className="text-xl md:text-2xl font-bold text-white hover:text-cyan-400 transition-colors"
            >
              thera
            </a>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#about"
              className="text-white/80 hover:text-white transition-colors text-sm font-medium"
            >
              Sobre
            </a>
            <a
              href="#services"
              className="text-white/80 hover:text-white transition-colors text-sm font-medium"
            >
              Serviços
            </a>
            <a
              href="#portfolio"
              className="text-white/80 hover:text-white transition-colors text-sm font-medium"
            >
              Portfólio
            </a>
            <a
              href="#contact"
              className="text-white/80 hover:text-white transition-colors text-sm font-medium"
            >
              Contato
            </a>
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <a
              href="#contact"
              className="px-6 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-full transition-all duration-300 text-sm font-medium shadow-lg hover:shadow-cyan-500/50"
            >
              Começar
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white p-2"
            aria-label="Menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}