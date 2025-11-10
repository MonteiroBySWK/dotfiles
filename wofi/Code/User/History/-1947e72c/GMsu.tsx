"use client";
// components/SlideIn.tsx
import { useEffect } from "react";
import gsap from "gsap";
import { useInView } from "../../hooks/useInView";

export default function SlideIn({
  children,
  from = "left",
  delay = 0
}: {
  children: React.ReactNode;
  from?: "left" | "right";
  delay?: number;
}) {
  const { ref, isInView } = useInView(0.2);

  useEffect(() => {
    if (isInView && ref.current) {
      gsap.to(ref.current, {
        opacity: 1,
        x: 0,
        duration: 0.8,
        delay,
        ease: "power2.out"
      });
    }
  }, [isInView, delay, ref]);

  const startX = from === "left" ? "-50px" : "50px";

  return (
    <div ref={ref} style={{ opacity: 0, transform: `translateX(${startX})` }}>
      {children}
    </div>
  );
}
