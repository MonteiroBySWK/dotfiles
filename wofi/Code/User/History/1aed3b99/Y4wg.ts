export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  const globalFlag = (window as any).__PREFERS_REDUCED_MOTION;
  if (typeof globalFlag === 'boolean') return globalFlag;
  try {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (e) {
    return false;
  }
}
