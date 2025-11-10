"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [currentFrame, setCurrentFrame] = useState(0);
  const [asciiFrame, setAsciiFrame] = useState(0);

  // 3D cube ASCII frames rotating around vertical axis
  const asciiCubeFrames = [
    `    +-------------+
    |             |
    |             |
    |    THERA    |
    |             |
    |             |
    +-------------+`,
    
    `     ,------------+
    /|            |
   / |            |
  +  |    THERA   |
  |  |            |
  |  |            |
  |  +------------+
  | /
  |/
  +`,
    
    `      ,------------,
     /            /|
    /            / |
   +------------+  |
   |    THERA   |  |
   |            |  |
   |            |  +
   |            | /
   |            |/
   +------------+`,
    
    `  +------------+
  |            |
  |            |
  |    THERA   |
  |            |
  |            |
  +------------+,
   \\            \\
    \\            \\
     +------------+`,
    
    `  +------------+
  |            | \\
  |            |  \\
  |    THERA   |   +
  |            |  /
  |            | /
  +------------+`,
  ];

  // Boot sequence text
  const bootLines = [
    "[    0.000000] TheraOS 2.0.1 booting...",
    "[    0.001243] Initializing kernel modules",
    "[    0.002847] Loading CPU microcode",
    "[    0.003921] Memory: 32GB available",
    "[    0.004155] Detecting hardware...",
    "[    0.005234] ",
    "[    0.005234] Starting Thera Labs services:",
    "[    0.006789] * Loading development environment... [  OK  ]",
    "[    0.007234] * Initializing code repositories... [  OK  ]",
    "[    0.008945] * Starting React compiler... [  OK  ]",
    "[    0.009567] * Loading TypeScript engine... [  OK  ]",
    "[    0.010234] * Connecting to cloud services... [  OK  ]",
    "[    0.011789] * Optimizing build pipeline... [  OK  ]",
    "[    0.012456] * Testing deployment scripts... [  OK  ]",
    "[    0.013234] ",
    "[    0.013234] TheraOS ready. Welcome to the future.",
    "[    0.013234] thera@lab:~$ "
  ];

  const [visibleLines, setVisibleLines] = useState<string[]>([]);
  const [bootComplete, setBootComplete] = useState(false);
  const VISIBLE_LINES = 14;

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
      {/* Base gradient background - stronger than before */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#8937E6]/30 via-black to-[#0069CC]/30" />

      {/* Mouse interaction effect */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40 transition-all duration-700 ease-out"
        style={{
          background: `radial-gradient(900px 700px at ${mousePosition.x}% ${mousePosition.y}%, rgba(137,55,230,0.25) 0%, rgba(0,105,204,0.2) 30%, transparent 70%)`,
        }}
      />

      {/* Ambient pulse overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(137,55,230,0.05)_0%,_transparent_60%)] animate-pulse" />

      <div className="relative z-10 flex flex-col items-center justify-center space-y-10">
        {/* Terminal Window with fixed height */}
        <div className="mx-auto max-w-4xl transform transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl">
          {/* Terminal Header - refined with subtle gradient */}
          <div className="flex items-center gap-2 rounded-t-lg bg-gradient-to-r from-[#212121] via-[#252525] to-[#212121] px-4 py-3 shadow-xl border border-[#F7F7F7]/10">
            <div className="flex gap-2">
              <div className="h-3 w-3 rounded-full bg-[#8937E6] shadow-inner"></div>
              <div className="h-3 w-3 rounded-full bg-[#F7F7F7]/60 shadow-inner"></div>
              <div className="h-3 w-3 rounded-full bg-[#0069CC] shadow-inner"></div>
            </div>
            <div className="ml-4 text-sm text-[#F7F7F7]/90 font-medium tracking-wide">thera@lab: ~/projects</div>
          </div>
          
          {/* Terminal Content - fixed height with scanline effect */}
          <div className="relative rounded-b-lg bg-[#1A1A1A] p-6 shadow-xl border border-t-0 border-[#F7F7F7]/10 ring-1 ring-inset ring-black/5 h-[22rem] overflow-hidden">
            {/* Scanline effect */}
            <div className="scanline"></div>
            
            <div className="flex flex-col h-full justify-between">
              <div>
                {/* Boot lines with animation */}
                {visibleLines.map((line, i) => (
                  <div 
                    key={i} 
                    className="text-left text-sm leading-relaxed text-[#F7F7F7] animate-term-line-in" 
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    {line}
                  </div>
                ))}
                {bootComplete && <span className="term-caret"></span>}
              </div>
              
              {/* Rotating ASCII cube */}
              <div className="text-[#8937E6] mt-2 self-center">
                <pre className="text-sm leading-tight whitespace-pre select-none">
                  {asciiCubeFrames[asciiFrame]}
                </pre>
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
