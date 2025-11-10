import { useEffect, useRef } from "react";
import gsap from "gsap";
import { prefersReducedMotion } from "../../utils/motion";

export default function TextWriting({
  text,
  size,
  className = "",
}: { text: string; size: string; className?: string }) {
  const containerRef = useRef<HTMLParagraphElement | null>(null);
  const isInViewRef = useRef(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    // build spans for each character
    el.innerHTML = "";
    const frag = document.createDocumentFragment();
    for (const ch of text.split("")) {
      const span = document.createElement("span");
      // preserve spaces visually
      span.innerHTML = ch === " " ? "&nbsp;" : ch;
      span.style.opacity = "0";
      span.style.display = "inline-block";
      frag.appendChild(span);
    }
    el.appendChild(frag);

    if (prefersReducedMotion()) {
      // show immediately
      Array.from(el.children).forEach((c) => ((c as HTMLElement).style.opacity = "1"));
      return;
    }

    // intersection check: animate when visible
    const observer = new IntersectionObserver(
      ([entry]) => {
        isInViewRef.current = entry.isIntersecting;
        if (!entry.isIntersecting) return;

        const chars = Array.from(el.children) as HTMLElement[];
        try {
          // faster, tighter stagger for snappier feel
          gsap.fromTo(
            chars,
            { opacity: 0, y: 4 },
            { opacity: 1, y: 0, duration: 0.35, stagger: 0.01, ease: "power2.out" }
          );
        } catch (e) {
          /* ignore */
        }
      },
      { threshold: 0.02 }
    );

    observer.observe(el);

    
  return () => observer.disconnect();
  }, [text]);

  return <p ref={containerRef} className={`${className} ${size}`} />;
}
