import { useRef, useState, useEffect } from "react";
import Section from "../components/ui/Section";
import TitleSection from "../components/ui/TitleSection";
import gsap from "gsap";
import { ScrollTrigger, ScrollToPlugin } from "gsap/all";
import { useGSAP } from "@gsap/react";
import { useSkillsData } from "../hooks/useSkillsData";
import SkillStepIndicator from "../components/skills/SkillStepIndicator";
import SkillTabNavigation from "../components/skills/SkillTabNavigation";
import SkillContentArea from "../components/skills/SkillContentArea";
import SkillIconsShowcase from "../components/skills/SkillIconsShowcase";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, useGSAP);

export default function Skills() {
  const skillsData = useSkillsData();
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const mobileContentRef = useRef<HTMLDivElement>(null);
  const stRef = useRef<ScrollTrigger | null>(null);
  const prevIndex = useRef(0);

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
        scrub: 1,
        pinSpacing: true,
        onUpdate: (self) => {
          const progress = self.progress;
          setScrollProgress(progress);
          
          const thresholds = skillsData.map((_, i) => i / (skillsData.length - 1));
          let newIndex = 0;
          
          thresholds.forEach((threshold, i) => {
            if (progress >= threshold) newIndex = i;
          });
          
          if (newIndex !== activeIndex) {
            setActiveIndex(newIndex);
          }
        },
      });
    });
    
    return () => mm.revert();
  }, [skillsData.length]);

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

  // Desktop content transition animation
  useEffect(() => {
    const mm = gsap.matchMedia();
    
    mm.add("(min-width: 1024px)", () => {
      const tl = gsap.timeline();
      const elements = gsap.utils.toArray<HTMLElement>(".skill-content-item");
      const prev = elements[prevIndex.current];
      const next = elements[activeIndex];

      if (prev && prev !== next) {
        tl.to(prev, { autoAlpha: 0, y: -20, duration: 0.4 });
      }
      if (next) {
        tl.fromTo(
          next,
          { autoAlpha: 0, y: 20 },
          { autoAlpha: 1, y: 0, duration: 0.4 }
        );
      }

      prevIndex.current = activeIndex;
    });
    
    return () => mm.revert();
  }, [activeIndex]);

  const handleStepClick = (index: number) => {
    if (!stRef.current) return;
    const totalDistance = skillsData.length * window.innerHeight;
    const targetProgress = index / (skillsData.length - 1);
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

  const currentStepProgress = Math.max(0, Math.min(1, 
    (scrollProgress - activeIndex / (skillsData.length - 1)) * (skillsData.length - 1)
  ));

  return (
    <Section id="skills">
      {/* Desktop Version */}
      <section
        ref={containerRef}
        className="relative hidden lg:block"
        style={{ height: `${skillsData.length * 100}vh` }}
      >
        <div
          ref={contentRef}
          className="w-full h-screen flex flex-col items-center justify-center"
        >
          <TitleSection>Skills</TitleSection>
          
          <div className="max-w-7xl w-full mx-auto px-4">
            <SkillStepIndicator
              steps={steps}
              activeIndex={activeIndex}
              onClick={handleStepClick}
              progress={currentStepProgress}
            />
            
            <div className="flex items-center justify-center gap-16 text-txt-primary">
              {/* Content Area */}
              <div className="flex-1 max-w-md relative">
                {skillsData.map((skill, index) => (
                  <div
                    key={skill.category}
                    className="skill-content-item absolute top-0 left-0 w-full"
                    style={{
                      opacity: index === activeIndex ? 1 : 0,
                      visibility: index === activeIndex ? "visible" : "hidden",
                    }}
                  >
                    <SkillContentArea content={skill.content} />
                  </div>
                ))}
              </div>

              {/* Icons Area */}
              <div className="flex justify-center">
                <SkillIconsShowcase 
                  iconArr={activeSkill.iconArr} 
                  variant="desktop" 
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Version */}
      <div className="lg:hidden w-full min-h-screen flex flex-col items-center justify-center py-16">
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
            />
          </div>
        </div>
      </div>
    </Section>
  );
}