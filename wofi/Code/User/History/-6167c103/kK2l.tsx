import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const circlesConfig = [
  { size: 180, color: "bg-blue-500/10", initX: 40, initY: 80 },
  { size: 240, color: "bg-purple-500/10", initX: 200, initY: 300 },
  { size: 150, color: "bg-pink-500/10", initX: 100, initY: 150 },
  { size: 220, color: "bg-green-500/10", initX: 300, initY: 60 },
  { size: 190, color: "bg-yellow-400/10", initX: 50, initY: 350 },
];

function randomRange(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export default function Background() {
  const circlesRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    circlesRefs.current.forEach((circle) => {
      if (!circle) return;

      const tl = gsap.timeline({
        repeat: -1,
        yoyo: true,
        defaults: { ease: "sine.inOut" },
      });

      for (let i = 0; i < 10; i++) {
        tl.to(circle, {
          x: randomRange(-120, 120),
          y: randomRange(-100, 100),
          rotation: randomRange(-15, 15),
          scale: randomRange(0.9, 1.4),
          duration: randomRange(1, 3),
        });
      }
    });
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden -z-10">
      {circlesConfig.map(({ size, color, initX, initY }, i) => (
        <div
          key={i}
          ref={(el) => (circlesRefs.current[i] = el)}
          className={`${color} rounded-full blur-3xl absolute`}
          style={{
            width: size,
            height: size,
            top: initY,
            left: initX,
          }}
        />
      ))}
    </div>
  );
}
