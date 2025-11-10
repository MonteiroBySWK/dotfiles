import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function Background() {
  const circleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (circleRef.current) {
      gsap.to(circleRef.current, {
        x: 100,
        y: 50,
        scale: 1.5,
        rotation: 15,
        duration: 3,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
    }
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: -10,
        backgroundColor: "#0d0126", // fundo escuro só pra você ver o círculo
      }}
    >
      <div
        ref={circleRef}
        style={{
          position: "absolute",
          top: 100,
          left: 100,
          width: 200,
          height: 200,
          borderRadius: "50%",
          backgroundColor: "rgba(59, 130, 246, 0.3)", // azul claro translúcido
          filter: "blur(30px)",
        }}
      />
    </div>
  );
}
