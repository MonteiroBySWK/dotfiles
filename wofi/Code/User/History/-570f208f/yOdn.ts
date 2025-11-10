import { useState, useEffect } from 'react';

const MOBILE_BREAKPOINT = 768; // Ponto de quebra comum (tablets em modo retrato)

export const useResponsive = () => {
  // Inicializamos com 'false' para evitar problemas com renderização no servidor (SSR)
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Esta função só será executada no cliente, onde 'window' existe.
    const handleResize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    // Define o estado inicial assim que o componente é montado no cliente
    handleResize();

    // Adiciona um listener para continuar verificando se a tela for redimensionada
    window.addEventListener('resize', handleResize);

    // Função de limpeza: remove o listener quando o componente for desmontado
    // para evitar vazamentos de memória.
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); // O array vazio assegura que o efeito rode apenas uma vez (na montagem)

  return { isMobile };
};