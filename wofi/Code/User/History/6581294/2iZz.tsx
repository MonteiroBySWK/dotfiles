import { memo } from "react";
import type { SkillContent } from "../../types/skillsTypes";

interface SkillContentAreaProps {
  content: SkillContent;
  className?: string;
  variant?: "desktop" | "mobile";
}

const SkillContentArea = memo<SkillContentAreaProps>(
  ({ content, className = "", variant = "mobile" }) => {
    if (variant === "desktop") {
      return (
        <div className={className}>
          {content.intro && (
            <p className="text-gray-300 leading-relaxed mb-3">
              {content.intro}
            </p>
          )}
          <ul className="space-y-2 mb-3">
            {content.bullets.map((bullet, i) => (
              <li key={i} className="flex items-start gap-x-2">
                <svg
                  className="shrink-0 text-gray-400 mt-1"
                  style={{ fontSize: "18px" }}
                  width="1em"
                  height="1em"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M18.71 7.21a1 1 0 0 0-1.42 0l-7.45 7.46l-3.13-3.14A1 1 0 1 0 5.29 13l3.84 3.84a1 1 0 0 0 1.42 0l8.16-8.16a1 1 0 0 0 0-1.47"
                  ></path>
                </svg>
                <span className="text-sm md:text-base text-gray-300">
                  {bullet}
                </span>
              </li>
            ))}
          </ul>
          {content.outro && (
            <p className="text-gray-300 leading-relaxed">{content.outro}</p>
          )}
        </div>
      );
    }

    return (
      <div
        className={`text-sm md:text-base font-extralight space-y-3 border-[0.05rem] border-border p-6 ${className}`}
      >
        {content.intro && (
          <p className="leading-relaxed text-txt-primary">{content.intro}</p>
        )}
        <ul className="list-disc list-inside space-y-1 text-txt-secondary">
          {content.bullets.map((bullet, index) => (
            <li key={index}>{bullet}</li>
          ))}
        </ul>
        {content.outro && (
          <p className="leading-relaxed text-txt-primary">{content.outro}</p>
        )}
      </div>
    );
  }
);

SkillContentArea.displayName = "SkillContentArea";

export { SkillContentArea };
