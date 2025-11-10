import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useInView } from "../hooks/useInView";

export default function Waves() {
  const canvasRefs = [
    useRef<HTMLCanvasElement>(null),
    useRef<HTMLCanvasElement>(null),
    useRef<HTMLCanvasElement>(null),
  ];
  const phases = [0, 0, 0];
  const speeds = [0.02, 0.015, 0.01];
  const amplitudes = [30, 45, 60];
  const frequencies = [0.02, 0.015, 0.01];
  const { ref: inViewRef, isInView } = useInView(0.02);

  useGSAP(() => {
    const ctxsUnfiltered = canvasRefs
      .map((r) => (r.current ? r.current.getContext("2d") : null));
    const ctxs = ctxsUnfiltered.filter(
      (c): c is CanvasRenderingContext2D => c !== null
    );

    if (ctxs.length === 0) return;

    // 1. Crie uma função para aplicar os estilos
    const applyStyles = () => {
      ctxs.forEach((ctx, i) => {
        ctx.strokeStyle = "#4ade80";
        ctx.lineWidth = 1.5 + i * 0.5;
        ctx.globalAlpha = 0.3 + i * 0.2; // 0.3, 0.5, 0.7
      });
    };

    const resize = () => {
      canvasRefs.forEach((r) => {
        if (!r.current) return;
        r.current.width = window.innerWidth;
        r.current.height = window.innerHeight;
      });
      // 3. E chame novamente aqui após o reset!
      applyStyles();
    };

    resize(); // A chamada inicial já vai aplicar os estilos através do applyStyles()
    window.addEventListener("resize", resize);

    // choose step size based on device width to reduce work on mobile
    const xStep = window.innerWidth < 768 ? 4 : 2;

    const drawWave = (
      ctx: CanvasRenderingContext2D,
      phase: number,
      amplitude: number,
      frequency: number
    ) => {
      const { width, height } = ctx.canvas;
      const mid = height / 2;
      ctx.clearRect(0, 0, width, height);
      ctx.beginPath();
      for (let x = 0; x <= width; x += xStep) {
        const y = mid + Math.sin(x * frequency + phase) * amplitude;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    };

    // 2. Remova a aplicação de estilos daqui, pois já está na função applyStyles
    // que é chamada por resize() na linha 53.

    const tick = () => {
      // pause if document hidden or not in view
      if (typeof document !== "undefined" && document.hidden) return;
      if (!isInView) return;

      ctxs.forEach((ctx, i) => {
        phases[i] += speeds[i];
        drawWave(ctx, phases[i], amplitudes[i], frequencies[i]);
      });
    };

    gsap.ticker.add(tick);

    return () => {
      try {
        gsap.ticker.remove(tick);
      } catch (e) {
        /* ignore */
      }
      window.removeEventListener("resize", resize);
    };
  }, []); // Adicione um array de dependências vazio para rodar o useEffect apenas uma vez

  return (
    <div ref={inViewRef} className="absolute inset-0 overflow-hidden z-0">
      {canvasRefs.map((ref, i) => (
        <canvas
          key={i}
          ref={ref}
          className="absolute inset-0 pointer-events-none"
        />
      ))}
    </div>
  );
}
