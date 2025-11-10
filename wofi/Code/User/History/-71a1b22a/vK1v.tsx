"use client";

import { useEffect, useState } from 'react';

// Boot sequence text with improved content
const BOOT_LINES = [
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

const VISIBLE_LINES_LIMIT = 16;
const MAX_HISTORY_LINES = 50;

interface TerminalProps {
  className?: string;
}

export default function Terminal({ className }: TerminalProps) {
  const [visibleLines, setVisibleLines] = useState<string[]>([]);
  const [bootComplete, setBootComplete] = useState(false);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [currentCommand, setCurrentCommand] = useState("");
  const [bootSequenceStarted, setBootSequenceStarted] = useState(false);
  const [bootSequenceIndex, setBootSequenceIndex] = useState(0);

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

  // Handle boot sequence animation
  useEffect(() => {
    let lineIndex = 0;
    let timer: NodeJS.Timeout;
    let mounted = true; // Flag to track if component is mounted
    
    const addLine = () => {
      if (!mounted) return; // Don't continue if component unmounted
      
      if (lineIndex < BOOT_LINES.length) {
        const currentLine = BOOT_LINES[lineIndex];
        
        // Only proceed if line exists
        if (typeof currentLine === 'string') {
          setVisibleLines(prev => {
            // Make sure we don't add the same line multiple times
            if (prev.length > 0 && prev[prev.length - 1] === currentLine) {
              return prev;
            }
            const newLines = [...prev, currentLine];
            // Keep only the most recent lines
            return newLines.slice(-VISIBLE_LINES_LIMIT);
          });
        }
        
        lineIndex++;
        timer = setTimeout(addLine, 120);
      } else if (mounted) { // Check if mounted before setting state
        // Boot sequence complete
        setBootComplete(true);
      }
    };

    // Start the boot sequence - slight delay to ensure clean start
    setBootSequenceStarted(true);
    timer = setTimeout(addLine, 10);

    return () => {
      mounted = false; // Mark as unmounted
      clearTimeout(timer);
    };
  }, []); // Run only once on component mount
  
  // Handle terminal commands input
  useEffect(() => {
    if (!bootComplete) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      // Handle typing of characters
      if (e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
        setCurrentCommand(prev => prev + e.key);
        return;
      }
      
      // Handle special keys
      switch (e.key) {
        case 'Enter':
          e.preventDefault();
          const response = handleCommand(currentCommand);
          
          // Add command to visible lines
          setVisibleLines(prev => {
            const commandLine = `thera@hyperlab:~$ ${currentCommand}`;
            let updatedLines = [...prev, commandLine];
            
            // If we have a response, add those lines too
            if (response) {
              const responseLines = response.split('\n').filter(line => typeof line === 'string');
              updatedLines = [...updatedLines, ...responseLines];
            }
            
            // Limit number of lines to avoid performance issues
            return updatedLines.slice(-MAX_HISTORY_LINES);
          });
          
          // Save to history and clear current command
          if (currentCommand.trim()) {
            setCommandHistory(prev => [...prev, currentCommand]);
          }
          setCurrentCommand("");
          break;
          
        case 'Backspace':
          setCurrentCommand(prev => prev.slice(0, -1));
          break;
          
        case 'Escape':
          setCurrentCommand("");
          break;
          
        // Arrow keys for history navigation could be added here
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [bootComplete]);

  return (
    <div className={`w-full max-w-5xl transform transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl ${className}`}>
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
              // Skip undefined or null lines
              if (!line) {
                return null;
              }
              
              // Command line handling
              if (typeof line === 'string' && line.includes('thera@hyperlab:~$')) {
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
              if (typeof line === 'string' && (line.includes('█') || line.includes('╗') || line.includes('║'))) {
                return (
                  <div 
                    key={i} 
                    className="text-left text-base text-[#8937E6] font-bold" 
                  >
                    <pre className="whitespace-pre">{line}</pre>
                  </div>
                );
              }
              
              // Normal output line for valid string
              if (typeof line === 'string') {
                return (
                  <div 
                    key={i} 
                    className="text-left text-base leading-relaxed text-[#00FFBB] animate-term-line-in" 
                    style={{ animationDelay: `${i * 30}ms` }}
                  >
                    {line}
                  </div>
                );
              }
              
              // Fallback for any other type
              return null;
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
  );
}