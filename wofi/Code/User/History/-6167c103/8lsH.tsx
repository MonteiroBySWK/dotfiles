import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function Background() {
  const blueCircle = useRef<HTMLDivElement>(null);
  const purpleCircle = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (blueCircle.current && purpleCircle.current) {
      gsap.to(blueCircle.current, {
        x: 60,   // aumentei o deslocamento horizontal
        y: 40,   // aumentei o deslocamento vertical
        duration: 4,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      gsap.to(purpleCircle.current, {
        scale: 1.3,      // escala maior
        opacity: 0.5,    // variação mais visível
        duration: 5,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
    }
  }, []);

  return (
    <>
      <div className="fixed inset-0 overflow-hidden">
        <div
          ref={blueCircle}
          className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"
        />
        <div
          ref={purpleCircle}
          className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
        />
      </div>
    </>
  );
}
