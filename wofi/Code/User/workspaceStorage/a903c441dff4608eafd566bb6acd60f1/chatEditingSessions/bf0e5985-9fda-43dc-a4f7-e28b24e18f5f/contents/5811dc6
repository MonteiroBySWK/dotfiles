import { useEffect } from "react";
import gsap from "gsap";
import { useInView } from "../../hooks/useInView";

export default function ZoomIn({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const { ref, isInView } = useInView(0.15);

  useEffect(() => {
    if (!isInView || !ref.current) return;
    try {
      gsap.fromTo(
        ref.current,
        { opacity: 0, scale: 0.96 },
        { opacity: 1, scale: 1, duration: 0.6, delay, ease: "power3.out" }
      );
    } catch (e) {
      /* ignore */
    }
  }, [isInView, delay]);

  return (
    <div ref={ref} style={{ opacity: 0, transform: "scale(0.96)" }}>
      {children}
    </div>
  );
}
