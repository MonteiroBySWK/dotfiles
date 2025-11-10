import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Waves() {
  const layer1 = useRef<HTMLDivElement>(null);
  const layer2 = useRef<HTMLDivElement>(null);
  const layer3 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const animate = (ref: React.RefObject<HTMLDivElement>, duration: number) => {
      if (!ref.current) return;
      gsap.to(ref.current, {
        xPercent: -50,
        repeat: -1,
        ease: "linear",
        duration,
      });
    };
    if (layer1 && layer2 && layer3) {
    animate(layer1, 8);
    animate(layer2, 12);
    animate(layer3, 16);}
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden bg-body z-0">
      {[layer1, layer2, layer3].map((ref, i) => (
        <div
          key={i}
          ref={ref}
          className={`absolute inset-0 ${
            i === 0
              ? "opacity-30"
              : i === 1
              ? "opacity-50"
              : "opacity-70"
          } [mask-image:radial-gradient(circle,white,transparent)]`}
          style={{ willChange: "transform" }}
        >
          <div className="flex w-[200%] h-full">
            <WaveSVG />
            <WaveSVG />
          </div>
        </div>
      ))}
    </div>
  );
}

function WaveSVG() {
  return (
    <svg
      className="flex-shrink-0 w-1/2 h-full"
      viewBox="0 0 1440 320"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id="dots" width="10" height="10" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="1" fill="white" />
        </pattern>
      </defs>
      <path
        fill="url(#dots)"
        d="M0,160L80,144C160,128,320,96,480,117.3C640,139,800,213,960,240C1120,267,1280,245,1360,234.7L1440,224L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"
      />
    </svg>
  );
}
