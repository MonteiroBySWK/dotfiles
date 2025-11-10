import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef, useState } from "react";

export default function BackgroundParticles() {
  const [caoticMode, setCaoticMode] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Esta variável não é mais necessária dentro do loop da animação
  // const bgParticles = caoticMode ? "rgba(13, 1, 38, 0)" : "rgba(13, 1, 38, 1)";

  // ✅ PASSO 1: Adicione 'caoticMode' ao array de dependências.
  // Isso fará com que toda a lógica da animação seja reiniciada
  // sempre que o estado 'caoticMode' for alterado.
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
        this.size = Math.random() * 2 + 0.5;
        this.speedX = Math.random() * 0.2 - 0.1;
        this.speedY = Math.random() * 0.2 - 0.1;

        // ✅ PASSO 2: Defina a cor da partícula com base no 'caoticMode'.
        let hue, saturation, lightness;

        if (caoticMode) {
          // Cores para o "Caotic Mode" (tons de vermelho/laranja)
          hue = Math.random() * 40; // 0 a 40 (vermelho/laranja)
          saturation = Math.floor(Math.random() * 30) + 70; // 70% a 100%
          lightness = Math.floor(Math.random() * 20) + 50;  // 50% a 70%
        } else {
          // Cores para o modo normal (tons de azul/roxo)
          hue = Math.floor(Math.random() * 40) + 220; // 220 a 260 (azul/roxo)
          saturation = Math.floor(Math.random() * 30) + 50; // 50% a 80%
          lightness = Math.floor(Math.random() * 20) + 40;  // 40% a 60%
        }

        this.color = `hsla(${hue}, ${saturation}%, ${lightness}%, ${
          Math.random() * 0.5 + 0.2 // Aumentei um pouco a opacidade para ficar mais visível
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

        this.x -= this.speedX * scrollVelocity;
        this.y -= this.speedY * scrollVelocity;

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
    // Aumentei um pouco a contagem de partículas para o efeito ficar mais legal
    const particleCount = window.innerWidth > 768 ? 200 : 100;

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
    
    // Define a cor de fundo do canvas com base no modo
    const bgParticles = caoticMode ? "rgba(13, 1, 38, 0)" : "rgba(13, 1, 38, 1)";

    const animate = () => {
      ctx.fillStyle = bgParticles;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.update();
        particle.draw();
      });

      requestAnimationFrame(animate);
    };

    animate();

    // A função de limpeza do GSAP cuidará de remover os listeners
    // quando o efeito for recriado.
    return () => {
      window.removeEventListener("resize", setCanvasDimensions);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [caoticMode]); // <- AQUI ESTÁ A MUDANÇA PRINCIPAL!

  // Esta animação pode ser movida para dentro do useGSAP
  // para garantir que execute junto com o resto da lógica.
  useGSAP(() => {
    gsap.fromTo(canvasRef.current, { opacity: 0 }, { opacity: 1, duration: 1 });
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full -z-10 bg-body"
      />
      <button
        className="fixed top-4 right-4 z-50 bg-primary/70 backdrop-blur-sm text-white font-bold py-2 px-4 rounded-lg transition-transform hover:scale-105"
        onClick={() => {
          setCaoticMode(!caoticMode);
        }}
      >
        {caoticMode ? "Normal Mode" : "Chaotic Mode"}
      </button>
    </>
  );
}