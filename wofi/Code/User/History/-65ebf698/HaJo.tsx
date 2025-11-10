"use client";

import { useEffect, useState } from 'react';

export default function SimpleTerminal() {
  const [textVisible, setTextVisible] = useState(false);
  const [cursor, setCursor] = useState(true);
  
  useEffect(() => {
    // Simular digitação após um pequeno atraso
    const timer = setTimeout(() => {
      setTextVisible(true);
    }, 2000);
    
    // Piscar o cursor
    const cursorInterval = setInterval(() => {
      setCursor(prev => !prev);
    }, 500);
    
    return () => {
      clearTimeout(timer);
      clearInterval(cursorInterval);
    };
  }, []);
  
  return (
    <div className="relative w-full max-w-3xl mx-auto p-6 bg-[#030014]/50 rounded-xl border border-[#8937E6]/20 backdrop-blur-md">
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-1.5">
          <div className="h-3 w-3 rounded-full bg-[#FF5F57] shadow-inner ring-1 ring-black/10"></div>
          <div className="h-3 w-3 rounded-full bg-[#FFBD2E] shadow-inner ring-1 ring-black/10"></div>
          <div className="h-3 w-3 rounded-full bg-[#28CA42] shadow-inner ring-1 ring-black/10"></div>
        </div>
        <div className="text-xs text-[#F7F7F7]/50">thera@hyperdrive ~ %</div>
      </div>
      
      <div className="font-mono text-lg md:text-xl text-[#00FFBB] mb-3">
        <div className="flex items-center">
          <span className="text-[#8937E6]">thera@hyperdrive</span>
          <span className="text-[#F7F7F7]">:</span>
          <span className="text-[#0069CC]">~</span>
          <span className="text-[#F7F7F7]">$ </span>
          <span>echo $MESSAGE</span>
        </div>
        
        {textVisible && (
          <div className="mt-2 transition-all duration-1000 ease-in-out">
            <p className="typewriter-text text-[#00FFBB]">
              Obrigado pela visita à Thera Software House.
            </p>
            <p className="typewriter-text animation-delay-1000 text-[#00FFBB]">
              Desenvolvemos soluções tecnológicas de alto impacto.
            </p>
            <p className="typewriter-text animation-delay-2000 text-[#00FFBB]">
              Até logo!
            </p>
          </div>
        )}
        
        <div className="mt-4 flex items-center">
          <span className="text-[#8937E6]">thera@hyperdrive</span>
          <span className="text-[#F7F7F7]">:</span>
          <span className="text-[#0069CC]">~</span>
          <span className="text-[#F7F7F7]">$ </span>
          {cursor && <span className="inline-block w-3 h-5 bg-[#00FFBB] animate-pulse"></span>}
        </div>
      </div>
    </div>
  );
}