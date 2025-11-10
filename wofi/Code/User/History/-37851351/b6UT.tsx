import gsap from "gsap";
import { useEffect, useRef } from "react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function FadeIn({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: containerRef.current
    }
  })

  useEffect(() => {}, []);

  return <div ref={containerRef}>{children}</div>;
}
