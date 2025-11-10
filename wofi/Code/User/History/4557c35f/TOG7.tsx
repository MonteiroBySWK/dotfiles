"use client";

import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  alpha: number;
  decay: number;
}

export default function ParticleEffect() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, active: false });
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Configurações das partículas
    const particleColors = ['#8937E6', '#0069CC', '#00FFBB', '#F7F7F7'];
    const maxParticles = 100;
    const particleDecay = 0.01; // Taxa de desvanecimento
    
    // Inicialmente preencha o array com algumas partículas
    for (let i = 0; i < 20; i++) {
      createParticle(
        Math.random() * window.innerWidth,
        Math.random() * window.innerHeight
      );
    }
    
    // Função para criar uma nova partícula
    function createParticle(x: number, y: number) {
      const randomColor = particleColors[Math.floor(Math.random() * particleColors.length)];
      
      const particle: Particle = {
        x,
        y,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 1,
        speedY: (Math.random() - 0.5) * 1,
        color: randomColor,
        alpha: Math.random() * 0.5 + 0.2,
        decay: Math.random() * particleDecay + particleDecay / 2,
      };
      
      particlesRef.current.push(particle);
      
      // Limite o número máximo de partículas
      if (particlesRef.current.length > maxParticles) {
        particlesRef.current.shift();
      }
    }
    
    // Redimensionar o canvas
    function resizeCanvas() {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    }
    
    // Manipuladores de eventos do mouse
    function handleMouseMove(e: MouseEvent) {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      
      // Crie partículas quando o mouse estiver ativo
      if (mouseRef.current.active) {
        createParticle(e.clientX, e.clientY);
      }
    }
    
    function handleMouseDown() {
      mouseRef.current.active = true;
      // Criar um conjunto de partículas ao clicar
      for (let i = 0; i < 10; i++) {
        createParticle(
          mouseRef.current.x, 
          mouseRef.current.y
        );
      }
    }
    
    function handleMouseUp() {
      mouseRef.current.active = false;
    }
    
    // Inicializar o canvas e adicionar listeners de eventos
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    
    // Loop de animação
    let animationId: number;
    
    function animate() {
      if (ctx && canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Atualizar e desenhar as partículas
      particlesRef.current.forEach((particle, index) => {
        // Mover partícula
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Desvanecimento
        particle.alpha -= particle.decay;
        
        // Remover partículas desvanecidas
        if (particle.alpha <= 0) {
          particlesRef.current.splice(index, 1);
          return;
        }
        
        // Desenhar partícula
        ctx.save();
        ctx.globalAlpha = particle.alpha;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        
        // Conectar partículas próximas
        connectParticles(particle, index);
      });
      
      // Adicionar partículas aleatórias ocasionalmente
      if (Math.random() < 0.03 && particlesRef.current.length < maxParticles) {
        createParticle(
          Math.random() * window.innerWidth,
          Math.random() * window.innerHeight
        );
      }
      
      animationId = requestAnimationFrame(animate);
    }
    
    // Função para conectar partículas próximas
    function connectParticles(p1: Particle, index: number) {
      const maxDistance = 150;
      
      for (let i = index + 1; i < particlesRef.current.length; i++) {
        const p2 = particlesRef.current[i];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < maxDistance) {
          // Calcular opacidade baseada na distância
          const opacity = (1 - distance / maxDistance) * 0.2 * Math.min(p1.alpha, p2.alpha);
          
          ctx.save();
          ctx.globalAlpha = opacity;
          ctx.strokeStyle = p1.color;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
          ctx.restore();
        }
      }
    }
    
    // Iniciar animação
    animate();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      cancelAnimationFrame(animationId);
    };
  }, []);
  
  return (
    <canvas 
      ref={canvasRef}
      className="absolute inset-0 z-0 opacity-50"
    />
  );
}