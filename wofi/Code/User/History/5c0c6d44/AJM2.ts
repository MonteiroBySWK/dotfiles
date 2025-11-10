export const CATEGORIES = [
  'Software House',
  'Academic',
  'Creative Studio',
  'Laboratory',
] as const;

export const ANIMATION_TIMINGS = {
  cycleInterval: 3000,
  fadeOutDuration: 400,
  widthAdjustDelay: 400,
  textChangeDelay: 900,
} as const;

export const TRANSITION_STYLES = {
  opacity: 'cubic-bezier(0.4, 0, 0.2, 1)',
  width: 'cubic-bezier(0.4, 0, 0.2, 1)',
  transform: 'cubic-bezier(0.4, 0, 0.2, 1)',
} as const;
