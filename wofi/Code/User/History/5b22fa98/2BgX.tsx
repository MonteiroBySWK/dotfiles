"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  FlaskConical,
  Code2,
  Users,
  Rocket,
  Brain,
  Database,
  Cpu,
} from "lucide-react";
import TitleSection from "@/components/ui/TitleSection";

// Registrar ScrollTrigger
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function AboutUsLab() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const processCardsRef = useRef<HTMLDivElement>(null);
  const floatingIcon1Ref = useRef<HTMLDivElement>(null);
  const floatingIcon2Ref = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);

  const stats = [
    {
      icon: <Code2 className="h-6 w-6" />,
      label: "Projetos Analisados",
    },
    {
      icon: <Users className="h-6 w-6" />,
      label: "Clientes Atendidos",
    },
    {
      icon: <FlaskConical className="h-6 w-6" />,
      label: "Laboratório Ativo",
    },
    {
      icon: <Rocket className="h-6 w-6" />,
      label: "Taxa de Sucesso",
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animações de background
      if (backgroundRef.current) {
        const bgElements = backgroundRef.current.children;

        // Primeira bola azul
        gsap.to(bgElements[0], {
          x: 100,
          y: -50,
          duration: 25,
          repeat: -1,
          yoyo: true,
          ease: "none",
        });

        // Segunda bola roxa
        gsap.to(bgElements[1], {
          x: -80,
          y: 60,
          scale: 0.8,
          duration: 25,
          repeat: -1,
          yoyo: true,
          ease: "power2.inOut",
        });

        // Terceira bola índigo
        gsap.to(bgElements[2], {
          scale: 1.3,
          rotation: 360,
          opacity: 0.6,
          duration: 18,
          repeat: -1,
          yoyo: true,
          ease: "power2.inOut",
        });
      }

      // Animação do título com gradiente
      if (titleRef.current) {
        gsap.to(titleRef.current, {
          backgroundPosition: "100% 50%",
          duration: 10,
          repeat: -1,
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
          { opacity: 1, y: 0, duration: 0.8 }
        );
      }

      // Line animation
      if (lineRef.current) {
        tl.fromTo(
          lineRef.current,
          { width: 0 },
          { width: 128, duration: 1 },
          "-=0.3"
        );
      }

      // Content animation
      if (contentRef.current) {
        tl.fromTo(
          contentRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.6 },
          "-=0.4"
        );
      }

      // Image animation
      if (imageRef.current) {
        tl.fromTo(
          imageRef.current,
          { opacity: 0, scale: 0.8 },
          { opacity: 1, scale: 1, duration: 0.8 },
          "-=0.5"
        );
      }

      // Process cards animation
      if (processCardsRef.current) {
        const cards = processCardsRef.current.children;
        tl.fromTo(
          cards,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.2,
          },
          "-=0.6"
        );
      }

      // Animações dos textos que pulsam
      const techText = document.querySelector("[data-tech-text]");
      const realText = document.querySelector("[data-real-text]");

      if (techText) {
        gsap.to(techText, {
          scale: 1.05,
          duration: 2,
          repeat: -1,
          yoyo: true,
          ease: "power2.inOut",
        });
      }

      if (realText) {
        gsap.to(realText, {
          scale: 1.05,
          duration: 2,
          repeat: -1,
          yoyo: true,
          delay: 1,
          ease: "power2.inOut",
        });
      }

      // Animações flutuantes dos ícones
      if (floatingIcon1Ref.current) {
        gsap.to(floatingIcon1Ref.current, {
          y: -20,
          rotation: 5,
          duration: 12,
          repeat: -1,
          yoyo: true,
          ease: "power2.inOut",
        });
      }

      if (floatingIcon2Ref.current) {
        gsap.to(floatingIcon2Ref.current, {
          y: -20,
          rotation: -5,
          duration: 12,
          repeat: -1,
          yoyo: true,
          delay: 2,
          ease: "power2.inOut",
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Função para hover nos cards
  const handleCardHover = (element: HTMLElement, isEntering: boolean) => {
    if (isEntering) {
      gsap.to(element, {
        scale: 1.05,
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        duration: 0.3,
      });
    } else {
      gsap.to(element, {
        scale: 1,
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        duration: 0.3,
      });
    }
  };

  // Função para hover nos ícones
  const handleIconHover = (element: HTMLElement, isEntering: boolean) => {
    if (isEntering) {
      gsap.to(element, {
        rotation: 360,
        duration: 0.6,
      });
    }
  };

  // Função para hover na imagem container
  const handleImageHover = (element: HTMLElement, isEntering: boolean) => {
    if (isEntering) {
      gsap.to(element, {
        scale: 1.02,
        duration: 0.3,
      });
    } else {
      gsap.to(element, {
        scale: 1,
        duration: 0.3,
      });
    }
  };

  return (
    <section
      ref={sectionRef}
      id="sobre"
      className="w-full min-h-screen py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-gradient-to-br bg-[#0d0126]"
    >
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <TitleSection text="Sobre Nos" />

          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {/* coluna da esquerda */}
            <div className="lg:col-span-2 space-y-8">
              <div
                ref={contentRef}
                className="bg-white/5 p-8 border border-white/10"
                onMouseEnter={(e) =>
                  handleCardHover(e.currentTarget as HTMLElement, true)
                }
                onMouseLeave={(e) =>
                  handleCardHover(e.currentTarget as HTMLElement, false)
                }
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">
                  Somos engenheiros criativos com foco em soluções práticas para
                  problemas reais
                </h2>

                <p className="text-lg md:text-xl text-justify text-white/80 leading-relaxed">
                  A Thera surgiu como um laboratório de desenvolvimento de
                  sistemas dentro da UEMA, realizando pequenos trabalhos como
                  websites e aplicativos. No início, éramos um grupo de
                  estudantes aprendendo sobre desenvolvimento na prática. Com o
                  tempo, amadurecemos tecnicamente e agora estamos em processo
                  de transição para uma estrutura mais corporativa,
                  consolidando-nos como uma startup.
                </p>
              </div>

              {/* icones shadcn */}
              <div
                ref={processCardsRef}
                className="grid grid-cols-1 md:grid-cols-3 gap-8"
              >
                {[
                  {
                    icon: <Brain className="h-6 w-6" />,
                    title: "Análise",
                    description:
                      "Investigação profunda aplicando metodologias científicas",
                    color: "from-blue-500 to-cyan-500",
                  },
                  {
                    icon: <FlaskConical className="h-6 w-6" />,
                    title: "Experimentação",
                    description: "Testes e prototipagem em ambiente controlado",
                    color: "from-purple-500 to-pink-500",
                  },
                  {
                    icon: <Rocket className="h-6 w-6" />,
                    title: "Implementação",
                    description: "Soluções robustas com monitoramento contínuo",
                    color: "from-emerald-500 to-teal-500",
                  },
                ].map((process, index) => (
                  <div
                    key={index}
                    className="bg-white/5 p-6 border border-white/10 text-center group"
                    onMouseEnter={(e) =>
                      handleCardHover(e.currentTarget as HTMLElement, true)
                    }
                    onMouseLeave={(e) =>
                      handleCardHover(e.currentTarget as HTMLElement, false)
                    }
                  >
                    <div
                      className={`mx-auto md:mx-0 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r ${process.color} mb-4`}
                      onMouseEnter={(e) =>
                        handleIconHover(e.currentTarget as HTMLElement, true)
                      }
                    >
                      <div className="text-white">{process.icon}</div>
                    </div>
                    <div className="text-lg font-bold text-white mb-2">
                      {process.title}
                    </div>
                    <div className="text-white/60 text-sm">
                      {process.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* coluna direita */}
            <div className="lg:col-span-1 space-y-6">
              {/* Laboratoruo imagem */}
              <div
                className="bg-gradient-to-br h-80 md:h-full from-blue-500/20 to-purple-500/20 p-8 border border-white/10 relative overflow-hidden"
                onMouseEnter={(e) =>
                  handleImageHover(e.currentTarget as HTMLElement, true)
                }
                onMouseLeave={(e) =>
                  handleImageHover(e.currentTarget as HTMLElement, false)
                }
              >
                {/* mini icones-animações */}
                <div
                  ref={floatingIcon1Ref}
                  className="absolute top-4 right-4 text-blue-400 z-10"
                >
                  <Database className="h-8 w-8" />
                </div>
                <div
                  ref={floatingIcon2Ref}
                  className="absolute bottom-4 left-4 text-purple-400 z-10"
                >
                  <Cpu className="h-8 w-8" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
