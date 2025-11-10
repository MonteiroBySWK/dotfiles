"use client";

import { useState } from 'react';

interface FuturisticButtonProps {
  text: string;
  href?: string;
  onClick?: () => void;
  className?: string;
}

export default function FuturisticButton({
  text,
  href,
  onClick,
  className = '',
}: FuturisticButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const handleClick = () => {
    if (onClick) onClick();
  };
  
  const buttonContent = (
    <div
      className={`relative group overflow-hidden rounded-lg px-6 py-3 border border-[#8937E6]/30 bg-[#030014]/60 backdrop-blur-sm transition-all duration-300 transform hover:shadow-[0_0_15px_rgba(137,55,230,0.3)] ${
        isHovered ? 'scale-105' : 'scale-100'
      } ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      {/* Background glow effect */}
      <div className={`absolute inset-0 bg-gradient-to-r from-[#8937E6]/10 to-[#0069CC]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10`}></div>
      
      {/* Border glow effect */}
      <div className={`absolute inset-0 rounded-lg ${
        isHovered ? 'border border-[#8937E6]/50' : 'border border-transparent'
      } transition-all duration-300`}></div>
      
      {/* Button text with gradient */}
      <span className={`relative z-10 font-medium bg-gradient-to-r from-[#F7F7F7] to-[#00FFBB] bg-clip-text text-transparent transition-all duration-300`}>
        {text}
      </span>
      
      {/* Animated corners */}
      <div className={`absolute top-0 left-0 w-2 h-2 border-t border-l border-[#8937E6] transition-all duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}></div>
      <div className={`absolute top-0 right-0 w-2 h-2 border-t border-r border-[#8937E6] transition-all duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}></div>
      <div className={`absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#8937E6] transition-all duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}></div>
      <div className={`absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#8937E6] transition-all duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}></div>
    </div>
  );
  
  if (href) {
    return (
      <a href={href} className="block">
        {buttonContent}
      </a>
    );
  }
  
  return buttonContent;
}