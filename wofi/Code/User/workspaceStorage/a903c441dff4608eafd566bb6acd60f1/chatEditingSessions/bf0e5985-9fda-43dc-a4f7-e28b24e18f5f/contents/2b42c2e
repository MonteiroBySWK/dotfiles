import { useEffect } from "react";
import gsap from "gsap";
import { useInView } from "../../hooks/useInView";

export default function FadeIn({
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
          y: 0,
          duration: 0.8,
          delay,
          ease: "power2.out",
        });
      } catch (e) {
        /* ignore */
      }
    }
  }, [isInView, delay, ref]);

  return (
    <div ref={ref} style={{ opacity: 0, transform: "translateY(20px)" }}>
      {children}
    </div>
  );
}
