import React, { memo, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import type { DataSkillItemType } from "../types/skillsTypes";

const SkillCard: React.FC<{ skill: DataSkillItemType }> = memo(({ skill }) => {
  return (
    <div className="flex flex-col items-center justify-center p-3 mx-3 h-28 w-20 text-txt-primary flex-shrink-0">
      <div className="relative w-14 h-14 mb-2 flex items-center justify-center">
        {skill.icon}
      </div>
      <span className="text-xs text-center">{skill.name}</span>
    </div>
  );
});

function useContainerWidth(
  ref: React.RefObject<HTMLDivElement>,
  items: DataSkillItemType[]
) {
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    if (!ref.current) return;
    const observer = new ResizeObserver(() => {
      if (ref.current) {
        let totalWidth = 0;
        const cards = ref.current.children;
        for (let i = 0; i < items.length; i++) {
          const card = cards[i] as HTMLElement;
          if (card) {
            const style = window.getComputedStyle(card);
            totalWidth +=
              card.offsetWidth +
              parseFloat(style.marginLeft || "0") +
              parseFloat(style.marginRight || "0");
          }
        }
        setWidth(totalWidth);
      }
    });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, items]);

  return width;
}

const LinhaInfinita: React.FC<{
  skills: DataSkillItemType[];
  direction: "left" | "right";
  speed: number;
}> = ({ skills, direction, speed }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<gsap.core.Timeline | null>(null);
  const containerWidth = useContainerWidth(containerRef, skills);
  const duration = skills.length * (10 / speed);

  useLayoutEffect(() => {
    if (!containerRef.current || containerWidth === 0) return;
    if (animationRef.current) animationRef.current.kill();

    const container = containerRef.current;
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
  }, [containerWidth, direction, duration]);

  const itemsToRender = Array.from(
    { length: skills.length * 2 },
    (_, i) => skills[i % skills.length]
  );

  if (skills.length === 0) return null;

  return (
    <div className="relative overflow-hidden py-2 w-full">
      <div className="absolute left-0 top-0 w-16 h-full z-10 pointer-events-none bg-gradient-to-r from-body to-transparent"></div>
      <div className="absolute right-0 top-0 w-16 h-full z-10 pointer-events-none bg-gradient-to-l from-body to-transparent"></div>
      <div ref={containerRef} className="flex items-center">
        {itemsToRender.map((skill, index) => (
          <SkillCard key={`${skill.name}-${index}`} skill={skill} />
        ))}
      </div>
    </div>
  );
};

export default function SkillsShowCaseMobile({
  iconArr,
}: {
  iconArr: DataSkillItemType[];
}) {
  const half = Math.ceil(iconArr.length / 2);
  const firstHalf = iconArr.slice(0, half);
  const secondHalf = iconArr.slice(half);

  return (
    <div className="w-full max-w-md lg:max-w-sm flex flex-col justify-center items-center h-72 sm:h-80">
      <LinhaInfinita skills={firstHalf} direction="left" speed={5} />
      {secondHalf.length > 0 && (
        <LinhaInfinita skills={secondHalf} direction="right" speed={5} />
      )}
    </div>
  );
}