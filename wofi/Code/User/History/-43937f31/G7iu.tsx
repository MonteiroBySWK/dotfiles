"use client";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface TitleSectionProps {
  text: string;
  className?: string;
  lineColor?: string;
  lineWidth?: number | string;
}

export default function TitleSection({
  text,
  className = "",
  lineColor = "from-blue-500 to-purple-500",
  lineWidth = "100%",
}: TitleSectionProps) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.to(titleRef.current, {
      backgroundPosition: "100% 50%",
      duration: 10,
      repeat: -1,
      ease: "none",
    });

    if (titleRef.current && lineRef.current) {
      gsap.fromTo(
        lineRef.current,
        { width: 0 },
        {
          width: lineWidth,
          duration: 1,
          delay: 0.5,
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top bottom-=150",
            toggleActions: "play none none none",
          },
        }
      );
    }
  }, [lineWidth]);

  return (
    <div className={`mb-12 space-y-6 ${className}`}>
      <h1
        ref={titleRef}
        className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-blue-300 via-purple-400 to-cyan-300 bg-clip-text text-transparent leading-tight bg-[length:200%_auto]"
      >
        {text}
        <div
          ref={lineRef}
          className={`h-1 bg-gradient-to-r ${lineColor} w-32 mx-auto rounded-full`}
          style={{ width: 0 }} // Inicia com width 0 para a animação
        />
      </h1>
    </div>
  );
}
