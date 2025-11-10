"use client";

import { useMobile } from "../hooks/use-mobile";

interface TheraLogoProps {
  mounted: boolean;
}

export function TheraLogo({ mounted }: TheraLogoProps) {
  const isMobile = useMobile();

  return (
    <span
      className="font-mono text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold bg-clip-text text-transparent"
      style={{
        color: 'var(--color-primary)',
        letterSpacing: '0.15em',
        textShadow: isMobile
          ? 'none'
          : '0 0 40px rgba(137, 55, 230, 0.3), 0 0 80px rgba(0, 105, 204, 0.2)',
      }}
    >
      thera
    </span>
  );
}
