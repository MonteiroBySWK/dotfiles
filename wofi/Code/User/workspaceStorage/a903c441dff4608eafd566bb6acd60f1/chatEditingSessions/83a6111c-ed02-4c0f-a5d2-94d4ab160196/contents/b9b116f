// Skills.tsx (Apenas Desktop - Corrigido)
import { useRef, useState, useEffect } from "react";
import Section from "../components/ui/Section";
import TitleSection from "../components/ui/TitleSection";
import gsap from "gsap";
import { ScrollTrigger, ScrollToPlugin } from "gsap/all";
import { useGSAP } from "@gsap/react";
import { useSkillsData } from "../hooks/useSkillsData";
import SkillContentArea from "../components/skills/SkillContentArea";
import SkillIconsShowcase from "../components/skills/SkillIconsShowcase";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, useGSAP);

const DesktopSkillStepIndicator = ({ 
  steps, 
  activeIndex, 
  onClick, 
  progress = 0 
}: {
  steps: string[];
  activeIndex: number;
  onClick: (index: number) => void;
  progress?: number;
}) => {
  const stepRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Animação das larguras dos botões - todos começam iguais
  useGSAP(() => {
    stepRefs.current.forEach((stepRef, index) => {
      if (!stepRef) return;
      
      const isActive = index === activeIndex;
      // Todos começam com largura base igual, exceto o primeiro que é um pouco maior
      const baseWidth = 20; // Largura base igual para todos
      const activeWidth = isActive ? baseWidth * 1.5 : baseWidth; // 50% maior quando ativo
      
      gsap.to(stepRef, {
        width: `${activeWidth}%`,
        duration: 0.5,
        ease: "power3.inOut",
      });
    });
  }, [activeIndex]);

  return (
    <div className="flex items-start justify-center gap-x-[2%] mb-14">
      {steps.map((step, index) => {
        const isActive = index === activeIndex;
        const isPassed = index < activeIndex;
        const isInProgress = index === activeIndex && progress > 0;
        
        return (
          <button
            key={step}
            ref={(el) => (stepRefs.current[index] = el)}
            onClick={() => onClick(index)}
            className="text-left transition-all duration-500 ease-in-out"
          >
            <div className="relative mb-1 h-[1px] bg-[#7d8082]">
              <span 
                className="absolute left-0 top-0 z-20 h-full bg-white transition-all duration-500"
                style={{ 
                  width: isPassed ? "100%" : isInProgress ? `${progress * 100}%` : "0%" 
                }}
              />
            </div>
            <h3 className={`font-geomanist text-xs md:text-md lg:text-lg transition-all duration-500 ${
              isActive ? 'opacity-100 text-white' : 'opacity-50 text-white'
            }`}>
              {step}
            </h3>
          </button>
        );
      })}
    </div>
  );
};

export default function SkillsDesktop() {
  const skillsData = useSkillsData();
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const stRef = useRef<ScrollTrigger | null>(null);

  const steps = skillsData.map(skill => skill.category);
  const activeSkill = skillsData[activeIndex];

  // Desktop ScrollTrigger setup
  useGSAP(() => {
    if (!containerRef.current || !contentRef.current) return;
    
    stRef.current = ScrollTrigger.create({
      trigger: containerRef.current,
      pin: contentRef.current,
      start: "top top",
      end: `+=${skillsData.length * window.innerHeight}`,
      scrub: true,
      pinSpacing: true,
      onUpdate: (self) => {
        const progress = self.progress;
        setScrollProgress(progress);
        
        // Calcula qual seção deve estar ativa
        const sectionSize = 1 / skillsData.length;
        let newIndex = Math.floor(progress / sectionSize);
        
        // Garante que não exceda o índice máximo
        newIndex = Math.min(newIndex, skillsData.length - 1);
        
        setActiveIndex((prev) => (prev !== newIndex ? newIndex : prev));
      },
    });

    return () => {
      if (stRef.current) {
        stRef.current.kill();
      }
    };
  }, [skillsData.length]);

  // Animação de transição do conteúdo - sem sobreposição
  useGSAP(() => {
    const contentElements = gsap.utils.toArray<HTMLElement>(".desktop-skill-content");
    
    contentElements.forEach((el, index) => {
      if (index === activeIndex) {
        gsap.to(el, {
          autoAlpha: 1,
          y: 0,
          duration: 0.5,
          ease: "power3.out"
        });
      } else {
        gsap.to(el, {
          autoAlpha: 0,
          y: index < activeIndex ? -20 : 20,
          duration: 0.3,
          ease: "power3.out"
        });
      }
    });
  }, [activeIndex]);

  const handleStepClick = (index: number) => {
    if (!stRef.current) return;
    
    const totalDistance = skillsData.length * window.innerHeight;
    const targetProgress = (index + 0.5) / skillsData.length; // +0.5 para ir ao meio da seção
    const targetScroll = stRef.current.start + totalDistance * targetProgress;
    
    gsap.to(window, {
      duration: 1,
      scrollTo: targetScroll,
      ease: "power2.inOut",
    });
  };

  // Progresso dentro da seção atual
  const currentStepProgress = (() => {
    const sectionSize = 1 / skillsData.length;
    const sectionStart = activeIndex * sectionSize;
    const sectionEnd = (activeIndex + 1) * sectionSize;
    
    if (scrollProgress < sectionStart || scrollProgress > sectionEnd) return 0;
    
    return (scrollProgress - sectionStart) / sectionSize;
  })();

  return (
    <Section id="skills" className="hidden lg:block">
      {/* Container principal com altura total */}
      <div
        ref={containerRef}
        className="relative w-full"
        style={{ height: `${skillsData.length * 100}vh` }}
      >
        {/* Conteúdo fixo que será "pinnado" */}
        <div
          ref={contentRef}
          className="w-full h-screen flex flex-col justify-start lg:justify-center px-8 lg:px-16 py-8 lg:py-16"
        >
          <div className="max-w-7xl mx-auto w-full">
            {/* Título */}
            <header className="flex flex-col gap-y-4 items-center mb-8 lg:mb-16">
              <TitleSection>Skills</TitleSection>
            </header>

            {/* Indicadores de Progresso */}
            <DesktopSkillStepIndicator
              steps={steps}
              activeIndex={activeIndex}
              onClick={handleStepClick}
              progress={currentStepProgress}
            />
            
            {/* Grid Principal */}
            <div className="flex flex-col gap-y-6 lg:gap-y-8">
              <div className="flex flex-col md:flex-row gap-x-8 gap-y-6">
                
                {/* Área do Conteúdo - 60% */}
                <div className="w-full md:w-3/5 relative min-h-[300px]">
                  {skillsData.map((skill, index) => (
                    <div
                      key={skill.category}
                      className="desktop-skill-content absolute top-0 left-0 w-full"
                      style={{
                        visibility: index === activeIndex ? "visible" : "hidden",
                      }}
                    >
                      <h3 className="text-2xl md:text-3xl font-geomanist-book text-white mb-4">
                        {skill.category === "Languages" && "Linguagens que domino"}
                        {skill.category === "Backend" && "Backend robusto"}
                        {skill.category === "DevOps" && "DevOps confiável"}
                        {skill.category === "Frontend" && "Frontend moderno"}
                      </h3>
                      
                      <div className="space-y-3">
                        {skill.content.intro && (
                          <p className="text-gray-300 leading-relaxed">{skill.content.intro}</p>
                        )}
                        <ul className="space-y-2">
                          {skill.content.bullets.map((bullet, i) => (
                            <li key={i} className="flex items-start gap-x-2">
                              <svg 
                                className="shrink-0 text-gray-400 mt-1" 
                                style={{ fontSize: '18px' }} 
                                width="1em" 
                                height="1em" 
                                viewBox="0 0 24 24"
                              >
                                <path fill="currentColor" d="M18.71 7.21a1 1 0 0 0-1.42 0l-7.45 7.46l-3.13-3.14A1 1 0 1 0 5.29 13l3.84 3.84a1 1 0 0 0 1.42 0l8.16-8.16a1 1 0 0 0 0-1.47"></path>
                              </svg>
                              <span className="text-sm md:text-base text-gray-300">{bullet}</span>
                            </li>
                          ))}
                        </ul>
                        {skill.content.outro && (
                          <p className="text-gray-300 leading-relaxed">{skill.content.outro}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Área dos Ícones - 40% */}
                <div className="w-full md:w-2/5 flex justify-center items-center">
                  <div className="w-full max-w-sm flex justify-center">
                    <SkillIconsShowcase 
                      iconArr={activeSkill.iconArr} 
                      variant="desktop" 
                    />
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Seção vazia para dar espaço após o scroll */}
      <div className="h-screen" />
    </Section>
  );
}