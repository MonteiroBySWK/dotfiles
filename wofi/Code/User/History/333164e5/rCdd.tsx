import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import React, {
  forwardRef,
  useLayoutEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { type MilestoneType } from "../constants/MillestoneData";
import { milestoneData } from "../constants/MillestoneData";
import { ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);

// ==== Dados ====

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
  const containerRef = useRef<HTMLDivElement>(null);
  const [lines, setLines] = useState<Line[]>([]);

  // Recalcula as linhas apenas quando o layout muda
  const updateLines = useCallback(() => {
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
  }, []);

  useLayoutEffect(() => {
    updateLines();
    window.addEventListener("resize", updateLines);
    return () => window.removeEventListener("resize", updateLines);
  }, [updateLines]);

  useGSAP(() => {
    if (!lines.length) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<SVGLineElement>(".timeline-line").forEach((el, idx) => {
        const length = el.getTotalLength();
        gsap.set(el, { strokeDasharray: length, strokeDashoffset: length });

        gsap.to(el, {
          strokeDashoffset: 0,
          duration: 1,
          delay: idx * 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",
            once: true,
          },
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, [lines]);

  const chunked = [];
  for (let i = 0; i < milestoneData.length; i += 6) {
    chunked.push(milestoneData.slice(i, i + 6));
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full px-4 sm:px-8 py-8 sm:py-12 space-y-12 lg:space-y-20"
    >
      {/* Linhas */}
      <svg
        className="absolute inset-0 w-full h-full z-0 pointer-events-none"
        style={{ willChange: "stroke-dashoffset" }}
      >
        {lines.map((line, idx) => (
          <line
            key={idx}
            className="timeline-line"
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke="#4ade80"
            strokeWidth="1"
          />
        ))}
      </svg>

      {/* Pontos */}
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
                  ref={pointRefs.current[originalIndex]}
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