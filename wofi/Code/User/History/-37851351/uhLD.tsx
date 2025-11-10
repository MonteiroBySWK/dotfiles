import gsap from "gsap";
import { useEffect, useRef } from "react";

export default function FadeIn({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {}, []);


  return <div ref={containerRef}>{children}</div>;
}
