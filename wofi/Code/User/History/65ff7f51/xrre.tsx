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
    const stepRefs = useRef<(HTMLButtonElement | null)[]>([]);

    // Animação das larguras dos botões - todos começam iguais
    useGSAP(() => {
      stepRefs.current.forEach((stepRef, index) => {
        if (!stepRef) return;

        const isActive = index === activeIndex;
        const activeWidth = isActive ? baseWidth * 1.5 : baseWidth; // 50% maior quando ativo

        gsap.to(stepRef, {
          width: `${activeWidth}%`,
          duration: 0.5,
          ease: "power3.inOut",
        });
      });
    }, [activeIndex]);

    return (
      <div className="flex items-start justify-center gap-x-[2%] mb-14">
        {steps.map((step, index) => {
          const isActive = index === activeIndex;
          const isPassed = index < activeIndex;
          const isInProgress = index === activeIndex && progress > 0;

          return (
            <button
              key={step}
              // @ts-expect-error
              ref={(el) => (stepRefs.current[index] = el)}
              onClick={() => onClick(index)}
              className="text-left transition-all duration-300 ease-in-out"
            >
              <div className="relative mb-1 h-[1px] bg-[#7d8082]">
                <span
                  className="absolute left-0 top-0 z-20 h-full bg-primary transition-all duration-500"
                  style={{
                    width: isPassed
                      ? "100%"
                      : isInProgress
                      ? `${progress * 100}%`
                      : "0%",
                  }}
                />
              </div>
              <h3
                className={`font-geomanist text-xs md:text-md lg:text-lg transition-all duration-500 ${
                  isActive ? "opacity-100 text-primary" : "opacity-50 text-white"
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

export { SkillStepIndicator };
