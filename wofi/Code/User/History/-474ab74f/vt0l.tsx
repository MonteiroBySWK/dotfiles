import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef, useState, useEffect } from "react";

export default function BackgroundParticles() {
  const [caoticMode, setCaoticMode] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const caoticModeRef = useRef(caoticMode);

  useEffect(() => {
    caoticModeRef.current = caoticMode;
  }, [caoticMode]);

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
        this.colorNormal = `hsla(${hueNormal}, ${satNormal}%, ${lightNormal}%, ${Math.random() * 0.5 + 0.2})`;

        const hueChaotic = Math.random() * 40;
        const satChaotic = Math.floor(Math.random() * 30) + 70;
        const lightChaotic = Math.floor(Math.random() * 20) + 50;
        this.colorChaotic = `hsla(${hueChaotic}, ${satChaotic}%, ${lightChaotic}%, ${Math.random() * 0.5 + 0.2})`;
      }

      update() {
        if (!canvas) return;

        // Comportamento normal de repulsão do mouse
        if (!caoticModeRef.current) {
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
        } else {
          // Comportamento caótico: repulsão inversa (atração) ou maior força
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const influenceRadius = 200;
          if (distance < influenceRadius) {
            const angle = Math.atan2(dy, dx);
            const force = ((influenceRadius - distance) / influenceRadius) * -5.0; // Negativo para atração
            const forceX = Math.cos(angle) * force;
            const forceY = Math.sin(angle) * force;
            this.x += forceX;
            this.y += forceY;
          }
        }

        // Movimento com base na velocidade e rolagem
        this.x -= this.speedX * scrollVelocity;
        this.y -= this.speedY * scrollVelocity;

        // Comportamento caótico: movimento aleatório adicional
        if (caoticModeRef.current) {
          this.x += (Math.random() - 0.5) * 2;
          this.y += (Math.random() - 0.5) * 2;
        }

        // Limites da tela
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

    const cellSize = 50; // Tamanho da célula para o grid
    const grid = new Map();

    const animate = () => {
      // Criação de rastros no modo caótico
      const bgParticles = caoticModeRef.current ? "rgba(13, 1, 38, 0.05)" : "rgba(13, 1, 38, 1)";
      ctx.fillStyle = bgParticles;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Limpar e reconstruir o grid para cada frame
      grid.clear();
      particles.forEach(p => {
        const cellX = Math.floor(p.x / cellSize);
        const cellY = Math.floor(p.y / cellSize);
        const key = `${cellX},${cellY}`;

        if (!grid.has(key)) {
          grid.set(key, []);
        }
        grid.get(key).push(p);
      });

      // Iterar e atualizar as partículas
      particles.forEach((p1) => {
        p1.update();
        
        // Interação de repulsão entre partículas no modo caótico usando o grid
        if (caoticModeRef.current) {
          const cellX = Math.floor(p1.x / cellSize);
          const cellY = Math.floor(p1.y / cellSize);

          for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
              const neighborKey = `${cellX + i},${cellY + j}`;
              
              if (grid.has(neighborKey)) {
                const neighbors = grid.get(neighborKey);
                
                neighbors.forEach(p2 => {
                  if (p1 !== p2) {
                    const dx = p1.x - p2.x;
                    const dy = p1.y - p2.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < cellSize) {
                      const angle = Math.atan2(dy, dx);
                      const force = (cellSize - distance) / cellSize * 0.5; // Força ajustada
                      p1.x += Math.cos(angle) * force;
                      p1.y += Math.sin(angle) * force;
                    }
                  }
                });
              }
            }
          }
        }
        
        ctx.fillStyle = caoticModeRef.current ? p1.colorChaotic : p1.colorNormal;
        p1.draw();
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

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full -z-10 bg-body"
      />
      <button
        className="fixed top-4 right-4 z-50 backdrop-blur-sm text-white font-bold py-2 px-4 bg-primary/40 transition-transform hover:scale-105"
        onClick={() => {
          setCaoticMode(!caoticMode);
        }}
      >
        {caoticMode ? "Modo Caótico" : "Modo Normal"}
      </button>
    </>
  );
}