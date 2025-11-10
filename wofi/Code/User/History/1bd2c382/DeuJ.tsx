"use client";

interface BackgroundEffectsProps {
  className?: string;
}

export default function BackgroundEffects({ className }: BackgroundEffectsProps) {
  return (
    <>
      {/* Star field background */}
      <div className={`stars-container absolute inset-0 opacity-80 ${className}`} />
      
      {/* Digital noise overlay */}
      <div className="pointer-events-none absolute inset-0 bg-noise opacity-5" />
    </>
  );
}