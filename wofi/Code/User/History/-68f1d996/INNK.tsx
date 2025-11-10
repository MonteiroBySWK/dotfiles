import { useState, useRef, useEffect } from "react";
import ZoomIn from "../components/animation/ZoomIn";
import Section from "../components/ui/Section";
import TitleSection from "../components/ui/TitleSection";
import { type ServiceProps, ServiceData } from "../constants/ServiceData";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const Service = (props: ServiceProps) => {
  const [showHighlights, setShowHighlights] = useState(false);
  const highlightsRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (highlightsRef.current) {
      if (showHighlights) {
        gsap.fromTo(
          highlightsRef.current.children,
          { opacity: 0, y: -10 },
          { opacity: 1, y: 0, stagger: 0.1, duration: 0.3 }
        );
      } else {
        gsap.to(highlightsRef.current.children, {
          opacity: 0,
          y: -10,
          duration: 0.2,
        });
      }
    }
  }, [showHighlights]);

  return (
    <div className="flex flex-col bg-card/10 border border-dashed border-border shadow-md overflow-hidden transform transition duration-300 hover:scale-105 cursor-pointer">
      {/* Imagem */}
      <img
        src={props.urlImage}
        alt={`card-${props.title}`}
        className="object-cover h-40 sm:h-48 w-full object-top"
      />

      {/* Conteúdo */}
      <div className="p-4 flex flex-col justify-between flex-grow">
        <div>
          <h2 className="text-primary text-base sm:text-lg font-semibold">
            {props.title}
          </h2>
          <div className="mt-2">
            <p className="text-txt-primary text-sm sm:text-base">
              {props.description}
            </p>
          </div>

          {/* Highlights */}
          {showHighlights && (
            <div ref={highlightsRef} className="mt-3 space-y-1">
              {props.highlights.map((h, i) => (
                <p
                  key={i}
                  className="text-txt-primary text-sm sm:text-base list-disc pl-4"
                >
                  {h}
                </p>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={() => setShowHighlights(!showHighlights)}
          className="mt-4 inline-block bg-primary text-white px-4 py-2 font-medium text-sm text-center hover:bg-primary/90 transition"
        >
          {showHighlights ? "Ver menos" : "Saiba Mais"}
        </button>
      </div>
    </div>
  );
};

export default function Services() {
  return (
    <Section
      id="services"
      className="max-w-7xl flex flex-col mx-auto items-center justify-center py-16"
    >
      <TitleSection>Serviços Prestados</TitleSection>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full mt-10">
        {ServiceData.map((e, i) => (
          <ZoomIn key={i} delay={i / 6}>
            <Service
              title={e.title}
              description={e.description}
              highlights={e.highlights}
              urlImage={e.urlImage}
            />
          </ZoomIn>
        ))}
      </div>
    </Section>
  );
}
