import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import React, {
  forwardRef,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { type MilestoneType } from "../constants/MillestoneData";

// ==== Dados ====
export const milestoneData: MilestoneType[] = [
  { date: new Date("2019-01-01"), content: "Iniciei meus estudos..." },
  { date: new Date("2022-01-01"), content: "Aprendi Python..." },
  { date: new Date("2023-01-01"), content: "Dominei JavaScript..." },
  { date: new Date("2023-05-01"), content: "Me envolvi com DevOps..." },
  { date: new Date("2023-07-01"), content: "Entrei no laboratório..." },
  { date: new Date("2023-09-01"), content: "Desenvolvi sistema..." },
  { date: new Date("2024-01-01"), content: "Iniciei migração..." },
  { date: new Date("2024-04-01"), content: "Comecei a liderar..." },
  { date: new Date("2024-06-24"), content: "Participei de desafio..." },
  { date: new Date("2024-07-01"), content: "Criei um portfólio..." },
  { date: new Date("2024-07-10"), content: "Formalizei empresa..." },
  { date: new Date("2025-01-01"), content: "Me aprofundei em segurança..." },
  { date: new Date("2025-03-01"), content: "Estudo computação gráfica..." },
  { date: new Date("2025-07-28"), content: "Estudo linguagens formais..." },
];

// ==== Utilitário ====
const formatDate = (date: Date) =>
  new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" })
    .format(date)
    .replace(" de ", ", ");

// ==== Tooltip ====
const Tooltip = forwardRef<HTMLDivElement, { children: React.ReactNode }>(
  ({ children }, ref) => (
    <div
      ref={ref}
      className="bg-card border-b border-primary/80 text-xs font-light p-2 w-50 shadow"
    >
      {children}
    </div>
  )
);
Tooltip.displayName = "Tooltip";

// ==== TimePoint ====
const TimePoint = forwardRef<HTMLDivElement, { data: MilestoneType }>(
  ({ data }, ref) => {
    const [showTooltip, setShowTooltip] = useState(false);
    const tooltipRef = useRef<HTMLDivElement>(null);

    const animateTooltip = useCallback((visible: boolean) => {
      if (!tooltipRef.current) return;
      gsap.to(tooltipRef.current, {
        opacity: visible ? 1 : 0,
        y: visible ? 0 : -10,
        duration: 0.3,
      });
    }, []);

    const animatePoint = useCallback(
      (size: number) => {
        if (ref && typeof ref !== "function" && ref.current) {
          gsap.to(ref.current, { width: size, height: size, duration: 0.1 });
        }
      },
      [ref]
    );

    useGSAP(() => {
      if (ref && typeof ref !== "function" && ref.current) {
        gsap.fromTo(
          ref.current,
          { opacity: 0, scale: 0.5 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.6,
            ease: "back.out(1.7)",
            scrollTrigger: { trigger: ref.current, start: "top 70%" },
          }
        );
      }
    }, []);

    return (
      <div
        onMouseEnter={() => {
          setShowTooltip(true);
          animateTooltip(true);
          animatePoint(20);
        }}
        onMouseLeave={() => {
          animateTooltip(false);
          animatePoint(16);
          setTimeout(() => setShowTooltip(false), 300);
        }}
        className="flex flex-col items-center relative duration-300 border-b border-b-transparent hover:border-b-primary"
      >
        {showTooltip && (
          <div className="absolute bottom-10">
            <Tooltip ref={tooltipRef}>{data.content}</Tooltip>
          </div>
        )}
        <div
          ref={ref}
          className="rounded-full bg-primary size-4 absolute bottom-7 transition-all"
        />
        <span className="text-sm pt-1">{formatDate(data.date)}</span>
      </div>
    );
  }
);
TimePoint.displayName = "TimePoint";

// ==== StoryTelling ====
type Line = { x1: number; y1: number; x2: number; y2: number };

export default function StoryTelling() {
  const pointRefs = useRef(
    milestoneData.map(() => React.createRef<HTMLDivElement>())
  );
  const [ready, setReady] = useState(false);
  const [lines, setLines] = useState<Line[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setReady(true);
  }, []);

  useLayoutEffect(() => {
    if (!ready) return;

    const updateLines = () => {
      const containerRect = containerRef.current?.getBoundingClientRect();
      if (!containerRect) return;

      const positions = pointRefs.current.map((ref) => {
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
    window.addEventListener("scroll", updateLines, true);

    return () => {
      window.removeEventListener("resize", updateLines);
      window.removeEventListener("scroll", updateLines, true);
    };
  }, [ready]);

  const chunked = [];
  for (let i = 0; i < milestoneData.length; i += 6) {
    chunked.push(milestoneData.slice(i, i + 6));
  }

return (
  <div
    ref={containerRef}
    className="relative w-full px-4 sm:px-8 py-8 sm:py-12 space-y-12 lg:space-y-20"
  >
    {/* Linhas de conexão */}
    <svg className="absolute inset-0 w-full h-full z-0 pointer-events-none">
      {lines.map((line, idx) => {
        const length = Math.hypot(line.x2 - line.x1, line.y2 - line.y1);
        return (
          <line
            key={idx}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke="#4ade80"
            strokeWidth="1"
            strokeDasharray={length}
            strokeDashoffset={length}
            ref={(el) => {
              if (el) {
                gsap.to(el, {
                  strokeDashoffset: 0,
                  duration: 1,
                  delay: idx * 0.1,
                  ease: "power2.out",
                  scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top bottom",
                  },
                });
              }
            }}
          />
        );
      })}
    </svg>

    {/* Pontos e tooltips */}
    {chunked.map((row, rowIndex) => {
      const isOdd = rowIndex % 2 === 1;
      const items = isOdd ? [...row].reverse() : row;

      return (
        <div
          key={rowIndex}
          className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 sm:gap-12 lg:gap-20 relative z-10 ${
            isOdd ? "direction-rtl" : ""
          }`}
        >
          {items.map((milestone, i) => {
            const originalIndex = isOdd
              ? rowIndex * 6 + (5 - i)
              : rowIndex * 6 + i;
            return (
              <TimePoint
                key={originalIndex}
                ref={pointRefs[originalIndex]}
                data={milestone}
              />
            );
          })}
        </div>
      );
    })}
  </div>
);

}
