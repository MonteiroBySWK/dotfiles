"use client";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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
  lineWidth = 128,
}: TitleSectionProps) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
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
    }, titleRef);


    return () => ctx.revert();
  }, [lineWidth]);

  return (
    <div className={`mb-16 text-center ${className}`}>
      <h1
        ref={titleRef}
        className="text-3xl sm:text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-blue-300 via-purple-400 to-cyan-300 bg-clip-text text-transparent leading-tight bg-[length:200%_auto]"
      >
        {text}
      </h1>
      <div
        ref={lineRef}
        className={`h-1 mt-4 bg-gradient-to-r ${lineColor} mx-auto rounded-full`}
        style={{ width: 0 }}
      />
    </div>
  );
}
