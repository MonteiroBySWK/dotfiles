import { useRef, useState } from "react";
import Section from "../components/ui/Section";
import TitleSection from "../components/ui/TitleSection";
import gsap from "gsap";
import { ScrollTrigger, ScrollToPlugin } from "gsap/all";
import { useGSAP } from "@gsap/react";
import { useSkillsData } from "../hooks/useSkillsData";
import { SkillIconsShowcase } from "../components/skills/SkillIconsShowcase";
import { SkillStepIndicator } from "../components/skills/SkillStepIndicator";
import { SkillContentArea } from "../components/skills/SkillContentArea";
import { SkillTabNavigation } from "../components/skills/SkillTabNavigation";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, useGSAP);

export default function Skills() {
  const skillsData = useSkillsData();
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const mobileContentRef = useRef<HTMLDivElement>(null);
  const stRef = useRef<ScrollTrigger | null>(null);

  const steps = skillsData.map(skill => skill.category);
  const activeSkill = skillsData[activeIndex];

  // Desktop ScrollTrigger setup
  useGSAP(() => {
    const mm = gsap.matchMedia();
    
    mm.add("(min-width: 1024px)", () => {
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
          
          const sectionSize = 1 / skillsData.length;
          let newIndex = Math.floor(progress / sectionSize);
          newIndex = Math.min(newIndex, skillsData.length - 1);
          
          setActiveIndex((prev) => (prev !== newIndex ? newIndex : prev));
        },
      });

      return () => {
        if (stRef.current) {
          stRef.current.kill();
        }
      };
    });
    
    return () => mm.revert();
  }, [skillsData.length]);

  // Desktop content animation
  useGSAP(() => {
    const mm = gsap.matchMedia();
    
    mm.add("(min-width: 1024px)", () => {
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
    });
    
    return () => mm.revert();
  }, [activeIndex]);

  // Mobile content animation
  useGSAP(() => {
    const mm = gsap.matchMedia();
    
    mm.add("(max-width: 1023px)", () => {
      if (mobileContentRef.current) {
        gsap.fromTo(
          mobileContentRef.current,
          { autoAlpha: 0, y: 20 },
          { autoAlpha: 1, y: 0, duration: 0.5, ease: "power3.out" }
        );
      }
    });
    
    return () => mm.revert();
  }, [activeIndex]);

  const handleStepClick = (index: number) => {
    if (!stRef.current) return;
    
    const totalDistance = skillsData.length * window.innerHeight;
    const targetProgress = (index + 0.5) / skillsData.length;
    const targetScroll = stRef.current.start + totalDistance * targetProgress;
    
    gsap.to(window, {
      duration: 1,
      scrollTo: targetScroll,
      ease: "power2.inOut",
    });
  };

  const handleTabClick = (index: number) => {
    setActiveIndex(index);
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
    <>
      {/* Desktop Version */}
      <Section id="skills" className="hidden lg:block">
        <div
          ref={containerRef}
          className="relative w-full"
          style={{ height: `${skillsData.length * 100}vh` }}
        >
          <div
            ref={contentRef}
            className="w-full h-screen flex flex-col justify-start lg:justify-center px-8 lg:px-16 py-8 lg:py-16"
          >
            <div className="max-w-7xl mx-auto w-full">
              <header className="flex flex-col gap-y-4 items-center mb-8 lg:mb-16">
                <TitleSection>Skills</TitleSection>
              </header>

              <SkillStepIndicator
                steps={steps}
                activeIndex={activeIndex}
                onClick={handleStepClick}
                progress={currentStepProgress}
              />
              
              <div className="flex flex-col gap-y-6 lg:gap-y-8">
                <div className="flex flex-col md:flex-row gap-x-8 gap-y-6">
                  
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
                        
                        <SkillContentArea 
                          content={skill.content} 
                          variant="desktop"
                        />
                      </div>
                    ))}
                  </div>

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
        
        <div className="h-screen" />

        <div className="w-full min-h-screen flex flex-col items-center justify-center py-16 lg:hidden">
          <TitleSection>Skills</TitleSection>
          
          <div className="max-w-7xl w-full mx-auto px-4 flex flex-col items-center text-txt-primary">
            <SkillTabNavigation
              tabs={steps}
              activeIndex={activeIndex}
              onClick={handleTabClick}
            />

            <div
              key={activeIndex}
              ref={mobileContentRef}
              className="w-full flex flex-col items-center justify-center gap-8"
            >
              <SkillIconsShowcase 
                iconArr={activeSkill.iconArr} 
                variant="mobile" 
              />

              <SkillContentArea 
                content={activeSkill.content}
                className="w-full max-w-md"
                variant="mobile"
              />
            </div>
          </div>
        </div>
      </Section>

      {/* Mobile Version */}
      <Section id="skills-mobile" className="lg:hidden">
        
      </Section>
    </>
  );
}