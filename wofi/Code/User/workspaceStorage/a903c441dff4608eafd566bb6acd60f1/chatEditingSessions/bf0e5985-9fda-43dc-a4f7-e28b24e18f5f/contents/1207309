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
      gsap.to(ref.current, {
        opacity: 1,
        scale: 1,
        duration: 0.6,
        delay,
        ease: "power2.out"
      });
    }
  }, [isInView, delay, ref]);

  return (
    <div ref={ref} style={{ opacity: 0, transform: "scale(0.95)" }}>
      {children}
    </div>
  );
}
