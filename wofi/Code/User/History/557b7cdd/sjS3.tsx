"use client";

import { useMobile } from "../hooks/use-mobile";

export function Separator() {
  const isMobile = useMobile();

  return (
    <span
      className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-light whitespace-nowrap"
      style={{
        color: 'var(--color-primary)',
        textShadow: isMobile ? 'none' : '0 0 20px rgba(0, 105, 204, 0.5)',
      }}
    >
      |
    </span>
  );
}
