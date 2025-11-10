"use client";

import { useState, useEffect } from 'react';

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

/**
 * Hook to manage terminal boot sequence
 * @param visibleLinesLimit Maximum number of lines to show at once
 * @returns Boot sequence state and lines
 */
export function useBootSequence(visibleLinesLimit: number = 16) {
  const [visibleLines, setVisibleLines] = useState<string[]>([]);
  const [bootComplete, setBootComplete] = useState(false);
  const [bootSequenceStarted, setBootSequenceStarted] = useState(false);

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
            return newLines.slice(-visibleLinesLimit);
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
  }, [visibleLinesLimit]); // Only run once on component mount
  
  return {
    visibleLines,
    setVisibleLines,
    bootComplete,
    bootSequenceStarted,
    bootLines: BOOT_LINES
  };
}