import gsap from "gsap";

export function initGsapControl() {
  if (typeof window === "undefined") return () => {};

  const prefersReduced = !!(
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  // Expose flag for components
  (window as any).__PREFERS_REDUCED_MOTION = prefersReduced;

  // If user prefers reduced motion, pause global timeline
  if (prefersReduced) {
    try {
      gsap.globalTimeline.pause();
    } catch (e) {
      /* ignore */
    }
  }

  const handleVisibility = () => {
    try {
      if (document.hidden) gsap.globalTimeline.pause();
      else if (!prefersReduced) gsap.globalTimeline.resume();
    } catch (e) {
      /* ignore */
    }
  };

  document.addEventListener("visibilitychange", handleVisibility);

  return () => document.removeEventListener("visibilitychange", handleVisibility);
}
