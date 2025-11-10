import { useState, useRef, useEffect } from "react";

export type TimelineEvent = {
  /** Texto que aparece sob o ponto */
  date: string;
  /** Título no tooltip */
  title: string;
  /** Descrição no tooltip */
  description: string;
  /** Posição percentual ao longo da curva (0 a 1) */
  t: number;
};

/**
 * Props:
 * - events: lista de objetos { date, title, description, t }
 * - width, height: dimensões do SVG (em px) — o componente se ajusta em responsivo
 * - pathD: string do atributo `d` do <path> (curva)
 */
export function CurvedTimeline({
  events,
  width = 800,
  height = 200,
  pathD = "M20 150 C200 20, 400 180, 780 50",
}: {
  events: TimelineEvent[];
  width?: number;
  height?: number;
  pathD?: string;
}) {
  const [hovered, setHovered] = useState<number | null>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [points, setPoints] = useState<{ x: number; y: number }[]>([]);

  // Calcula as coordenadas exatas de cada evento ao longo do path SVG
  useEffect(() => {
    if (!pathRef.current) return;
    const totalLen = pathRef.current.getTotalLength();
    const pts = events.map(ev => {
      const { x, y } = pathRef.current!.getPointAtLength(ev.t * totalLen);
      return { x, y };
    });
    setPoints(pts);
  }, [events]);

  return (
    <section className="w-full py-12 px-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Linha do Tempo</h2>

      <div className="relative w-full" style={{ paddingTop: `${(height / width) * 100}%` }}>
        {/* SVG de fundo */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="none"
        >
          <path
            ref={pathRef}
            d={pathD}
            fill="none"
            stroke="#CBD5E0"
            strokeWidth="4"
          />
        </svg>

        {/* Marcadores e tooltips */}
        {points.map((pt, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              left: `${(pt.x / width) * 100}%`,
              top: `${(pt.y / height) * 100}%`,
              transform: "translate(-50%, -50%)",
            }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            {/* Ponto */}
            <div className="w-5 h-5 bg-blue-500 rounded-full border-2 border-white shadow-md" />

            {/* Data fixa */}
            <div className="mt-2 text-xs text-gray-600 text-center">
              {events[i].date}
            </div>

            {/* Tooltip */}
            {hovered === i && (
              <div className="absolute left-1/2 bottom-full mb-4 -translate-x-1/2 w-56 p-3 bg-white border border-gray-200 rounded shadow-lg text-sm">
                <div className="font-medium">{events[i].title}</div>
                <div className="text-xs text-gray-500">{events[i].date}</div>
                <div className="mt-1">{events[i].description}</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
