"use client";

import { useEffect, useRef, useState } from 'react';

// ASCII density characters from dark to light
const ASCII_CHARS = " .,:;i1tfLCG08@";

interface Ascii3DSceneProps {
  className?: string;
}

export default function Ascii3DScene({ className }: Ascii3DSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const asciiCanvasRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  const [asciiFrame, setAsciiFrame] = useState("");
  const [rotationAngle, setRotationAngle] = useState(0);

  // 3D scene rendering with ASCII effect
  useEffect(() => {
    // Init 3D scene
    const canvas = canvasRef.current;
    const asciiOutput = asciiCanvasRef.current;
    
    if (!canvas || !asciiOutput) return;
    
    const width = 160;
    const height = 80;
    
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
    
    // Function to convert a pixel to ASCII
    const getASCIIChar = (brightness: number) => {
      const index = Math.floor(brightness * (ASCII_CHARS.length - 1));
      return ASCII_CHARS[index];
    };
    
    // Create 3D scene with dynamic content
    const renderScene = (time: number) => {
      if (!ctx || !asciiOutput) return;
      
      // Clear canvas
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, width, height);
      
      // Calculate rotation angle but don't update state on every render
      const angle = time * 0.001;
      // Only update state every ~300ms to avoid infinite render loop
      if (Math.abs(angle - rotationAngle) > 0.3) {
        setRotationAngle(angle);
      }
      
      // Draw 3D scene - a rotating complex shape
      ctx.save();
      ctx.translate(width / 2, height / 2);
      ctx.scale(8, 8); // Scale for visibility
      
      // Draw a stylized 'T' for THERA
      const drawT = (x: number, y: number, rotation: number, color: string) => {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);
        ctx.fillStyle = color;
        
        // Horizontal part of T
        ctx.fillRect(-6, -5, 12, 2);
        
        // Vertical part of T
        ctx.fillRect(-1, -3, 2, 8);
        
        ctx.restore();
      };
      
      // Draw multiple Ts at different positions and rotations
      drawT(0, 0, angle, '#8937E6');
      drawT(Math.sin(angle) * 3, Math.cos(angle) * 3, angle * 1.5, '#0069CC');
      drawT(Math.sin(angle * 1.2) * 5, Math.cos(angle * 0.8) * 5, -angle, '#FF5F57');
      drawT(Math.cos(angle * 0.5) * 7, Math.sin(angle * 1.5) * 4, angle * 0.7, '#FFFFFF');
      
      // Draw a rotating cube
      ctx.strokeStyle = '#00FF41';
      ctx.lineWidth = 0.5;
      
      const drawCube = (size: number, rotation: number) => {
        ctx.save();
        ctx.rotate(rotation);
        
        // Front face
        ctx.beginPath();
        ctx.rect(-size/2, -size/2, size, size);
        ctx.stroke();
        
        // Back face - with perspective
        ctx.beginPath();
        ctx.moveTo(-size/2 + size/4, -size/2 + size/4);
        ctx.lineTo(size/2 + size/4, -size/2 + size/4);
        ctx.lineTo(size/2 + size/4, size/2 + size/4);
        ctx.lineTo(-size/2 + size/4, size/2 + size/4);
        ctx.closePath();
        ctx.stroke();
        
        // Connect corners
        ctx.beginPath();
        ctx.moveTo(-size/2, -size/2);
        ctx.lineTo(-size/2 + size/4, -size/2 + size/4);
        ctx.moveTo(size/2, -size/2);
        ctx.lineTo(size/2 + size/4, -size/2 + size/4);
        ctx.moveTo(size/2, size/2);
        ctx.lineTo(size/2 + size/4, size/2 + size/4);
        ctx.moveTo(-size/2, size/2);
        ctx.lineTo(-size/2 + size/4, size/2 + size/4);
        ctx.stroke();
        
        ctx.restore();
      };
      
      drawCube(10, angle);
      drawCube(5, -angle * 2);
      
      ctx.restore();
      
      // Convert to ASCII art
      const imageData = ctx.getImageData(0, 0, width, height).data;
      let asciiArt = '';
      
      // Create ASCII representation of the scene - only once per few frames
      // to reduce state updates and prevent infinite loops
      for (let y = 0; y < height; y += 2) {
        for (let x = 0; x < width; x++) {
          const offset = (y * width + x) * 4;
          const r = imageData[offset];
          const g = imageData[offset + 1];
          const b = imageData[offset + 2];
          
          // Calculate brightness (weighted for human perception)
          const brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
          
          // Get corresponding ASCII char
          const char = getASCIIChar(brightness);
          asciiArt += char;
        }
        asciiArt += '\n';
      }
      
      // Only update state if ASCII art has significantly changed (every ~300ms)
      // This prevents too many state updates causing infinite render loops
      if (time % 5 < 0.1) { // Update only on certain frames
        setAsciiFrame(prev => {
          // Only update if content has changed significantly
          if (prev !== asciiArt) {
            return asciiArt;
          }
          return prev;
        });
      }
      
      // Continue animation loop
      animationRef.current = requestAnimationFrame(renderScene);
    };
    
    // Start animation
    animationRef.current = requestAnimationFrame(renderScene);
    
    // Cleanup animation on unmount
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className={className}>
      {/* Hidden canvas for 3D rendering */}
      <canvas 
        ref={canvasRef} 
        className="hidden"
      />

      <div className="p-1 rounded-xl bg-gradient-to-br from-[#8937E6]/20 to-[#0069CC]/20 backdrop-blur-sm">
        <div className="ascii-container bg-[#030014]/80 rounded-lg p-4 overflow-hidden border border-white/5">
          <div 
            ref={asciiCanvasRef}
            className="text-[#00FFBB] transform scale-[0.6] md:scale-[0.8] lg:scale-100 origin-top-left"
          >
            <pre className="text-xs leading-[0.65rem] whitespace-pre font-mono">
              {asciiFrame}
            </pre>
          </div>
          
          {/* Info overlay */}
          <div className="absolute top-3 right-3 text-xs text-[#8937E6]/80 flex gap-2 items-center">
            <div className="h-2 w-2 rounded-full bg-[#00FFBB] animate-pulse"></div>
            <span>RENDER: ACTIVE</span>
            <span className="ml-2">ROT: {rotationAngle.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}