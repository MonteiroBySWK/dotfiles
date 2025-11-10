import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function AnimatedSVG2() {
  const svgRef = useRef(null);

  useEffect(() => {
    const paths = svgRef.current.querySelectorAll("path");

    // timeline principal
    const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });

    // entrada do SVG
    tl.from(svgRef.current, {
      scale: 0.5,
      opacity: 0,
      transformOrigin: "center center",
      duration: 1,
    });

    // desenhar os strokes
    paths.forEach((path, i) => {
      const length = path.getTotalLength();

      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });

      tl.to(
        path,
        {
          strokeDashoffset: 0,
          duration: 1.5,
        },
        "-=0.5" // começa antes do anterior terminar
      );
    });

    // preencher
    tl.to(
      paths[0],
      {
        fill: "#4ADE80",
        duration: 1,
      },
      "-=0.3"
    );

    // pulse final
    tl.to(svgRef.current, {
      scale: 1.05,
      duration: 0.2,
      yoyo: true,
      repeat: 1,
      ease: "power1.inOut",
    });
  }, []);

  return (
    <svg
      ref={svgRef}
      width="393"
      height="448"
      viewBox="0 0 393 448"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M40.5 291.977L196.502 400.284L352.5 292.974V74.3418L197.045 175.339L196.498 175.694L195.952 175.337L41 73.8506V169.951L196.463 269.332L239.911 237.691L240.123 237.537L240.383 237.507C246.904 236.74 252.085 237.623 256.015 239.659C259.954 241.7 262.567 244.864 263.994 248.517C266.83 255.776 264.973 264.915 259.77 271.182L259.687 271.282L259.58 271.357L197.08 315.814L196.524 316.21L195.954 315.838L1.9541 189.338L1.5 189.042V2.65234L3.04688 3.66309L197.002 130.308L389.957 5.66016L391.5 4.66309V312.025L391.067 312.324L197.067 445.824L196.501 446.213L195.935 445.825L1.93457 312.825L1.5 312.527V255.314L1.56641 255.141C5.46492 245.005 13.9655 240.118 22.1406 240.25C30.3181 240.382 38.1076 245.545 40.4717 255.264L40.5 255.38V291.977Z" stroke="#0D0126" strokeWidth="2"/>
      <path d="M40.5 291.977L196.502 400.284L352.5 292.974V74.3418L197.045 175.339L196.498 175.694L195.952 175.337L41 73.8506V169.951L196.463 269.332L239.911 237.691L240.123 237.537L240.383 237.507C246.904 236.74 252.085 237.623 256.015 239.659C259.954 241.7 262.567 244.864 263.994 248.517C266.83 255.776 264.973 264.915 259.77 271.182L259.687 271.282L259.58 271.357L197.08 315.814L196.524 316.21L195.954 315.838L1.9541 189.338L1.5 189.042V2.65234L3.04688 3.66309L197.002 130.308L389.957 5.66016L391.5 4.66309V312.025L391.067 312.324L197.067 445.824L196.501 446.213L195.935 445.825L1.93457 312.825L1.5 312.527V255.314L1.56641 255.141C5.46492 245.005 13.9655 240.118 22.1406 240.25C30.3181 240.382 38.1076 245.545 40.4717 255.264L40.5 255.38V291.977Z" stroke="#0D0126" strokeOpacity="0.2" strokeWidth="2"/>
    </svg>
  );
}
