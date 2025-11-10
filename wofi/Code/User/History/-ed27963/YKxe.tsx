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
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

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
  }, []);

  // Handle ASCII cube rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setAsciiFrame((prev) => (prev + 1) % asciiCubeFrames.length);
    }, 500); // Rotate every 500ms
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-6 text-center font-mono">
      {/* Base gradient background */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#8937E6]/20 via-black to-[#0069CC]/20" />

      {/* Very subtle mouse interaction effect */}
      <div
        className="pointer-events-none absolute inset-0 opacity-15 transition-all duration-1000 ease-out"
        style={{
          background: `radial-gradient(1000px 800px at ${mousePosition.x}% ${mousePosition.y}%, rgba(137,55,230,0.12) 0%, rgba(0,105,204,0.1) 25%, transparent 65%)`,
        }}
      />

      {/* Ambient pulse overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(137,55,230,0.05)_0%,_transparent_60%)] animate-pulse" />

      <div className="relative z-10 flex flex-col items-center justify-center space-y-12">
        {/* Rotating 3D ASCII sprite outside the terminal */}
        <div className="relative mb-6">
          {/* Glow effect behind the ASCII art */}
          <div className="absolute inset-0 bg-[#8937E6]/10 blur-xl rounded-full -z-10 animate-pulse"></div>
          
          {/* 3D Rotating ASCII art */}
          <div className="text-[#8937E6] transform perspective-800 rotate-y">
            <pre className="text-lg leading-tight whitespace-pre select-none font-mono drop-shadow-[0_0_8px_rgba(137,55,230,0.6)]">
              {asciiCubeFrames[asciiFrame]}
            </pre>
          </div>
        </div>
        
        {/* Terminal Window with fixed height - larger size */}
        <div className="mx-auto max-w-5xl w-full transform transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl">
          {/* Terminal Header - refined with subtle gradient */}
          <div className="flex items-center gap-2 rounded-t-lg bg-gradient-to-r from-[#121212] via-[#252525] to-[#121212] px-4 py-3 shadow-xl border border-[#F7F7F7]/10">
            <div className="flex gap-2">
              <div className="h-3.5 w-3.5 rounded-full bg-[#FF5F57] shadow-inner"></div>
              <div className="h-3.5 w-3.5 rounded-full bg-[#FFBD2E] shadow-inner"></div>
              <div className="h-3.5 w-3.5 rounded-full bg-[#28CA42] shadow-inner"></div>
            </div>
            <div className="ml-4 text-sm text-[#F7F7F7]/90 font-medium tracking-wide">thera@lab: ~/projects</div>
          </div>
          
          {/* Terminal Content - fixed height with scanline effect */}
          <div className="relative rounded-b-lg bg-[#121212] p-6 shadow-xl border border-t-0 border-[#F7F7F7]/10 ring-1 ring-inset ring-black/5 h-[28rem] overflow-hidden">
            {/* Scanline effect */}
            <div className="scanline"></div>
            
            <div className="flex flex-col h-full">
              <div>
                {/* Boot lines with animation */}
                {visibleLines.map((line, i) => (
                  <div 
                    key={i} 
                    className="text-left text-base leading-relaxed text-[#00FF41] animate-term-line-in drop-shadow-[0_0_5px_rgba(0,255,65,0.3)]" 
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    {line}
                  </div>
                ))}
                {bootComplete && <span className="term-caret"></span>}
              </div>
            </div>
          </div>
        </div>

        {/* Main title */}
        <div className="space-y-4">
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
