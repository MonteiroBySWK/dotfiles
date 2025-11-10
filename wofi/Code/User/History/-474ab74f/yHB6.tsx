import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";

export default function BackgroundParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useGSAP(() => {
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

    const handleMouseMove = (event: MouseEvent) => {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
    };

    const handleScroll = () => {
      scrollVelocity = 100; // acelera ao scrollar

      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        gsap.to(
          { val: scrollVelocity },
          {
            val: 1,
            duration: 2, //1
            onUpdate() {
              scrollVelocity = (this.targets() as any)[0].val;
            },
          }
        );
      }, 100);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;

      constructor() {
        this.x = Math.random() * (canvas?.width || 0);
        this.y = Math.random() * (canvas?.height || 0);
        this.size = Math.random() * 2 + 0.5; // random() * 1.5 + 0.5
        this.speedX = Math.random() * 0.2 - 0.1;
        this.speedY = Math.random() * 0.2 - 0.1;

        //   const hue = Math.floor(Math.random() * 40) + 250; // + 250
        //   const saturation = Math.floor(Math.random() * 30) + 50; // + 50
        //const lightness = Math.floor(Math.random() * 20) + 40; // + 40

        const hue = 250;
        const saturation = 250;
        const lightness = 250;

        this.color = `hsla(${hue}, ${saturation}%, ${lightness}%, ${
          Math.random() * 0.3 + 0.1
        })`;
      }

      update() {
        if (!canvas) return;

        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const influenceRadius = 200; //100

        if (distance < influenceRadius) {
          const angle = Math.atan2(dy, dx);
          const force = ((influenceRadius - distance) / influenceRadius) * 2.5;
          const forceX = Math.cos(angle) * force * 0.5;
          const forceY = Math.sin(angle) * force * 0.5;

          this.x += forceX;
          this.y += forceY;
        }

        this.x -= this.speedX * scrollVelocity;
        this.y -= this.speedY * scrollVelocity;

        // Wrap around
        if (this.x > canvas.width) this.x = 0;
        else if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        else if (this.y < 0) this.y = canvas.height;
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const particles: Particle[] = [];
    const particleCount = Math.random() * 200;

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const animate = () => {
      ctx.fillStyle = "rgba(13, 1, 38, 1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.update();
        particle.draw();
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", setCanvasDimensions);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  gsap.fromTo(canvasRef.current, { opacity: 0 }, { opacity: 1, duration: 1 });

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-1 bg-body"
    >
      <button className="absolute top-0 right-0">Caotic</button>

    </canvas>
  );
}
