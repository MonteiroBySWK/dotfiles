export const ASCII_CHARS = " .:-=+*#%@";

export const COLORS = {
  primary: "#8937E6",
  secondary: "#0069CC",
  text: "#F7F7F7",
} as const;

export const MOBILE_BREAKPOINT = 640;

export const PARTICLE_CONFIG = {
  mobile: {
    count: 80,
    opacity: 0.6,
    size: 0.03,
  },
  desktop: {
    count: 200,
    opacity: 0.8,
    size: 0.025,
  },
} as const;

export const ANIMATION_TIMINGS = {
  fadeIn: 1500,
  sceneReady: 100,
} as const;
