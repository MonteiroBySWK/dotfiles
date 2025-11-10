import { useEffect, useRef } from "react";
import { gsap } from "gsap";

function randomRange(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export default function Background() {
  const blueCircle = useRef<HTMLDivElement>(null);
  const purpleCircle = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (blueCircle.current && purpleCircle.current) {
      function animateChaos(target: HTMLElement) {
        const tl = gsap.timeline({
          repeat: -1,
          yoyo: true,
          defaults: { ease: "sine.inOut" },
        });

        // Sequência de movimentos caóticos com durações e valores randômicos
        for (let i = 0; i < 10; i++) {
          tl.to(target, {
            x: randomRange(-100, 100),
            y: randomRange(-80, 80),
            rotation: randomRange(-10, 10),
            scale: randomRange(0.9, 1.3),
            duration: randomRange(1, 3),
          });
        }

        return tl;
      }

      animateChaos(blueCircle.current);
      animateChaos(purpleCircle.current);
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
