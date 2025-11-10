import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef, useState, useEffect } from "react";
import { useInView } from "../hooks/useInView";
import { prefersReducedMotion } from "../utils/motion";

export default function BackgroundParticles() {
  const [caoticMode, setCaoticMode] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const caoticModeRef = useRef(caoticMode);
  const { ref: inViewRef, isInView } = useInView(0.05);

  useEffect(() => {
    caoticModeRef.current = caoticMode;
  }, [caoticMode]);

  useGSAP(() => {
  if (prefersReducedMotion()) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    setCanvasDimensions();
    window.addEventListener("resize", setCanvasDimensions);

  const mouse = { x: 0, y: 0 };
    let scrollVelocity = 1;
    let scrollTimeout: number | NodeJS.Timeout;
  let mouseRaf: number | null = null;

    const handleMouseMove = (event: MouseEvent) => {
      if (mouseRaf !== null) return;
      mouseRaf = requestAnimationFrame(() => {
        mouse.x = event.clientX;
        mouse.y = event.clientY;
        mouseRaf = null;
      });
    };

    const handleScroll = () => {
      scrollVelocity = 100;

      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        gsap.to(
          { val: scrollVelocity },
          {
            val: 1,
            duration: 2,
            onUpdate() {
              scrollVelocity = (this.targets() as any)[0].val;
            },
          }
        );
      }, 100);
    };

  if (window.innerWidth > 768) window.addEventListener("mousemove", handleMouseMove);
  window.addEventListener("scroll", handleScroll);

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      colorNormal: string;
      colorChaotic: string;

      constructor() {
        this.x = Math.random() * (canvas?.width || 0);
        this.y = Math.random() * (canvas?.height || 0);
        this.size = Math.random() * 2 + 0.5;
        this.speedX = Math.random() * 0.2 - 0.1;
        this.speedY = Math.random() * 0.2 - 0.1;

        const hueNormal = Math.floor(Math.random() * 40) + 220;
        const satNormal = Math.floor(Math.random() * 30) + 50;
        const lightNormal = Math.floor(Math.random() * 20) + 40;
        this.colorNormal = `hsla(${hueNormal}, ${satNormal}%, ${lightNormal}%, ${
          Math.random() * 0.5 + 0.2
        })`;

        const hueChaotic = Math.random() * 40;
        const satChaotic = Math.floor(Math.random() * 30) + 70;
        const lightChaotic = Math.floor(Math.random() * 20) + 50;
        this.colorChaotic = `hsla(${hueChaotic}, ${satChaotic}%, ${lightChaotic}%, ${
          Math.random() * 0.5 + 0.2
        })`;
      }

      update() {
        if (!canvas) return;

        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const influenceRadius = 200;

        if (distance < influenceRadius) {
          const angle = Math.atan2(dy, dx);
          const force = ((influenceRadius - distance) / influenceRadius) * 2.5;
          const forceX = Math.cos(angle) * force * 0.5;
          const forceY = Math.sin(angle) * force * 0.5;

          this.x += forceX;
          this.y += forceY;
        }

        if (caoticModeRef.current) {
          this.x += (Math.random() - 0.5) * 5; // Movimento aleatório mais forte
          this.y += (Math.random() - 0.5) * 5;
          this.x += this.speedX * 10; // Aumentar a velocidade base
          this.y += this.speedY * 10;
        } else {
          this.x += this.speedX;
          this.y += this.speedY;
        }

        this.x -= this.speedX * scrollVelocity;
        this.y -= this.speedY * scrollVelocity;

        if (this.x > canvas.width) this.x = 0;
        else if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        else if (this.y < 0) this.y = canvas.height;
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const particles: Particle[] = [];
    const particleCount = window.innerWidth > 768 ? 200 : 100;
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    let rafId = 0;
    const animate = () => {
      // don't run when document is hidden or component is not in view
      if (typeof document !== "undefined" && document.hidden) return;
      if (!isInView) return;

      const bgParticles = caoticModeRef.current
        ? "rgba(13, 1, 38, 0)"
        : "rgba(13, 1, 38, 1)";
      ctx.fillStyle = bgParticles;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.update();

        ctx.fillStyle = caoticModeRef.current
          ? particle.colorChaotic
          : particle.colorNormal;

        particle.draw();
      });

      rafId = requestAnimationFrame(animate);
    };

    // start animation only if in view and page visible
    if (!(typeof document !== "undefined" && document.hidden) && isInView) {
      animate();
    }

    return () => {
      window.removeEventListener("resize", setCanvasDimensions);
      if (window.innerWidth > 768) window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      if (typeof rafId === "number") cancelAnimationFrame(rafId);
      if (mouseRaf) cancelAnimationFrame(mouseRaf);
      clearTimeout(scrollTimeout as number);
    };
  }, [isInView]);

  return (
    <>
      <div ref={inViewRef} className="fixed inset-0 -z-10 hidden lg:block">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none bg-body"
        />
      </div>
      <button
        className="fixed top-4 right-4 z-50 backdrop-blur-sm text-white font-bold py-2 px-4 bg-primary/40 transition-transform hover:scale-105"
        onClick={() => {
          setCaoticMode(!caoticMode);
        }}
      >
        {caoticMode ? "¿" : "?"}
      </button>
    </>
  );
}
