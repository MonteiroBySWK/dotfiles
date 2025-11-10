import { useLayoutEffect, useRef } from "react";

const ProgressLine = () => {
  const barRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (!barRef.current) return;

    gsap.fromTo(
      barRef.current,
      { scaleX: 0 },
      {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: document.body,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        },
        transformOrigin: "left center",
      }
    );
  }, []);

  return (
    <div
      ref={barRef}
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-sky-400 origin-left z-50 scale-x-0"
    />
  );
};