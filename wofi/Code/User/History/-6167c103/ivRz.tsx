import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function Background() {
  const blueCircle = useRef<HTMLDivElement>(null);
  const purpleCircle = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (blueCircle.current && purpleCircle.current) {
      // Animação do círculo azul (oscilar suavemente em x e y)
      gsap.to(blueCircle.current, {
        x: 20,
        y: 10,
        duration: 4,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      // Animação do círculo roxo (oscilar em escala e opacidade)
      gsap.to(purpleCircle.current, {
        scale: 1.1,
        opacity: 0.7,
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
