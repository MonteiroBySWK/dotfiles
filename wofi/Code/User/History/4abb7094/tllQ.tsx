"use client";

import { CATEGORIES, TRANSITION_STYLES } from "../constants";
import { useMobile } from "../hooks/use-mobile";

interface CategoryTextProps {
  currentIndex: number;
  nextIndex: number;
  isAnimating: boolean;
  containerWidth: number;
  currentRef: React.RefObject<HTMLSpanElement | null>;
  nextRef: React.RefObject<HTMLSpanElement | null>;
}

export function CategoryText({
  currentIndex,
  nextIndex,
  isAnimating,
  containerWidth,
  currentRef,
  nextRef,
}: CategoryTextProps) {
  const isMobile = useMobile();

  return (
    <span
      className="inline-flex items-center justify-center overflow-visible relative"
      style={{
        width: containerWidth > 0 ? `${containerWidth}px` : 'auto',
        transition: `width 500ms ${TRANSITION_STYLES.width}`,
      }}
    >
      {/* Hidden element to calculate next text width */}
      <span
        ref={nextRef}
        className="font-sans text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-light whitespace-nowrap absolute opacity-0 pointer-events-none"
        style={{
          letterSpacing: '0.02em',
        }}
        aria-hidden="true"
      >
        {CATEGORIES[nextIndex]}
      </span>

      {/* Current visible text */}
      <span
        ref={currentRef}
        className="font-sans text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-light whitespace-nowrap"
        style={{
          color: 'var(--color-text)',
          letterSpacing: '0.02em',
          textShadow: isMobile ? 'none' : '0 0 30px rgba(247, 247, 247, 0.2)',
          opacity: isAnimating ? 0 : 1,
          transform: isAnimating
            ? 'translateY(-20px) scale(0.95)'
            : 'translateY(0) scale(1)',
          transition: `opacity 400ms ${TRANSITION_STYLES.opacity}, transform 400ms ${TRANSITION_STYLES.transform}`,
        }}
      >
        {CATEGORIES[currentIndex]}
      </span>
    </span>
  );
}
