"use client";

import { useEffect, useRef } from 'react';

// Lista de caracteres ASCII em ordem de densidade para representar diferentes níveis de brilho
const ASCII_CHARS = ['@', '#', '%', '+', '*', ':', '-', '.', ' '];

export default function AsciiAnimation() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  // Removemos o containerRef e useState para simplificar
  
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Inicialização
    const handleResize = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        setDimensions({
          width: clientWidth,
          height: clientHeight
        });
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || dimensions.width === 0 || dimensions.height === 0) return;
    
    // Configurar o canvas
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Tamanho da célula ASCII
    const cellSize = 12;
    const cols = Math.floor(dimensions.width / cellSize);
    const rows = Math.floor(dimensions.height / cellSize);
    
    // Configuração do caractere
    ctx.font = `${cellSize}px monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Inicializar a matriz para rastrear o estado atual
    const matrix: string[][] = [];
    for (let i = 0; i < rows; i++) {
      matrix[i] = [];
      for (let j = 0; j < cols; j++) {
        matrix[i][j] = ASCII_CHARS[Math.floor(Math.random() * ASCII_CHARS.length)];
      }
    }

    // Função para desenhar a matriz ASCII
    const drawMatrix = () => {
      ctx.fillStyle = '#030014';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          // Calcular posição
          const x = j * cellSize + cellSize / 2;
          const y = i * cellSize + cellSize / 2;
          
          // Desenhar caractere
          const char = matrix[i][j];
          
          // Determinar a cor baseada em um gradiente
          const hue = (j / cols * 120) + 240; // 240 a 360 = tons de roxo ao azul
          const lightness = 50 + Math.sin((i + j + animationFrame) * 0.05) * 20;
          ctx.fillStyle = `hsl(${hue}, 70%, ${lightness}%)`;
          
          ctx.fillText(char, x, y);
        }
      }
    };
    
    // Função de atualização para animar a matriz
    let animationFrame = 0;
    const updateMatrix = () => {
      animationFrame++;
      
      // Para cada célula, ocasionalmente mude o caractere
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          // Atualizar caracteres aleatoriamente com diferentes probabilidades
          if (Math.random() < 0.02) {
            matrix[i][j] = ASCII_CHARS[Math.floor(Math.random() * ASCII_CHARS.length)];
          }
        }
      }

      // Animação de onda
      for (let j = 0; j < cols; j++) {
        // Ondulação vertical - movendo do centro para fora
        const centerRow = Math.floor(rows / 2);
        const waveAmplitude = Math.floor(rows / 4);
        const wavePosition = Math.sin(j * 0.2 + animationFrame * 0.03) * waveAmplitude + centerRow;
        const waveRow = Math.floor(wavePosition);
        
        if (waveRow >= 0 && waveRow < rows) {
          // Marque a célula na onda com um caractere específico
          matrix[waveRow][j] = '@';
          
          // E células próximas com caracteres de densidade média
          if (waveRow > 0) matrix[waveRow - 1][j] = '#';
          if (waveRow < rows - 1) matrix[waveRow + 1][j] = '%';
          
          // Células mais afastadas recebem caracteres de menor densidade
          if (waveRow > 1) matrix[waveRow - 2][j] = '*';
          if (waveRow < rows - 2) matrix[waveRow + 2][j] = '+';
        }
      }
    };
    
    // Loop de animação
    let animationId: number;
    
    const animate = () => {
      updateMatrix();
      drawMatrix();
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [dimensions]);
  
  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 -z-10 overflow-hidden"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ opacity: 0.6 }}
      />
    </div>
  );
}