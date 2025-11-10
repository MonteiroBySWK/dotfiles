'use client';

import { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Componente ASCII personalizado com verificações de segurança
export function SafeAsciiEffect({ 
  resolution = 0.2, 
  characters = ' .:-+*=%@#', 
  fgColor = '#F7F7F7', 
  bgColor = '#212121', 
  invert = false 
}) {
  const { gl, scene, camera, size } = useThree();
  const rendererRef = useRef(null);
  
  useEffect(() => {
    // Criando um renderizador personalizado
    const renderer = {
      domElement: document.createElement('div'),
      inputCanvas: document.createElement('canvas'),
      outputCanvas: document.createElement('canvas'),
      ctx: null,
      outCtx: null,
      width: 0,
      height: 0,
      
      setSize: function(width, height) {
        // Garantir valores inteiros e positivos
        this.width = Math.max(4, Math.floor(width * resolution)) || 4;
        this.height = Math.max(4, Math.floor(height * resolution)) || 4;
        
        // Configurar canvas de entrada
        this.inputCanvas.width = width;
        this.inputCanvas.height = height;
        this.ctx = this.inputCanvas.getContext('2d');
        
        // Configurar canvas de saída (onde o ASCII é desenhado)
        this.outputCanvas.width = width;
        this.outputCanvas.height = height;
        this.outputCanvas.style.width = '100%';
        this.outputCanvas.style.height = '100%'; 
        this.outCtx = this.outputCanvas.getContext('2d');
        
        // Configurar o elemento DOM container
        this.domElement.style.position = 'absolute';
        this.domElement.style.top = '0';
        this.domElement.style.left = '0';
        this.domElement.style.width = '100%';
        this.domElement.style.height = '100%';
        this.domElement.style.color = fgColor;
        this.domElement.style.backgroundColor = bgColor;
        this.domElement.style.overflow = 'hidden';
        
        this.domElement.appendChild(this.outputCanvas);
        
        return this;
      },
      
      clear: function() {
        if (this.outCtx) {
          this.outCtx.fillStyle = bgColor;
          this.outCtx.fillRect(0, 0, this.outputCanvas.width, this.outputCanvas.height);
        }
        return this;
      },
      
      render: function(scene, camera) {
        try {
          // Renderizar a cena no canvas de entrada
          gl.render(scene, camera);
          
          // Copiar para o nosso canvas de entrada
          this.ctx.drawImage(gl.domElement, 0, 0);
          
          // Limpar o canvas de saída
          this.clear();
          
          // Processar a imagem com efeito ASCII
          this.processASCII();
          
        } catch (error) {
          console.error("Erro na renderização ASCII:", error);
        }
        
        return this;
      },
      
      processASCII: function() {
        if (!this.ctx || !this.outCtx) return;
        
        try {
          // Garantir que estamos usando valores seguros para getImageData
          const safeWidth = Math.min(this.width, this.inputCanvas.width);
          const safeHeight = Math.min(this.height, this.inputCanvas.height);
          
          if (safeWidth <= 0 || safeHeight <= 0) return;
          
          // Obter os dados da imagem
          const imageData = this.ctx.getImageData(0, 0, safeWidth, safeHeight);
          const data = imageData.data;
          
          // Dimensões da fonte
          const fontWidth = this.outputCanvas.width / safeWidth;
          const fontHeight = this.outputCanvas.height / safeHeight;
          const fontSize = Math.min(fontWidth, fontHeight);
          
          // Configurar o contexto de saída
          this.outCtx.font = fontSize + 'px monospace';
          this.outCtx.fillStyle = fgColor;
          this.outCtx.textAlign = 'center';
          this.outCtx.textBaseline = 'middle';
          
          // Converter pixels em caracteres ASCII
          for (let y = 0; y < safeHeight; y++) {
            for (let x = 0; x < safeWidth; x++) {
              // Calcular o índice do pixel
              const i = (y * safeWidth + x) * 4;
              
              // Calcular o brilho (luminância)
              const r = data[i];
              const g = data[i + 1];
              const b = data[i + 2];
              const brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
              
              // Escolher o caractere com base no brilho
              const charIndex = invert 
                ? Math.floor((1 - brightness) * (characters.length - 1)) 
                : Math.floor(brightness * (characters.length - 1));
              
              // Desenhar o caractere ASCII
              const char = characters[charIndex] || ' ';
              const drawX = x * fontWidth + fontWidth / 2;
              const drawY = y * fontHeight + fontHeight / 2;
              this.outCtx.fillText(char, drawX, drawY);
            }
          }
        } catch (error) {
          console.error("Erro no processamento ASCII:", error);
        }
      }
    };
    
    // Inicializar renderizador
    renderer.setSize(size.width, size.height);
    gl.domElement.parentNode.appendChild(renderer.domElement);
    
    // Armazenar referência
    rendererRef.current = renderer;
    
    // Limpeza ao desmontar
    return () => {
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, [gl, size, resolution, characters, fgColor, bgColor, invert]);
  
  // Renderizar a cada frame
  useFrame(() => {
    if (rendererRef.current) {
      try {
        rendererRef.current.render(scene, camera);
      } catch (error) {
        console.error("Erro durante renderização:", error);
      }
    }
  }, 1);
  
  return null;
}