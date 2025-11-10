import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import {
  forwardRef,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { type MilestoneType } from "../constants/MillestoneData";

export const milestoneData: MilestoneType[] = [
  {
    date: new Date("2019-01-01"),
    content:
      "Iniciei meus estudos em programação, aprendendo lógica e os fundamentos da computação.",
  },
  {
    date: new Date("2022-01-01"),
    content:
      "Aprendi Python e comecei a usar Bash e Linux no dia a dia. Criei scripts para automação.",
  },
  {
    date: new Date("2023-01-01"),
    content:
      "Dominei JavaScript/TypeScript, Next.js e TailwindCSS. Passei a desenvolver aplicações web modernas.",
  },
  {
    date: new Date("2023-05-01"),
    content:
      "Me envolvi com DevOps: comecei a usar Docker, Railway, Vercel e explorei CI/CD e monitoramento.",
  },
  {
    date: new Date("2023-07-01"),
    content:
      "Entrei no laboratório de desenvolvimento da faculdade e me tornei coordenador de equipe.",
  },
  {
    date: new Date("2023-09-01"),
    content:
      "Desenvolvi um sistema multiplataforma para a empresa júnior Technos usando Django + PostgreSQL.",
  },
  {
    date: new Date("2024-01-01"),
    content:
      "Iniciei a migração do sistema da Technos para uma arquitetura de microsserviços com Java e Spring.",
  },
  {
    date: new Date("2024-04-01"),
    content:
      "Comecei a liderar projetos reais com Next.js no front-end e Spring Boot no back-end.",
  },
  {
    date: new Date("2024-06-24"),
    content:
      "Participei de um desafio de ciência de dados no Grupo Mateus, usando séries temporais para previsão de demanda.",
  },
  {
    date: new Date("2024-07-01"),
    content:
      "Criei um portfólio profissional com identidade visual própria: 'MonteiroBySWK'.",
  },
  {
    date: new Date("2024-07-10"),
    content:
      "Formalizei a criação de uma empresa de desenvolvimento de software sob demanda.",
  },
  {
    date: new Date("2025-01-01"),
    content:
      "Me aprofundei em segurança de aplicações com JWT, OAuth2, OWASP, CORS, XSS, etc.",
  },
  {
    date: new Date("2025-03-01"),
    content:
      "Iniciei o estudo de computação gráfica, compiladores e emuladores em Rust/C para aprendizado profundo.",
  },
  {
    date: new Date("2025-07-28"),
    content:
      "Comecei a estudar Linguagens Formais e Autômatos para reforçar fundamentos teóricos da computação.",
  },
];

const Tooltip = forwardRef<HTMLDivElement, { children: React.ReactNode }>(
  ({ children }, ref) => {
    return (
      <div
        className="bg-card border-b border-primary/80 text-xs font-light p-2 w-40 md:w-52 shadow"
        ref={ref}
      >
        {children}
      </div>
    );
  }
);

Tooltip.displayName = "Tooltip";

const TimePoint = forwardRef<HTMLDivElement, { data: MilestoneType }>(
  ({ data }, ref) => {
    const [visibleTooltip, setVisibleTooltip] = useState(false);
    const tooltipRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
      if (tooltipRef.current && visibleTooltip) {
        gsap.fromTo(
          tooltipRef.current,
          { opacity: 0, y: -10 },
          { opacity: 1, y: 0, duration: 0.3 }
        );
      }
    }, [visibleTooltip]);

    const handleMouseEnter = () => {
      setVisibleTooltip(true);
      if (ref && typeof ref !== "function") {
        gsap.to(ref.current, {
          width: "20px",
          height: "20px",
          duration: 0.1,
        });
      }
    };

    const handleMouseLeave = () => {
      if (ref && typeof ref !== "function") {
        gsap.to(ref.current, {
          width: "16px",
          height: "16px",
          duration: 0.1,
        });
      }
      gsap.to(tooltipRef.current, {
        opacity: 0,
        y: -10,
        duration: 0.3,
        onComplete: () => setVisibleTooltip(false),
      });
    };

    const formatador = new Intl.DateTimeFormat("pt-BR", {
      month: "long",
      year: "numeric",
    });

    return (
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="flex flex-col items-center relative duration-300 border-b border-b-transparent hover:border-b-primary"
      >
        {visibleTooltip && (
          <div className="absolute bottom-10">
            <Tooltip ref={tooltipRef}>{data.content}</Tooltip>
          </div>
        )}
        <div
          ref={ref}
          className="rounded-full bg-primary size-4 transition-all duration-200 bottom-7 absolute hover:size-5 will-change-auto"
        />
        <span className="text-xs md:text-sm pt-1 text-center">
          {formatador.format(data.date).replace(" de ", ", ")}
        </span>
      </div>
    );
  }
);

TimePoint.displayName = "TimePoint";

type Line = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

export default function StoryTelling() {
  const pointRefs = milestoneData.map(() => useRef<HTMLDivElement>(null));
  const [lines, setLines] = useState<Line[]>([]);
  const [ready, setReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setReady(true);
  }, []);

  useLayoutEffect(() => {
    if (!ready || !containerRef.current) return;

    const updateLines = () => {
      const container = containerRef.current;
      if (!container) return;
      const containerRect = container.getBoundingClientRect();

      const positions = pointRefs.map((ref) => {
        const el = ref.current;
        if (!el) return null;
        const rect = el.getBoundingClientRect();
        return {
          x: rect.left + rect.width / 2 - containerRect.left,
          y: rect.top + rect.height / 2 - containerRect.top,
        };
      });

      const newLines: Line[] = [];
      for (let i = 0; i < positions.length - 1; i++) {
        if (positions[i] && positions[i + 1]) {
          newLines.push({
            x1: positions[i]!.x,
            y1: positions[i]!.y,
            x2: positions[i + 1]!.x,
            y2: positions[i + 1]!.y,
          });
        }
      }
      setLines(newLines);
    };

    updateLines();

    window.addEventListener("resize", updateLines);
    const currentContainer = containerRef.current;
    if (currentContainer) {
      currentContainer.addEventListener("scroll", updateLines, true);
    }

    return () => {
      window.removeEventListener("resize", updateLines);
      if (currentContainer) {
        currentContainer.removeEventListener("scroll", updateLines, true);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  const [chunkSize, setChunkSize] = useState(6);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setChunkSize(2);
      } else if (window.innerWidth < 1024) {
        setChunkSize(3);
      } else {
        setChunkSize(6);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const chunked = [];
  for (let i = 0; i < milestoneData.length; i += chunkSize) {
    chunked.push(milestoneData.slice(i, i + chunkSize));
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full p-4 md:p-8 space-y-16 md:space-y-20"
    >
      <svg
        className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none"
        aria-hidden="true"
      >
        {lines.map((line, idx) => (
          <line
            key={idx}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke="var(--color-primary)"
            strokeWidth="1"
          />
        ))}
      </svg>

      {chunked.map((row, rowIndex) => {
        const isOdd = rowIndex % 2 === 1;
        const items = isOdd ? [...row].reverse() : row;

        return (
          <div
            key={rowIndex}
            className={`grid gap-8 md:gap-12 lg:gap-20 w-full relative z-10 ${
              isOdd ? "direction-rtl" : ""
            }`}
            style={{
              gridTemplateColumns: `repeat(${chunkSize}, minmax(0, 1fr))`,
            }}
          >
            {items.map((e, i) => {
              const originalIndex = isOdd
                ? rowIndex * chunkSize + (chunkSize - 1 - i)
                : rowIndex * chunkSize + i;
              return (
                <TimePoint
                  key={originalIndex}
                  ref={pointRefs[originalIndex]}
                  data={e}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
