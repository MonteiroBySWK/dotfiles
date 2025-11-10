import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

export const useGSAP = () => {
  const ctx = useRef<gsap.Context | null>(null);

  useEffect(() => {
    ctx.current = gsap.context(() => {});
    
    return () => ctx.current?.revert();
  }, []);

  return ctx.current;
};

// Animações pré-definidas
export const animations = {
  // Fade in suave
  fadeIn: (element: string | Element, delay = 0) => {
    return gsap.fromTo(element, 
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, delay, ease: "power2.out" }
    );
  },

  // Slide in da esquerda
  slideInLeft: (element: string | Element, delay = 0) => {
    return gsap.fromTo(element,
      { opacity: 0, x: -50 },
      { opacity: 1, x: 0, duration: 0.5, delay, ease: "power2.out" }
    );
  },

  // Slide in da direita
  slideInRight: (element: string | Element, delay = 0) => {
    return gsap.fromTo(element,
      { opacity: 0, x: 50 },
      { opacity: 1, x: 0, duration: 0.5, delay, ease: "power2.out" }
    );
  },

  // Scale in (bom para modais)
  scaleIn: (element: string | Element, delay = 0) => {
    return gsap.fromTo(element,
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 0.4, delay, ease: "back.out(1.7)" }
    );
  },

  // Stagger para listas (anima itens em sequência)
  staggerFadeIn: (elements: string | Element[], delay = 0) => {
    return gsap.fromTo(elements,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, delay, ease: "power2.out" }
    );
  },

  // Bounce para feedback visual
  bounce: (element: string | Element) => {
    return gsap.fromTo(element,
      { scale: 1 },
      { scale: 1.1, duration: 0.2, yoyo: true, repeat: 1, ease: "power2.inOut" }
    );
  },

  // Shake para erros
  shake: (element: string | Element) => {
    return gsap.fromTo(element,
      { x: 0 },
      { x: -10, duration: 0.1, yoyo: true, repeat: 5, ease: "power2.inOut" }
    );
  },

  // Pulse para loading
  pulse: (element: string | Element) => {
    return gsap.fromTo(element,
      { scale: 1, opacity: 1 },
      { scale: 1.05, opacity: 0.8, duration: 1, yoyo: true, repeat: -1, ease: "power2.inOut" }
    );
  },

  // Fade out
  fadeOut: (element: string | Element, delay = 0) => {
    return gsap.to(element, { opacity: 0, y: -20, duration: 0.3, delay, ease: "power2.in" });
  }
};

export default useGSAP;