import gsap from "gsap";
import { useRef } from "react";

export default function FadeIn({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  return <div ref={containerRef}>{children}</div>;
}
