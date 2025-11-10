import { useEffect, useState, useRef } from 'react';

const CATEGORIES = [
  'Software House',
  'Academic',
  'Creative Studio',
  'Laboratory',
] as const;

const ANIMATION_TIMINGS = {
  cycleInterval: 3000,
  fadeOutDuration: 400,
  widthAdjustDelay: 400,
  textChangeDelay: 900,
} as const;

export function useCategoryRotation() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const currentRef = useRef<HTMLSpanElement | null>(null);
  const nextRef = useRef<HTMLSpanElement | null>(null);

  // Update container width based on current text
  useEffect(() => {
    if (currentRef.current) {
      setContainerWidth(currentRef.current.offsetWidth);
    }
  }, [currentIndex]);

  // Handle category rotation
  useEffect(() => {
    const interval = setInterval(() => {
      const next = (currentIndex + 1) % CATEGORIES.length;
      setNextIndex(next);
      setIsAnimating(true);

      // Wait for current text to fade out before adjusting width
      setTimeout(() => {
        if (nextRef.current) {
          setContainerWidth(nextRef.current.offsetWidth);
        }
      }, ANIMATION_TIMINGS.widthAdjustDelay);

      // Change text after width has adjusted
      setTimeout(() => {
        setCurrentIndex(next);
        setIsAnimating(false);
      }, ANIMATION_TIMINGS.textChangeDelay);
    }, ANIMATION_TIMINGS.cycleInterval);

    return () => clearInterval(interval);
  }, [currentIndex]);

  return {
    currentIndex,
    nextIndex,
    isAnimating,
    containerWidth,
    currentRef,
    nextRef,
    categories: CATEGORIES,
  };
}
