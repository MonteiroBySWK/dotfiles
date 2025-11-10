import { useRef, memo } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface SkillTabNavigationProps {
  tabs: string[];
  activeIndex: number;
  onClick: (index: number) => void;
}

const SkillTabNavigation = memo<SkillTabNavigationProps>(
  ({ tabs, activeIndex, onClick }) => {
    return (
      <div className="w-full max-w-2xl flex justify-between mb-8 border-b border-border">
        {tabs.map((tab, index) => (
          <SkillTab
            key={tab}
            text={tab}
            isActive={index === activeIndex}
            onClick={() => onClick(index)}
          />
        ))}
      </div>
    );
  }
);

const SkillTab = memo<{ text: string; isActive: boolean; onClick: () => void }>(
  ({ text, isActive, onClick }) => {
    const lineRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
      gsap.to(lineRef.current, {
        width: isActive ? "100%" : "0%",
        duration: 0.5,
        ease: "power3.inOut",
      });
    }, [isActive]);

    return (
      <button
        onClick={onClick}
        className="cursor-pointer text-center flex-1 py-2"
      >
        <span
          className={`font-semibold text-sm sm:text-base transition-colors ${
            isActive ? "text-txt-primary" : "text-txt-secondary"
          }`}
        >
          {text}
        </span>
        <div
          ref={lineRef}
          className="h-[0.1rem] bg-primary mt-1 mx-auto"
          style={{ width: isActive ? "100%" : "0%" }}
        />
      </button>
    );
  }
);

SkillTabNavigation.displayName = "SkillTabNavigation";
SkillTab.displayName = "SkillTab";

export { SkillTab, SkillTabNavigation };
