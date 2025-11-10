import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function Background() {
  const blueRef = useRef<HTMLDivElement>(null);
  const purpleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (blueRef.current && purpleRef.current) {
      const animate = (el: HTMLElement) => {
        const tl = gsap.timeline({ repeat: -1, yoyo: true, defaults: { ease: "sine.inOut" } });
        for (let i = 0; i < 8; i++) {
          tl.to(el, {
            x: gsap.utils.random(-80, 80),
            y: gsap.utils.random(-60, 60),
            rotation: gsap.utils.random(-10, 10),
            scale: gsap.utils.random(0.9, 1.3),
            duration: gsap.utils.random(1.5, 3),
          });
        }
      };

      animate(blueRef.current);
      animate(purpleRef.current);
    }
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <div
        ref={blueRef}
        className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"
      />
      <div
        ref={purpleRef}
        className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
      />
    </div>
  );
}
