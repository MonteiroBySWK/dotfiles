import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const circlesConfig = [
  { size: 180, color: "rgba(59, 130, 246, 0.1)", initX: 40, initY: 80 }, // azul
  { size: 240, color: "rgba(139, 92, 246, 0.1)", initX: 200, initY: 300 }, // roxo
  { size: 150, color: "rgba(236, 72, 153, 0.1)", initX: 100, initY: 150 }, // rosa
  { size: 220, color: "rgba(34, 197, 94, 0.1)", initX: 300, initY: 60 },  // verde
  { size: 190, color: "rgba(234, 179, 8, 0.1)", initX: 50, initY: 350 },  // amarelo
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
    <div
      className="fixed inset-0 overflow-hidden"
      style={{ pointerEvents: "none" }}
    >
      {circlesConfig.map(({ size, color, initX, initY }, i) => (
        <div
          key={i}
          ref={(el) => (circlesRefs.current[i] = el)}
          style={{
            width: size,
            height: size,
            top: initY,
            left: initX,
            position: "absolute",
            borderRadius: "50%",
            filter: "blur(40px)",
            backgroundColor: color,
          }}
        />
      ))}
    </div>
  );
}
