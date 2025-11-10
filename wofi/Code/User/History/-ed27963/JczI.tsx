"use client";

import { useEffect, useState, useRef } from "react";

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const asciiCanvasRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  const [asciiFrame, setAsciiFrame] = useState("");
  const [rotationAngle, setRotationAngle] = useState(0);

  // ASCII density characters from dark to light
  const ASCII_CHARS = " .,:;i1tfLCG08@";

  // Boot sequence text with improved content
  const bootLines = [
    "[    0.000000] TheraOS 3.0.1 initializing...",
    "[    0.001243] CPU: AMD Ryzen ThreadRipper 7995WX 96-Core",
    "[    0.002847] Quantum accelerator detected",
    "[    0.003921] Memory: 512GB DDR6 available",
    "[    0.004155] Neural processing unit initialized",
    "[    0.005234] ",
    "[    0.005234] Loading Thera Hyperdrive systems:",
    "[    0.006789] * Initializing quantum entanglement network... [  OK  ]",
    "[    0.007234] * Launching code synthesis engine... [  OK  ]",
    "[    0.008945] * Starting neural compiler... [  OK  ]",
    "[    0.009567] * Loading AI development framework... [  OK  ]",
    "[    0.010234] * Connecting to orbital cloud cluster... [  OK  ]",
    "[    0.011789] * Optimizing neural build pipeline... [  OK  ]",
    "[    0.012456] * Calibrating holographic interface... [  OK  ]",
    "[    0.013234] * Securing quantum encryption channels... [  OK  ]",
    "[    0.014567] ",
    "[    0.015123] Thera Hyperdrive activated. Welcome, developer.",
    "[    0.016234] thera@hyperlab:~$ "
  ];

  const [visibleLines, setVisibleLines] = useState<string[]>([]);
  const [bootComplete, setBootComplete] = useState(false);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [currentCommand, setCurrentCommand] = useState("");
  const VISIBLE_LINES = 16;
  
  // Terminal commands handling
  const handleCommand = (cmd: string) => {
    const commands: Record<string, () => string> = {
      help: () => "Available commands: help, version, status, clear, projects, logo",
      version: () => "TheraOS Hyperdrive v3.0.1 (Quantum Build)",
      status: () => "All systems operational. Neural networks at 100% efficiency.",
      clear: () => {
        setVisibleLines([]);
        return "";
      },
      projects: () => "Current projects:\n- Neural Code Synthesis\n- Quantum Computing Interface\n- Holographic Development Environment\n- AI-driven Architecture",
      logo: () => {
        return `
  ████████╗██╗  ██╗███████╗██████╗  █████╗ 
  ╚══██╔══╝██║  ██║██╔════╝██╔══██╗██╔══██╗
     ██║   ███████║█████╗  ██████╔╝███████║
     ██║   ██╔══██║██╔══╝  ██╔══██╗██╔══██║
     ██║   ██║  ██║███████╗██║  ██║██║  ██║
     ╚═╝   ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝
      HYPERDRIVE QUANTUM DEVELOPMENT SYSTEM
        `;
      }
    };

    const cmdLower = cmd.toLowerCase().trim();
    if (cmdLower === "") return "";
    
    if (commands[cmdLower]) {
      return commands[cmdLower]();
    }
    return `Command not found: ${cmd}. Type 'help' for available commands.`;
  };

  // Handle mouse movement for subtle gradient effect
  useEffect(() => {
    // Debounce function to limit updates and prevent infinite loop
    let timeoutId: NodeJS.Timeout | null = null;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      
      timeoutId = setTimeout(() => {
        setMousePosition({
          x: (e.clientX / window.innerWidth) * 100,
          y: (e.clientY / window.innerHeight) * 100,
        });
      }, 50); // Only update every 50ms
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  // 3D scene rendering with ASCII effect
  useEffect(() => {
    // Init 3D scene
    const canvas = canvasRef.current;
    const asciiOutput = asciiCanvasRef.current;
    
    if (!canvas || !asciiOutput) return;
    
    const width = 160;
    const height = 80;
    const cellSize = 2;
    
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
      
      // Create ASCII representation of the scene
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
      
      setAsciiFrame(asciiArt);
      
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
  }, [ASCII_CHARS]);

  // Handle boot sequence animation
  useEffect(() => {
    let lineIndex = 0;
    let timer: NodeJS.Timeout;

    const addLine = () => {
      if (lineIndex < bootLines.length) {
        setVisibleLines(prev => {
          const newLines = [...prev, bootLines[lineIndex]];
          // Keep only the most recent lines
          return newLines.slice(-VISIBLE_LINES);
        });
        lineIndex++;
        timer = setTimeout(addLine, 120);
      } else {
        // Boot sequence complete
        setBootComplete(true);
      }
    };

    // Start the boot sequence
    addLine();

    return () => clearTimeout(timer);
  }, [bootLines, VISIBLE_LINES]);
  
  // Handle terminal commands input
  useEffect(() => {
    if (!bootComplete) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        const response = handleCommand(currentCommand);
        
        if (response) {
          const newLines = response.split('\n');
          setVisibleLines(prev => {
            const updatedLines = [
              ...prev,
              `thera@hyperlab:~$ ${currentCommand}`,
              ...newLines
            ];
            return updatedLines.slice(-50); // Keep history but limit it
          });
        } else {
          setVisibleLines(prev => {
            const updatedLines = [
              ...prev,
              `thera@hyperlab:~$ ${currentCommand}`
            ];
            return updatedLines.slice(-50);
          });
        }
        
        setCommandHistory(prev => [...prev, currentCommand]);
        setCurrentCommand("");
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [bootComplete, currentCommand, handleCommand]);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#030014] px-6 text-center font-mono">
      {/* Hidden canvas for 3D rendering */}
      <canvas 
        ref={canvasRef} 
        className="hidden"
      />

      {/* Enhanced background effects */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#8937E6]/10 via-transparent to-[#0069CC]/10" />
      
      {/* Star field background */}
      <div className="stars-container absolute inset-0 opacity-80" />
      
      {/* Subtle mouse interaction effect */}
      <div
        className="pointer-events-none absolute inset-0 opacity-20 transition-all duration-1000 ease-out"
        style={{
          background: `radial-gradient(1200px 900px at ${mousePosition.x}% ${mousePosition.y}%, rgba(137,55,230,0.15) 0%, rgba(0,105,204,0.12) 20%, transparent 70%)`,
        }}
      />

      {/* Digital noise overlay */}
      <div className="pointer-events-none absolute inset-0 bg-noise opacity-5" />

      <div className="relative z-10 flex flex-col items-center justify-center space-y-8 w-full max-w-7xl">
        {/* Futuristic 3D ASCII art visualization */}
        <div className="relative mb-4 w-full max-w-4xl">
          {/* Glow effects behind ASCII */}
          <div className="absolute inset-0 bg-[#8937E6]/5 blur-2xl rounded-3xl -z-10 animate-pulse"></div>
          <div className="absolute inset-0 bg-[#0069CC]/5 blur-xl rounded-3xl -z-10 transform translate-x-4 translate-y-4"></div>
          
          {/* ASCII Art 3D Scene */}
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
        
        {/* Futuristic Terminal */}
        <div className="w-full max-w-5xl transform transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl">
          {/* Terminal Header with advanced UI */}
          <div className="flex items-center justify-between rounded-t-lg bg-gradient-to-r from-[#0A0A0A] via-[#0D0D0D] to-[#0A0A0A] px-4 py-2 shadow-xl border border-[#8937E6]/20">
            <div className="flex items-center gap-4">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-[#FF5F57] shadow-inner ring-1 ring-black/10"></div>
                <div className="h-3 w-3 rounded-full bg-[#FFBD2E] shadow-inner ring-1 ring-black/10"></div>
                <div className="h-3 w-3 rounded-full bg-[#28CA42] shadow-inner ring-1 ring-black/10"></div>
              </div>
              <div className="text-sm text-[#F7F7F7]/90 font-medium tracking-wide flex items-center gap-2">
                <span className="text-[#8937E6]">●</span>
                thera@hyperlab:~/quantum-projects
              </div>
            </div>
            
            <div className="flex gap-3 text-xs text-[#F7F7F7]/50">
              <div className="flex items-center gap-1">
                <div className="h-1.5 w-1.5 rounded-full bg-[#00FFBB]"></div>
                <span>SECURE</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-1.5 w-1.5 rounded-full bg-[#8937E6]"></div>
                <span>QUANTUM</span>
              </div>
            </div>
          </div>
          
          {/* Terminal Content with holographic effects */}
          <div className="terminal-bg relative rounded-b-lg bg-[#050505] shadow-2xl border border-t-0 border-[#8937E6]/20 overflow-hidden">
            {/* Terminal effects */}
            <div className="scanline"></div>
            <div className="screen-flicker"></div>
            <div className="crt-lines"></div>
            
            <div className="flex flex-col h-[32rem] p-6">
              <div className="flex-1 overflow-auto terminal-text">
                {/* Boot and command lines with animation */}
                {visibleLines.map((line, i) => {
                  // Command line handling
                  if (line.includes('thera@hyperlab:~$')) {
                    return (
                      <div 
                        key={i} 
                        className="text-left text-base text-[#F7F7F7] font-medium" 
                      >
                        <span className="text-[#8937E6]">thera@hyperlab</span>
                        <span className="text-[#F7F7F7]">:</span>
                        <span className="text-[#0069CC]">~</span>
                        <span className="text-[#F7F7F7]">$ </span>
                        <span className="text-[#00FFBB]">{line.split('$')[1]}</span>
                      </div>
                    );
                  }
                  
                  // Output lines - check if it's a logo (has █ characters)
                  if (line.includes('█') || line.includes('╗') || line.includes('║')) {
                    return (
                      <div 
                        key={i} 
                        className="text-left text-base text-[#8937E6] font-bold" 
                      >
                        <pre className="whitespace-pre">{line}</pre>
                      </div>
                    );
                  }
                  
                  // Normal output line
                  return (
                    <div 
                      key={i} 
                      className="text-left text-base leading-relaxed text-[#00FFBB] animate-term-line-in" 
                      style={{ animationDelay: `${i * 30}ms` }}
                    >
                      {line}
                    </div>
                  );
                })}
                
                {/* Command input line with blinking cursor */}
                {bootComplete && (
                  <div className="text-left text-base mt-1 flex items-center">
                    <span className="text-[#8937E6]">thera@hyperlab</span>
                    <span className="text-[#F7F7F7]">:</span>
                    <span className="text-[#0069CC]">~</span>
                    <span className="text-[#F7F7F7]">$ </span>
                    <span className="text-[#00FFBB]">{currentCommand}</span>
                    <span className="term-caret"></span>
                  </div>
                )}
              </div>
              
              {/* Terminal status bar */}
              <div className="mt-2 pt-2 border-t border-white/10 flex justify-between items-center text-xs text-[#F7F7F7]/50">
                <div>QUANTUM SECURE SHELL v3.5.1</div>
                <div className="flex gap-3">
                  <div>[ENCRYPTED]</div>
                  <div className="text-[#00FFBB]">{new Date().toLocaleTimeString()}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main title */}
        <div className="space-y-4 mt-6">
          <h1 className="animate-fade-in bg-gradient-to-r from-[#F7F7F7] via-[#8937E6] to-[#0069CC] bg-clip-text text-4xl font-medium tracking-tight text-transparent transition-all duration-300 hover:tracking-normal md:text-6xl">
            thera | Software House
          </h1>

          {/* Animated underline */}
          <div className="mx-auto h-[2px] w-0 animate-expand-width bg-gradient-to-r from-[#8937E6] to-[#0069CC] transition-all duration-1000" />
        </div>
      </div>
    </div>
  );
}
