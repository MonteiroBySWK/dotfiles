import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function Waves() {
  const canvasRefs = [
    useRef<HTMLCanvasElement>(null),
    useRef<HTMLCanvasElement>(null),
    useRef<HTMLCanvasElement>(null),
  ];

  // base params (will be scaled/adjusted on resize or reduced-motion)
  const phases = [0, 0, 0];
  const baseSpeeds = [0.02, 0.015, 0.01];
  const baseAmplitudes = [30, 45, 60];
  const baseFrequencies = [0.02, 0.015, 0.01];

  useGSAP(() => {
    // detect low-end devices and reduce number of canvases/work
    const hwConcurrency = (navigator as any).hardwareConcurrency || 4;
    const deviceMemory = (navigator as any).deviceMemory || 4;
    const lowEnd = hwConcurrency <= 2 || deviceMemory <= 1.5;

    // gather contexts; skip any canvases that aren't ready yet.
    const ctxs: CanvasRenderingContext2D[] = [];
    // if lowEnd, prefer a single canvas to reduce work
    const activeRefs = lowEnd ? canvasRefs.slice(0, 1) : canvasRefs;
    for (const r of activeRefs) {
      if (!r.current) continue;
      const ctx = r.current.getContext("2d");
      if (!ctx) continue;
      ctxs.push(ctx);
    }
    if (ctxs.length === 0) return () => {};

    let speeds = [...baseSpeeds];
    let amplitudes = [...baseAmplitudes];
    let frequencies = [...baseFrequencies];

    const prefersReduced =
      typeof window !== "undefined" &&
      !!window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      // reduce animation intensity
      speeds = speeds.map((s) => s * 0.2);
      amplitudes = amplitudes.map((a) => a * 0.5);
      frequencies = frequencies.map((f) => f * 0.7);
    }

    if (lowEnd) {
      // further reduce for low-end devices
      speeds = speeds.map((s) => s * 0.5);
      amplitudes = amplitudes.map((a) => a * 0.6);
      frequencies = frequencies.map((f) => f * 0.8);
    }

    const applyStyles = () => {
      ctxs.forEach((ctx, i) => {
        ctx.strokeStyle = "#4ade80";
        ctx.lineWidth = 1.5 + i * 0.5;
        ctx.globalAlpha = 0.3 + i * 0.2; // 0.3, 0.5, 0.7
      });
    };

    const resize = () => {
      const dpr = Math.max(1, window.devicePixelRatio || 1);
      const width = window.innerWidth;
      const height = window.innerHeight;

      canvasRefs.forEach((r) => {
        if (!r.current) return;
        const canvas = r.current;
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        // scale for high DPI so drawing units remain in CSS pixels
        const ctx = canvas.getContext("2d");
        if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        // make sure the element's CSS size matches the layout so it's visible
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
      });

      applyStyles();
    };

    // initial size + styles
    resize();
    window.addEventListener("resize", resize);

  const getXStep = () => (window.innerWidth < 640 || lowEnd ? 6 : 3);

    const drawWave = (
      ctx: CanvasRenderingContext2D,
      phase: number,
      amplitude: number,
      frequency: number
    ) => {
      const width = ctx.canvas.width / (window.devicePixelRatio || 1);
      const height = ctx.canvas.height / (window.devicePixelRatio || 1);
      const mid = height / 2;
      ctx.clearRect(0, 0, width, height);
      ctx.beginPath();
      const step = getXStep();
      for (let x = 0; x <= width; x += step) {
        const y = mid + Math.sin(x * frequency + phase) * amplitude;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    };

  const tick = () => {
      ctxs.forEach((ctx, i) => {
        phases[i] += speeds[i];
        drawWave(ctx, phases[i], amplitudes[i], frequencies[i]);
      });
    };

  // If reduced motion, we still want a static rendering but no continuous ticker.
  if (!prefersReduced && !lowEnd) gsap.ticker.add(tick);

    const handleVisibility = () => {
      if (document.hidden) {
        if (!prefersReduced) gsap.ticker.remove(tick);
      } else {
        if (!prefersReduced) gsap.ticker.add(tick);
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);

  // initial draw for reduced-motion or to seed canvas
  tick();

    return () => {
      if (!prefersReduced) gsap.ticker.remove(tick);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  const canvasCount = (navigator as any).hardwareConcurrency && ((navigator as any).hardwareConcurrency <= 2) ? 1 : canvasRefs.length;
  return (
    <div className="absolute inset-0 overflow-hidden -z-10">
      {canvasRefs.slice(0, canvasCount).map((ref, i) => (
        <canvas
          key={i}
          ref={ref}
          className="absolute inset-0 pointer-events-none w-full h-full"
        />
      ))}
    </div>
  );
}
