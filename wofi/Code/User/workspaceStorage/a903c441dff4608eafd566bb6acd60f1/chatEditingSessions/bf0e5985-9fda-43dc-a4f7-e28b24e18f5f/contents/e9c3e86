import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function ZoomIn({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    gsap.fromTo(
      el,
      { opacity: 0, scale: 0.96 },
      { opacity: 1, scale: 1, duration: 0.6, ease: "power3.out" }
    );
  }, []);

  return <div ref={ref}>{children}</div>;
}
import { useEffect } from "react";
import gsap from "gsap";
import { useInView } from "../../hooks/useInView";

export default function ZoomIn({
  children,
  delay = 0
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const { ref, isInView } = useInView(0.2);

  useEffect(() => {
    if (isInView && ref.current) {
      try {
        gsap.to(ref.current, {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          delay,
          ease: "power2.out",
        });
      } catch (e) {
        /* ignore */
      }
    }
  }, [isInView, delay, ref]);

  return (
    <div ref={ref} style={{ opacity: 0, transform: "scale(0.95)" }}>
      {children}
    </div>
  );
}
