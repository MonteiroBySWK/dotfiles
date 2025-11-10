import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useInView } from "../../hooks/useInView";
import { prefersReducedMotion } from "../../utils/motion";

export default function AnimatedSVG2(props: { className: string }) {
  const svgRef = useRef(null);
  const { ref: inViewRef, isInView } = useInView(0.15);

  useEffect(() => {
    if (prefersReducedMotion()) {
      const el = svgRef.current as HTMLElement | null;
      if (!el) return;
      const path = el.querySelector("path");
      if (path) path.setAttribute("fill", "#4ADE80");
      return;
    }

    if (typeof window !== "undefined" && window.innerWidth < 640) {
      const el = svgRef.current as HTMLElement | null;
      if (!el) return;
      const path = el.querySelector("path");
      if (path) path.setAttribute("fill", "#4ADE80");
      return;
    }

    if (!isInView) return;

    const el = svgRef.current as HTMLElement | null;
    if (!el) return;
    const path = el.querySelector("path");

    if (path) {
      try {
        const length = (path as SVGPathElement).getTotalLength();

        // estado inicial: caminho "não desenhado"
        gsap.set(path, {
          strokeDasharray: length,
          strokeDashoffset: length,
          fill: "transparent",
        });

        // anima: lápis percorrendo
        gsap.to(path, {
          strokeDashoffset: 0,
          duration: 1,
          ease: "power1.inOut",
        });

        // depois de terminar, opcional: preenche
        gsap.to(path, {
          fill: "#4ADE80",
          duration: 1,
          delay: 3,
        });
      } catch (e) {
        /* ignore */
      }
    }
  }, [isInView]);

  return (
    <div ref={inViewRef}>
      <svg
        ref={svgRef}
        className={props.className} // tamanho controlado pelo Tailwind
        viewBox="0 0 393 448"
        xmlns="http://www.w3.org/2000/svg"
      >
      <path
        d="M40.5 291.977L196.502 400.284L352.5 292.974V74.3418L197.045 175.339L196.498 175.694L195.952 175.337L41 73.8506V169.951L196.463 269.332L239.911 237.691L240.123 237.537L240.383 237.507C246.904 236.74 252.085 237.623 256.015 239.659C259.954 241.7 262.567 244.864 263.994 248.517C266.83 255.776 264.973 264.915 259.77 271.182L259.687 271.282L259.58 271.357L197.08 315.814L196.524 316.21L195.954 315.838L1.9541 189.338L1.5 189.042V2.65234L3.04688 3.66309L197.002 130.308L389.957 5.66016L391.5 4.66309V312.025L391.067 312.324L197.067 445.824L196.501 446.213L195.935 445.825L1.93457 312.825L1.5 312.527V255.314L1.56641 255.141C5.46492 245.005 13.9655 240.118 22.1406 240.25C30.3181 240.382 38.1076 245.545 40.4717 255.264L40.5 255.38V291.977Z"
        stroke="#0D0126"
        strokeWidth="2"
      />
    </svg>
  </div>
  );
}
