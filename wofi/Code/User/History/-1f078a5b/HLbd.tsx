import { useState } from "react";

type Event = {
  date: string;
  title: string;
  description: string;
  position: number; // em % na barra
};

const events: Event[] = [
  {
    date: "Mai/2023",
    title: "Fundação TheraLabs",
    description:
      "Coordenei laboratório de desenvolvimento como PO & líder técnico.",
    position: 10,
  },
  {
    date: "Ago/2023",
    title: "TechnosJR (Voluntário)",
    description:
      "Desenvolvi ERP modular em Django, dashboards e autenticação OWASP.",
    position: 40,
  },
  {
    date: "Jan/2024",
    title: "Início CI/CD",
    description:
      "Implementei pipelines de deploy com Docker, Railway e Vercel.",
    position: 60,
  },
  {
    date: "2025",
    title: "Grupo Mateus",
    description:
      "Previsão de demanda via séries temporais e automação de relatórios.",
    position: 90,
  },
];

export default function VisualTimeline() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section className="w-full px-6 py-12">
      <h2 className="text-2xl font-bold mb-8 text-center">
        Linha do Tempo Visual
      </h2>

      <div
        className="relative h-2 bg-gray-300 rounded-full mx-auto"
        style={{ maxWidth: "800px" }}
      >
        {events.map((ev, idx) => (
          <div
            key={idx}
            className="absolute top-1/2 -translate-y-1/2 left-0"
            style={{ left: `${ev.position}%` }}
          >
            {/* Ponto */}
            <div
              className="w-4 h-4 bg-blue-500 rounded-full cursor-pointer relative group"
              onMouseEnter={() => setHovered(idx)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* Tooltip */}
              <div
                className={`
                  absolute bottom-full mb-4 left-1/2 -translate-x-1/2
                  w-48 p-3 bg-white border border-gray-200 rounded shadow-lg
                  text-sm text-gray-800 opacity-0 pointer-events-none
                  transition-opacity duration-200
                  ${hovered === idx ? "opacity-100 pointer-events-auto" : ""}
                `}
              >
                <div className="font-medium">{ev.title}</div>
                <div className="text-xs text-gray-500">{ev.date}</div>
                <div className="mt-1">{ev.description}</div>
              </div>
            </div>

            {/* Data fixa abaixo do ponto */}
            <div className="mt-2 text-xs text-gray-600 text-center w-16 -translate-x-1/2 absolute left-1/2">
              {ev.date}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
