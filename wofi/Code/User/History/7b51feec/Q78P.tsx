export default function Waves() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-black z-0">
      {/* Camada 1 */}
      <div className="absolute inset-0 animate-wave1 opacity-30 [mask-image:radial-gradient(circle,white,transparent)]">
        <WaveSVG />
      </div>

      {/* Camada 2 */}
      <div className="absolute inset-0 animate-wave2 opacity-50 [mask-image:radial-gradient(circle,white,transparent)]">
        <WaveSVG />
      </div>

      {/* Camada 3 */}
      <div className="absolute inset-0 animate-wave3 opacity-70 [mask-image:radial-gradient(circle,white,transparent)]">
        <WaveSVG />
      </div>
    </div>
  );
}

function WaveSVG() {
  return (
    <svg
      className="w-full h-full"
      viewBox="0 0 1440 320"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          id="dots"
          width="10"
          height="10"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="1" cy="1" r="1" fill="white" />
        </pattern>
      </defs>
      <path
        fill="url(#dots)"
        d="M0,160L80,144C160,128,320,96,480,117.3C640,139,800,213,960,240C1120,267,1280,245,1360,234.7L1440,224L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"
      ></path>
    </svg>
  );
}
