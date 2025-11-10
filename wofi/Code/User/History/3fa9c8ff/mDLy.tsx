"use client";

import { useEffect, useRef } from 'react';

export default function SimpleAsciiBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Ajustar o tamanho do canvas para preencher toda a tela
    const handleResize = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Lista de caracteres ASCII em ordem de densidade
    const chars = ['.', ',', '-', '~', ':', ';', '=', '!', '*', '#', '$', '@'];
    
    // Tamanho da célula para caracteres ASCII
    const cellSize = 12;
    const cols = Math.ceil(canvas.width / cellSize);
    const rows = Math.ceil(canvas.height / cellSize);
    
    // Configuração do texto
    ctx.font = `${cellSize}px Courier, monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Loop de animação
    let frame = 0;
    
    function draw() {
      if (!ctx || !canvas) return;
      
      frame++;
      
      // Limpar o canvas com uma cor de fundo escura
      ctx.fillStyle = '#030014';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Desenhar caracteres ASCII
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          // Calcular a posição no centro de cada célula
          const x = i * cellSize + cellSize / 2;
          const y = j * cellSize + cellSize / 2;
          
          // Função de onda para criar padrão
          const angle = (i * 0.2) + (j * 0.3) + (frame * 0.01);
          const wave = Math.sin(angle) * 3.0;
          
          // Selecionar um caractere baseado na onda
          const charIndex = Math.floor((wave + 3) / 6 * (chars.length - 1));
          const char = chars[charIndex];
          
          // Cor variando entre roxo e azul
          const hue = ((i / cols) * 60) + 240; // 240-300 (roxo ao azul)
          const lightness = 60 + Math.sin(angle * 2) * 15; // Variação de luminosidade
          ctx.fillStyle = `hsl(${hue}, 80%, ${lightness}%)`;
          
          // Desenhar o caractere
          ctx.fillText(char, x, y);
        }
      }
      
      requestAnimationFrame(draw);
    }
    
    // Iniciar a animação
    const animationId = requestAnimationFrame(draw);
    
    // Limpeza
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return (
    <canvas 
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10"
    />
  );
}