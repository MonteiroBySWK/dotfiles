import { useRef, memo, useLayoutEffect, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import type { DataSkillItemType } from "../../types/skillsTypes";

interface SkillIconsShowcaseProps {
  iconArr: DataSkillItemType[];
  variant: "desktop" | "mobile";
}

// Componente para versão desktop (circular)
const CircularIconsShowcase = memo<{ iconArr: DataSkillItemType[] }>(
  ({ iconArr }) => {
    const iconRefs = useRef<(HTMLDivElement | null)[]>([]);
    const RADIUS = 160;

    const angles = iconArr.map((_, i) => (360 / iconArr.length) * i);
    const positions = angles.map((angle) => {
      const rad = (angle * Math.PI) / 180;
      return {
        x: RADIUS * Math.cos(rad),
        y: RADIUS * Math.sin(rad),
      };
    });

    useGSAP(() => {
      const localAngles = [...angles];
      const speed = 0.5;
      const update = () => {
        localAngles.forEach((angle, i) => {
          localAngles[i] = (angle + speed) % 360;
          const rad = (localAngles[i] * Math.PI) / 180;
          gsap.set(iconRefs.current[i], {
            x: RADIUS * Math.cos(rad),
            y: RADIUS * Math.sin(rad),
          });
        });
      };
      gsap.ticker.add(update);
      return () => gsap.ticker.remove(update);
    }, [angles]);

    useGSAP(() => {
      iconArr.forEach((_, i) => {
        const el = iconRefs.current[i];
        if (!el) return;
        const { x, y } = positions[i];
        gsap.fromTo(
          el,
          { x: 0, y: 0, opacity: 0, scale: 0.6 },
          {
            x,
            y,
            opacity: 1,
            scale: 1,
            duration: 0.6,
            ease: "power3.out",
            delay: i * 0.05,
          }
        );
      });
    }, [iconArr, positions]);

    return (
      <div className="border border-dashed border-border hover:border-primary flex justify-center items-center rounded-full w-72 h-72 relative">
        {iconArr.map((icon, i) => (
          <div
            key={`${icon.name}-${i}`}
            ref={(el) => (iconRefs.current[i] = el)}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none will-change-transform"
          >
            <div className="flex items-center justify-center text-txt-primary transition-transform duration-300 hover:scale-110">
              {icon.icon}
            </div>
          </div>
        ))}
      </div>
    );
  }
);

// Componente para versão mobile (horizontal infinito)
const HorizontalIconsShowcase = memo<{ iconArr: DataSkillItemType[] }>(
  ({ iconArr }) => {
    const half = Math.ceil(iconArr.length / 2);
    const firstHalf = iconArr.slice(0, half);
    const secondHalf = iconArr.slice(half);

    return (
      <div className="w-full max-w-md flex flex-col justify-center items-center h-64">
        <InfiniteRow skills={firstHalf} direction="left" speed={5} />
        {secondHalf.length > 0 && (
          <InfiniteRow skills={secondHalf} direction="right" speed={5} />
        )}
      </div>
    );
  }
);

// Componente de linha infinita para mobile
const InfiniteRow = memo<{
  skills: DataSkillItemType[];
  direction: "left" | "right";
  speed: number;
}>(({ skills, direction, speed }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<gsap.core.Timeline | null>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useLayoutEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver(() => {
      if (containerRef.current) {
        let totalWidth = 0;
        const cards = containerRef.current.children;
        for (let i = 0; i < skills.length; i++) {
          const card = cards[i] as HTMLElement;
          if (card) {
            const style = window.getComputedStyle(card);
            totalWidth +=
              card.offsetWidth +
              parseFloat(style.marginLeft || "0") +
              parseFloat(style.marginRight || "0");
          }
        }
        setContainerWidth(totalWidth);
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [skills]);

  useLayoutEffect(() => {
    if (!containerRef.current || containerWidth === 0) return;

    if (animationRef.current) {
      animationRef.current.kill();
    }

    const container = containerRef.current;
    const duration = skills.length * (10 / speed);
    const startX = direction === "left" ? 0 : -containerWidth;
    const endX = direction === "left" ? -containerWidth : 0;

    gsap.set(container, { x: startX });
    animationRef.current = gsap.timeline({ repeat: -1 });
    animationRef.current.to(container, {
      x: endX,
      duration: duration,
      ease: "none",
    });

    return () => animationRef.current?.kill();
  }, [containerWidth, direction, speed, skills.length]);

  const itemsToRender = Array.from(
    { length: skills.length * 2 },
    (_, i) => skills[i % skills.length]
  );

  return (
    <div className="relative overflow-hidden py-2 w-full">
      <div className="absolute left-0 top-0 w-16 h-full z-10 pointer-events-none bg-gradient-to-r from-body to-transparent" />
      <div className="absolute right-0 top-0 w-16 h-full z-10 pointer-events-none bg-gradient-to-l from-body to-transparent" />
      <div ref={containerRef} className="flex items-center">
        {itemsToRender.map((skill, index) => (
          <SkillCard key={`${skill.name}-${index}`} skill={skill} />
        ))}
      </div>
    </div>
  );
});

const SkillCard = memo<{ skill: DataSkillItemType }>(({ skill }) => {
  return (
    <div className="flex flex-col items-center justify-center p-3 mx-3 h-28 w-20 text-txt-primary flex-shrink-0">
      <div className="relative w-14 h-14 mb-2 flex items-center justify-center">
        {skill.icon}
      </div>
      <span className="text-xs text-center">{skill.name}</span>
    </div>
  );
});

const SkillIconsShowcase = memo<SkillIconsShowcaseProps>(
  ({ iconArr, variant }) => {
    if (variant === "desktop") {
      return <CircularIconsShowcase iconArr={iconArr} />;
    }
    return <HorizontalIconsShowcase iconArr={iconArr} />;
  }
);

CircularIconsShowcase.displayName = "CircularIconsShowcase";
HorizontalIconsShowcase.displayName = "HorizontalIconsShowcase";
InfiniteRow.displayName = "InfiniteRow";
SkillCard.displayName = "SkillCard";
SkillIconsShowcase.displayName = "SkillIconsShowcase";

export {
  CircularIconsShowcase,
  HorizontalIconsShowcase,
  InfiniteRow,
  SkillCard,
  SkillIconsShowcase,
};
