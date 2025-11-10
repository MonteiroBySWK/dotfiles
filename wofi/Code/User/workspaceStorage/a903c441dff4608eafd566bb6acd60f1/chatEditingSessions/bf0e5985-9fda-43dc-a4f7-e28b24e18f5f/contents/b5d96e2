import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useInView } from "../../hooks/useInView";
import { prefersReducedMotion } from "../../utils/motion";

export default function TextWriting({
  text,
  size,
}: { text: string; size: string }) {
  const { ref, isInView } = useInView(0.05);
  const containerRef = useRef<HTMLParagraphElement | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    // build spans for each character
    el.innerHTML = "";
    const frag = document.createDocumentFragment();
    for (const ch of text.split("")) {
      const span = document.createElement("span");
      span.textContent = ch;
      span.style.opacity = "0";
      span.style.display = ch === " " ? "inline-block" : "inline-block";
      frag.appendChild(span);
    }
    el.appendChild(frag);

    if (prefersReducedMotion()) {
      // show immediately
      Array.from(el.children).forEach((c) => ((c as HTMLElement).style.opacity = "1"));
      return;
    }

    if (!isInView) return;

    const chars = Array.from(el.children) as HTMLElement[];
    try {
      gsap.fromTo(
        chars,
        { opacity: 0, y: 6 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.02, ease: "power2.out" }
      );
    } catch (e) {
      /* ignore */
    }
  }, [text, isInView]);

  return (
    <p ref={containerRef} className={`font-mono ${size}`} />
  );
}
