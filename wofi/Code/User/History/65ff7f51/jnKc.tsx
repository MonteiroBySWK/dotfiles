import { useRef, memo } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface SkillStepIndicatorProps {
  steps: string[];
  activeIndex: number;
  onClick: (index: number) => void;
  progress?: number;
}

const SkillStepIndicator = memo<SkillStepIndicatorProps>(
  ({ steps, activeIndex, onClick, progress = 0 }) => {
    const progressBarRef = useRef<HTMLSpanElement>(null);

    useGSAP(() => {
      if (progressBarRef.current) {
        gsap.to(progressBarRef.current, {
          width: `${progress * 100}%`,
          duration: 0.3,
          ease: "power2.out",
        });
      }
    }, [progress]);

    return (
      <div className="hidden lg:flex items-start justify-center gap-x-[2%] mb-14">
        {steps.map((step, index) => {
          const isActive = index === activeIndex;
          const isPassed = index < activeIndex;
          const width = index === 0 ? "30%" : "17.5%";

          return (
            <button
              key={step}
              onClick={() => onClick(index)}
              className="text-left transition-all duration-500 ease-in-out"
              style={{ width }}
            >
              <div className="relative mb-1 h-[1px] bg-border">
                <span
                  ref={index === activeIndex ? progressBarRef : undefined}
                  className="absolute left-0 top-0 z-20 h-full bg-primary transition-all duration-500"
                  style={{
                    width: isPassed
                      ? "100%"
                      : isActive
                      ? `${progress * 100}%`
                      : "0%",
                  }}
                />
              </div>
              <h3
                className={`font-semibold text-xs md:text-md lg:text-lg transition-opacity duration-300 ${
                  isActive
                    ? "opacity-100 text-txt-primary"
                    : "opacity-50 text-txt-secondary"
                }`}
              >
                {step}
              </h3>
            </button>
          );
        })}
      </div>
    );
  }
);

SkillStepIndicator.displayName = "SkillStepIndicator";
export default SkillStepIndicator;
