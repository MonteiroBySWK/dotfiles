"use client";

import Ascii3DScene from '@/components/AsciiArt/Ascii3DScene';
import Terminal from '@/components/Terminal/Terminal';
import MouseTrackingBackground from '@/components/Background/MouseTrackingBackground';
import BackgroundEffects from '@/components/Background/BackgroundEffects';

export default function Home() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#030014] px-6 text-center font-mono">
      {/* Background effects */}
      <MouseTrackingBackground />
      <BackgroundEffects />

      <div className="relative z-10 flex flex-col items-center justify-center space-y-8 w-full max-w-7xl">
        {/* Futuristic 3D ASCII art visualization */}
        <div className="relative mb-4 w-full max-w-4xl">
          {/* Glow effects behind ASCII */}
          <div className="absolute inset-0 bg-[#8937E6]/5 blur-2xl rounded-3xl -z-10 animate-pulse"></div>
          <div className="absolute inset-0 bg-[#0069CC]/5 blur-xl rounded-3xl -z-10 transform translate-x-4 translate-y-4"></div>
          
          {/* ASCII Art 3D Scene */}
          <Ascii3DScene className="w-full" />
        </div>
        
        {/* Futuristic Terminal */}
        <Terminal />

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