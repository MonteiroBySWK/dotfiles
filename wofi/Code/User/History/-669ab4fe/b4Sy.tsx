import { ScreenHeaderProps } from "@/types/props";

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({ title, onBack }) => (
  <div className="screen-header">
    <button className="back-button" onClick={onBack}>
    </button>
    <h2 className="screen-title">{title}</h2>
    <div className="header-spacer"></div>
  </div>
);