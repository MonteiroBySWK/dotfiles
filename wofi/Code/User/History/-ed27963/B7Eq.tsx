"use client";

import ThreeJsAsciiBackground from '@/components/ThreeJS/ThreeJsAsciiBackground';
import SimpleTerminal from '@/components/Terminal/SimpleTerminal';
import FuturisticButton from '@/components/UI/FuturisticButton';
import MouseTrackingBackground from '@/components/Background/MouseTrackingBackground';
import BackgroundEffects from '@/components/Background/BackgroundEffects';
import ParticleEffect from '@/components/Background/ParticleEffect';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#030014] px-6 text-center font-mono">
      {/* Background effects */}
      <MouseTrackingBackground />
      <BackgroundEffects />
      <ThreeJsAsciiBackground />
      
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-20 flex justify-between items-center p-4 md:p-6">
        <div className="flex items-center">
          <span className="text-[#00FFBB] font-bold text-xl md:text-2xl">
            thera<span className="text-[#F7F7F7]">.dev</span>
          </span>
        </div>
        
        <nav className="hidden md:flex gap-6">
          <a href="#services" className="text-[#F7F7F7]/70 hover:text-[#00FFBB] transition-colors">Serviços</a>
          <a href="#about" className="text-[#F7F7F7]/70 hover:text-[#00FFBB] transition-colors">Sobre</a>
          <a href="#contact" className="text-[#F7F7F7]/70 hover:text-[#00FFBB] transition-colors">Contato</a>
        </nav>
        
        <FuturisticButton text="Contato" href="#contact" className="hidden md:block" />
      </header>

      <main className="relative z-10 flex flex-col items-center justify-center space-y-8 w-full max-w-7xl py-20">
        {/* Main title */}
        <div className="space-y-4 mb-10">
          <h1 className="animate-fade-in bg-gradient-to-r from-[#F7F7F7] via-[#8937E6] to-[#0069CC] bg-clip-text text-4xl font-medium tracking-tight text-transparent transition-all duration-300 hover:tracking-normal md:text-6xl">
            thera | Software House
          </h1>
          
          {/* Tagline */}
          <p className="text-[#F7F7F7]/70 text-lg md:text-xl max-w-2xl mx-auto">
            Transformando ideias em soluções tecnológicas de alto impacto
          </p>

          {/* Animated underline */}
          <div className="mx-auto h-[2px] w-0 animate-expand-width bg-gradient-to-r from-[#8937E6] to-[#0069CC] transition-all duration-1000" />
        </div>
        
        {/* Terminal component */}
        <SimpleTerminal />
        
        {/* Call to action buttons */}
        <div className="flex flex-col md:flex-row gap-4 mt-8">
          <FuturisticButton 
            text="Conheça nossos serviços" 
            href="#services" 
            className="text-lg"
          />
          <FuturisticButton 
            text="Entre em contato" 
            href="#contact" 
            className="text-lg"
          />
        </div>
        
        {/* Featured tech icons */}
        <div className="mt-16 pt-8 border-t border-[#F7F7F7]/10">
          <p className="text-[#F7F7F7]/50 mb-4 text-sm">TECNOLOGIAS QUE UTILIZAMOS</p>
          <div className="flex flex-wrap justify-center gap-8">
            {['React', 'NextJS', 'NodeJS', 'AWS', 'Docker'].map((tech) => (
              <div 
                key={tech} 
                className="flex items-center justify-center w-20 h-20 bg-[#0A0A0A]/50 
                            border border-[#8937E6]/10 rounded-lg backdrop-blur-sm
                            hover:border-[#8937E6]/30 transition-all duration-300"
              >
                <span className="text-[#F7F7F7]/90">{tech}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="w-full mt-auto py-6 border-t border-[#F7F7F7]/10 text-[#F7F7F7]/50 text-sm">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <div>
            &copy; {new Date().getFullYear()} Thera Software House. Todos os direitos reservados.
          </div>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-[#00FFBB] transition-colors">LinkedIn</a>
            <a href="#" className="hover:text-[#00FFBB] transition-colors">GitHub</a>
            <a href="#" className="hover:text-[#00FFBB] transition-colors">Twitter</a>
          </div>
        </div>
      </footer>
    </div>
  );
}