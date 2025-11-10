const ScreenHeader: React.FC<ScreenHeaderProps> = ({ title, onBack }) => (
  <div className="screen-header">
    <button className="back-button" onClick={onBack}>
      <ArrowLeft size={24} />
    </button>
    <h2 className="screen-title">{title}</h2>
    <div className="header-spacer"></div>
  </div>
);