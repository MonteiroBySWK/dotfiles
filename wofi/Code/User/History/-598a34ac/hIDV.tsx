export default function BlockTransition() {
  return (
    <div className="fixed h-screen z-1" id="block-transition">
      <div id="transition-1" className="h-1/5 relative z- w-0 bg-primary"></div>
      <div
        id="transition-2"
        className="h-1/5 relative z-5 w-0 bg-primary"
      ></div>
      <div
        id="transition-3"
        className="h-1/5 relative z-5 w-0 bg-primary"
      ></div>
      <div
        id="transition-4"
        className="h-1/5 relative z-5 w-0 bg-primary"
      ></div>
      <div
        id="transition-5"
        className="h-1/5 relative z-5 w-0 bg-primary"
      ></div>
    </div>
  );
}
