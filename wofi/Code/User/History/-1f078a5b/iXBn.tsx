import { useState, useRef, useEffect } from "react";

type Event = {
  date: string;
  title: string;
  description: string;
  // de 0 a 1, posição ao longo do caminho
  t: number;
};

const events: Event[] = [
  { date: "Mai/2023", title: "Fundação TheraLabs", description: "Coordenei laboratório...", t: 0.1 },
  { date: "Ago/2023", title: "TechnosJR",     description: "Desenvolvi ERP...",      t: 0.4 },
  { date: "Jan/2024", title: "CI/CD",          description: "Implementei pipelines...", t: 0.6 },
  { date: "2025",     title: "Jovem Tech",     description: "Previsão de demanda...",  t: 0.9 },
];

export default function CurvedTimeline() {
  const [hovered, setHovered] = useState<number | null>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [points, setPoints] = useState<{ x: number; y: number }[]>([]);

  // ao montar, amostramos alguns pontos ao longo do path SVG
  useEffect(() => {
    if (!pathRef.current) return;
    const total = pathRef.current.getTotalLength();
    const pts = events.map(ev => {
      const pt = pathRef.current!.getPointAtLength(ev.t * total);
      return { x: pt.x, y: pt.y };
    });
    setPoints(pts);
  }, []);

  return (
    <section className="w-full h-64 relative overflow-hidden">
      <h2 className="text-2xl font-bold mb-4 text-center">Linha do Tempo Curva</h2>

      <svg
        className="absolute inset-0"
        viewBox="0 0 800 200"
        preserveAspectRatio="none"
      >
        {/* curva cúbica de Bezier */}
        <path
          ref={pathRef}
          d="M50 150 C200 20, 400 180, 750 50"
          fill="none"
          stroke="#CBD5E0"
          strokeWidth="4"
        />
      </svg>

      {/* pontos sobre o SVG */}
      {points.map((pt, idx) => (
        <div
          key={idx}
          className="absolute"
          style={{
            left: `${(pt.x / 800) * 100}%`,
            top: `${(pt.y / 200) * 100}%`,
          }}
          onMouseEnter={() => setHovered(idx)}
          onMouseLeave={() => setHovered(null)}
        >
          {/* marcador */}
          <div className="w-5 h-5 bg-blue-500 rounded-full border-2 border-white shadow-lg" />

          {/* data fixa */}
          <div className="mt-1 text-xs text-gray-600 text-center -translate-x-1/2">
            {events[idx].date}
          </div>

          {/* tooltip */}
          {hovered === idx && (
            <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-full w-48 p-2 bg-white border rounded shadow-lg text-sm">
              <div className="font-medium">{events[idx].title}</div>
              <div className="text-xs text-gray-500">{events[idx].date}</div>
              <div className="mt-1">{events[idx].description}</div>
            </div>
          )}
        </div>
      ))}
    </section>
  );
}
