"use client";

import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Smartphone, Globe, Users } from "lucide-react";
import TitleSection from "../components/TitleSection";

// Registrar ScrollTrigger
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const services = [
  {
    id: "mobile",
    title: "Desenvolvimento Mobile",
    subtitle: "Aplicações Nativas & Híbridas",
    description:
      "Criamos soluções móveis inovadoras que crescem com seu negócio",
    icon: <Smartphone className="h-8 w-8" />,
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-50",
    textColor: "text-blue-600",
  },
  {
    id: "web",
    title: "Desenvolvimento Web",
    subtitle: "Soluções Digitais Completas",
    description: "Construímos experiências web que impulsionam resultados",
    icon: <Globe className="h-8 w-8" />,
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-50",
    textColor: "text-purple-600",
  },
  {
    id: "consulting",
    title: "Consultoria Tecnológica",
    subtitle: "Estratégia & Transformação Digital",
    description:
      "Orientação estratégica para sua jornada de transformação digital",
    icon: <Users className="h-8 w-8" />,
    color: "from-emerald-500 to-teal-500",
    bgColor: "bg-emerald-50",
    textColor: "text-emerald-600",
  },
];

export default function ServicesShowcase() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);

  const service = services.find((s) => s.id === selected);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animações de background
      if (backgroundRef.current) {
        const bgElements = backgroundRef.current.children;

        // Primeira bola azul
        gsap.to(bgElements[0], {
          x: 100,
          y: -50,
          duration: 20,
          repeat: -1,
          yoyo: true,
          ease: "none",
        });

        // Segunda bola roxa
        gsap.to(bgElements[1], {
          x: -80,
          y: 60,
          duration: 25,
          repeat: -1,
          yoyo: true,
          ease: "none",
        });
      }


      // Animações de entrada com ScrollTrigger
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      });

      // Header animation
      if (headerRef.current) {
        tl.fromTo(
          headerRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.6 }
        );
      }

      // Cards animation com stagger
      if (cardsRef.current) {
        const cards = cardsRef.current.children;
        tl.fromTo(
          cards,
          { opacity: 0, scale: 0.9, y: 20 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.2,
            ease: "back.out(1.7)",
          },
          "-=0.4"
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Função para hover nos cards
  const handleCardHover = (element: HTMLElement, isEntering: boolean) => {
    if (isEntering) {
      gsap.to(element, {
        y: -10,
        scale: 1.02,
        duration: 0.3,
        ease: "power2.out",
      });
    } else {
      gsap.to(element, {
        y: 0,
        scale: 1,
        duration: 0.3,
        ease: "power2.out",
      });
    }
  };

  return (
    <section
      ref={sectionRef}
      className="min-h-screen py-20 px-4 md:px-6 lg:px-8 bg-[#0d0126] relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-16">
          <TitleSection text="Nossos Serviços" />

          <p className="text-xl text-white/70 max-w-3xl p-4 mx-auto">
            Transformamos ideias em soluções tecnológicas inovadoras.
          </p>
        </div>

        <div ref={cardsRef} className="grid lg:grid-cols-3 gap-8 mb-16">
          {services.map((s) => (
            <div
              key={s.id}
              className="relative group"
              onMouseEnter={(e) => {
                setHovered(s.id);
                handleCardHover(e.currentTarget as HTMLElement, true);
              }}
              onMouseLeave={(e) => {
                setHovered(null);
                handleCardHover(e.currentTarget as HTMLElement, false);
              }}
            >
              <div className="bg-white/5 backdrop-blur-sm border-white/10 hover:border-white/20 h-full transition-all">
                <div className="p-8 space-y-4 flex flex-col items-center text-center">
                  <div
                    className={`w-16 h-16 flex items-center justify-center rounded-2xl bg-gradient-to-r ${s.color}`}
                  >
                    {s.icon}
                  </div>

                  <h3 className="text-2xl font-bold text-white">{s.title}</h3>
                  <p className="text-purple-300 font-medium">{s.subtitle}</p>
                  <p className="text-white/70">{s.description}</p>

                  {/** <Button
                    variant="ghost"
                    className="text-white p-0 h-auto"
                    onClick={() => setSelected(s.id)}
                  >
                    Saiba Mais <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>*/}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
