"use client";

import { useEffect, useRef } from 'react';

// Lista de caracteres ASCII em ordem de densidade de luz
const ASCII_CHARS = ['@', '#', '%', '+', '*', ':', '-', '.', ' '];

export default function AsciiAnimation() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Configurar canvas para ocupar toda a tela
    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    // Ouvir redimensionamento de janela
    window.addEventListener('resize', updateCanvasSize);
    updateCanvasSize();
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Definir o tamanho das células ASCII
    const cellSize = 10;
    const cols = Math.floor(canvas.width / cellSize);
    const rows = Math.floor(canvas.height / cellSize);
    
    // Configurar fonte
    ctx.font = `${cellSize}px monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Matriz para armazenar os caracteres
    const matrix: string[][] = Array(rows).fill(0).map(() => 
      Array(cols).fill(0).map(() => ' ')
    );
    
    // Loop de animação
    let frameCount = 0;
    
    const animate = () => {
      // Limpar o canvas
      ctx.fillStyle = '#030014';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      frameCount++;
      
      // Atualizar e desenhar a matriz de caracteres
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          // Criar efeito de onda baseado no tempo e posição
          const time = frameCount * 0.03;
          const wave1 = Math.sin(x * 0.1 + time) * 3;
          const wave2 = Math.cos(y * 0.1 + time * 0.5) * 3;
          const wave = wave1 + wave2;
          
          // Determinar densidade baseada na onda
          const normalizedWave = (wave + 6) / 12; // Normaliza para 0-1
          const charIndex = Math.floor(normalizedWave * (ASCII_CHARS.length - 1));
          matrix[y][x] = ASCII_CHARS[charIndex];
          
          // Posição do caractere
          const posX = x * cellSize + cellSize / 2;
          const posY = y * cellSize + cellSize / 2;
          
          // Cor baseada na posição para efeito gradiente
          const hue = (x / cols * 60) + 240; // 240-300: tons de roxo para azul
          const lightness = 50 + normalizedWave * 30;
          ctx.fillStyle = `hsl(${hue}, 70%, ${lightness}%)`;
          
          // Desenhar o caractere
          ctx.fillText(matrix[y][x], posX, posY);
        }
      }
      
      requestAnimationFrame(animate);
    };
    
    const animationId = requestAnimationFrame(animate);
    
    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      cancelAnimationFrame(animationId);
    };
  }, []);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 -z-10"
      style={{ opacity: 0.7 }}
    />
  );
}