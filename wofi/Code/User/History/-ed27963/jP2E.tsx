"use cli  const pcFrames = [
    "use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [currentFrame, setCurrentFrame] = useState(0);

  // Simple loading ASCII frames
  const pcFrames = [
    `    ╔═══════════════════════════╗
    ║                           ║
    ║    CARREGANDO NOVO        ║
    ║    VISUAL...              ║
    ║                           ║
    ║    [█░░░░░░░░░] 10%       ║
    ║                           ║
    ║    > Codando sistemas     ║
    ║    > Desenhando UI        ║
    ║    > Otimizando...        ║
    ║                           ║
    ╚═══════════════════════════╝`,
    `    ╔═══════════════════════════╗
    ║                           ║
    ║    CARREGANDO NOVO        ║
    ║    VISUAL...              ║
    ║                           ║
    ║    [███░░░░░░░] 30%       ║
    ║                           ║
    ║    > Codando sistemas     ║
    ║    > Criando components   ║
    ║    > Testando APIs        ║
    ║                           ║
    ╚═══════════════════════════╝`,
    `    ╔═══════════════════════════╗
    ║                           ║
    ║    CARREGANDO NOVO        ║
    ║    VISUAL...              ║
    ║                           ║
    ║    [██████░░░░] 60%       ║
    ║                           ║
    ║    > Finalizando layout   ║
    ║    > Ajustando cores      ║
    ║    > Polindo detalhes     ║
    ║                           ║
    ╚═══════════════════════════╝`,
    `    ╔═══════════════════════════╗
    ║                           ║
    ║    NOVO VISUAL            ║
    ║    QUASE PRONTO!          ║
    ║                           ║
    ║    [█████████░] 90%       ║
    ║                           ║
    ║    > Deploy em breve      ║
    ║    > Últimos ajustes      ║
    ║    > Aguarde...           ║
    ║                           ║
    ╚═══════════════════════════╝`
  ];`,ffect, useState } from "react";

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [currentFrame, setCurrentFrame] = useState(0);

  // Simple loading ASCII frames
  const pcFrames = [
    `    ╔═══════════════════════════════════╗
    ║  ┌─────────────────────────────┐    ║
    ║  │ ╔═════════════════════════╗ │    ║
    ║  │ ║ > THERA LABS TERMINAL   ║ │    ║
    ║  │ ║ > Version 2.0.1         ║ │    ║
    ║  │ ║                         ║ │    ║
    ║  │ ║ Initializing system...  ║ │    ║
    ║  │ ║ Loading modules ▌       ║ │    ║
    ║  │ ║                         ║ │    ║
    ║  │ ║ Progress: ████░░░░░░ 40% ║ │    ║
    ║  │ ╚═════════════════════════╝ │    ║
    ║  └─────────────────────────────┘    ║
    ║ ┌─┐┌─┐┌─┐                   ╔═══╗  ║
    ║ │◉││●││▮│  [PWR][HDD][USB]  ║FAN║  ║
    ║ └─┘└─┘└─┘                   ╚═══╝  ║
    ╚═══════════════════════════════════╝
         ║ ║ ║ ║ ║ ║ ║ ║ ║ ║ ║ ║
         ╚═╩═╩═╩═╩═╩═╩═╩═╩═╩═╩═╩═╝`,
    `    ╔═══════════════════════════════════╗
    ║  ┌─────────────────────────────┐    ║
    ║  │ ╔═════════════════════════╗ │    ║
    ║  │ ║ > THERA LABS TERMINAL   ║ │    ║
    ║  │ ║ > Version 2.0.1         ║ │    ║
    ║  │ ║                         ║ │    ║
    ║  │ ║ Loading frameworks...   ║ │    ║
    ║  │ ║ Compiling assets █      ║ │    ║
    ║  │ ║                         ║ │    ║
    ║  │ ║ Progress: ██████░░░░ 60% ║ │    ║
    ║  │ ╚═════════════════════════╝ │    ║
    ║  └─────────────────────────────┘    ║
    ║ ┌─┐┌─┐┌─┐                   ╔═══╗  ║
    ║ │◉││●││▮│  [PWR][HDD][USB]  ║FAN║  ║
    ║ └─┘└─┘└─┘                   ╚═══╝  ║
    ╚═══════════════════════════════════╝
         ║ ║ ║ ║ ║ ║ ║ ║ ║ ║ ║ ║
         ╚═╩═╩═╩═╩═╩═╩═╩═╩═╩═╩═╝`,
    `    ╔═══════════════════════════════════╗
    ║  ┌─────────────────────────────┐    ║
    ║  │ ╔═════════════════════════╗ │    ║
    ║  │ ║ > THERA LABS TERMINAL   ║ │    ║
    ║  │ ║ > Version 2.0.1         ║ │    ║
    ║  │ ║                         ║ │    ║
    ║  │ ║ Optimizing database...  ║ │    ║
    ║  │ ║ Connecting services ██  ║ │    ║
    ║  │ ║                         ║ │    ║
    ║  │ ║ Progress: ████████░░ 80% ║ │    ║
    ║  │ ╚═════════════════════════╝ │    ║
    ║  └─────────────────────────────┘    ║
    ║ ┌─┐┌─┐┌─┐                   ╔═══╗  ║
    ║ │◉││●││▮│  [PWR][HDD][USB]  ║FAN║  ║
    ║ └─┘└─┘└─┘                   ╚═══╝  ║
    ╚═══════════════════════════════════╝
         ║ ║ ║ ║ ║ ║ ║ ║ ║ ║ ║ ║
         ╚═╩═╩═╩═╩═╩═╩═╩═╩═╩═╩═╝`,
    `    ╔═══════════════════════════════════╗
    ║  ┌─────────────────────────────┐    ║
    ║  │ ╔═════════════════════════╗ │    ║
    ║  │ ║ > THERA LABS TERMINAL   ║ │    ║
    ║  │ ║ > Version 2.0.1         ║ │    ║
    ║  │ ║                         ║ │    ║
    ║  │ ║ ✓ All systems online    ║ │    ║
    ║  │ ║ ✓ Ready for deployment  ║ │    ║
    ║  │ ║                         ║ │    ║
    ║  │ ║ Status: ██████████ READY║ │    ║
    ║  │ ╚═════════════════════════╝ │    ║
    ║  └─────────────────────────────┘    ║
    ║ ┌─┐┌─┐┌─┐                   ╔═══╗  ║
    ║ │◉││●││▮│  [PWR][HDD][USB]  ║FAN║  ║
    ║ └─┘└─┘└─┘                   ╚═══╝  ║
    ╚═══════════════════════════════════╝
         ║ ║ ║ ║ ║ ║ ║ ║ ║ ║ ║ ║
         ╚═╩═╩═╩═╩═╩═╩═╩═╩═╩═╩═╝`,
  ];

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFrame((prev) => (prev + 1) % pcFrames.length);
    }, 1200);
    return () => clearInterval(interval);
  }, [pcFrames.length]);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-6 text-center font-mono">
      {/* Strong base gradient background */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#8937E6]/30 via-black to-[#0069CC]/30" />

      {/* Enhanced mouse interaction */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40 transition-all duration-500 ease-out"
        style={{
          background: `radial-gradient(700px 500px at ${mousePosition.x}% ${mousePosition.y}%, rgba(137,55,230,0.3) 0%, rgba(0,105,204,0.25) 35%, transparent 65%)`,
        }}
      />

      {/* Ambient pulse overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(137,55,230,0.1)_0%,_transparent_50%)] animate-pulse" />

      <div className="relative z-10 space-y-8">
        {/* Loading ASCII Animation */}
        <div className="mx-auto transform transition-all duration-300 hover:scale-[1.02]">
          <pre className="text-sm leading-tight text-[#8937E6] drop-shadow-[0_0_10px_rgba(137,55,230,0.6)] transition-all duration-300 hover:brightness-110 md:text-base lg:text-lg selection:bg-[#8937E6]/10 whitespace-pre">
            {pcFrames[currentFrame]}
          </pre>
        </div>

        {/* Main title with typing animation */}
        <div className="space-y-4">
          <h1 className="animate-fade-in bg-gradient-to-r from-[#F7F7F7] via-[#8937E6] to-[#0069CC] bg-clip-text text-4xl font-medium tracking-tight text-transparent transition-all duration-300 hover:tracking-normal md:text-6xl">
            thera | Software House{" "}
          </h1>

          {/* Animated underline */}
          <div className="mx-auto h-[2px] w-0 animate-expand-width bg-gradient-to-r from-[#8937E6] to-[#0069CC] transition-all duration-1000" />
        </div>
      </div>
    </div>
  );
}
