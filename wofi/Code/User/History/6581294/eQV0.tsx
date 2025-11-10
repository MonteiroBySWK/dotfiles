import { memo } from "react";
import type { SkillContent } from "../../types/skillsTypes";

interface SkillContentAreaProps {
  content: SkillContent;
  className?: string;
}

const SkillContentArea = memo<SkillContentAreaProps>(
  ({ content, className = "" }) => {
    return (
      <div
        className={`text-base font-extralight space-y-3 border-[0.05rem] border-border rounded-md p-6 ${className}`}
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
export default SkillContentArea;
