"use client";

import { useState, useEffect } from 'react';

/**
 * Hook to manage terminal commands and history
 * @returns Object with commands state and handlers
 */
export function useTerminalCommands() {
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [currentCommand, setCurrentCommand] = useState("");
  
  const handleCommand = (cmd: string) => {
    const commands: Record<string, () => string> = {
      help: () => "Available commands: help, version, status, clear, projects, logo",
      version: () => "TheraOS Hyperdrive v3.0.1 (Quantum Build)",
      status: () => "All systems operational. Neural networks at 100% efficiency.",
      clear: () => {
        return "__CLEAR__"; // Special command to clear the terminal
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

  return {
    commandHistory,
    setCommandHistory,
    currentCommand,
    setCurrentCommand,
    handleCommand
  };
}