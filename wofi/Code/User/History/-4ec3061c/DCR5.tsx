import { useEffect, useRef, useState } from "react";
import TitleSection from "../components/ui/TitleSection";
import gsap from "gsap";
import { ScrollTrigger, ScrollToPlugin } from "gsap/all";
import { dataSkills as dataSkillsObject } from "../mock-data";
import type { DataSkillItemType } from "../types/skillsTypes";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, useGSAP);

const RADIUS = 160;

const AreaItem = ({
  name,
  iconArr,
}: {
  name: string;
  iconArr: {
    name: string;
    icon: React.JSX.Element;
  }[];
}) => {
  const iconRefs = useRef<(HTMLDivElement | null)[]>([]);

  const angles = iconArr.map((_, i) => (360 / iconArr.length) * i);
  const positions = angles.map((angle) => {
    const rad = (angle * Math.PI) / 180;
    return {
      x: RADIUS * Math.cos(rad),
      y: RADIUS * Math.sin(rad),
    };
  });

  useGSAP(() => {
    const localAngles = [...angles];
    const speed = 0.5;

    const update = () => {
      localAngles.forEach((angle, i) => {
        localAngles[i] = (angle + speed) % 360;

        const rad = (localAngles[i] * Math.PI) / 180;
        const x = RADIUS * Math.cos(rad);
        const y = RADIUS * Math.sin(rad);

        gsap.set(iconRefs.current[i], {
          x,
          y,
        });
      });
    };

    gsap.ticker.add(update);

    return () => gsap.ticker.remove(update);
  }, [angles]);

  useGSAP(() => {
    requestAnimationFrame(() => {
      iconArr.forEach((_, i) => {
        const el = iconRefs.current[i];
        if (!el) return;

        const { x, y } = positions[i];

        gsap.fromTo(
          el,
          { x: 0, y: 0, opacity: 0, rotate: 0, scale: 0.6 },
          {
            x,
            y,
            opacity: 1,
            scale: 1,
            duration: 0.6,
            ease: "power3.out",
          }
        );
      });
    });
  }, [iconArr, positions]);

  return (
    <div className="border border-dashed border-border hover:border-primary flex flex-col justify-center items-center rounded-full size-80 group relative">
      <h1 className="text-2xl font-semibold px-2 text-center">{name}</h1>

      {iconArr.map((e, i) => {
        return (
          <div
            key={`${e.name}-${i}`}
            id={`${e.name}-${i}`}
            ref={(el) => {
              iconRefs.current[i] = el;
            }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <div className="flex w-fit items-center justify-center text-white hover:scale-110 transition">
              {e.icon}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const TitleTable = (props: {
  text: string;
  isActive: boolean;
  onClick: () => void;
}) => {
  const lineRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.to(lineRef.current, {
      width: props.isActive ? "100%" : "0%",
      duration: 0.5,
      ease: "power3.inOut",
    });
  }, [props.isActive]);

  return (
    <h3 onClick={props.onClick} className="cursor-pointer w-1/4 mr-8">
      <span className="font-semibold">{props.text}</span>
      <div
        ref={lineRef}
        className="relative bottom-0 left-0 w-full h-[0.05rem] bg-primary"
      />
      <div className="relative bottom-0 left-0 w-full h-[0.05rem] bg-border" />
    </h3>
  );
};
type SkillContent = {
  intro?: string;
  bullets: string[];
  outro?: string;
};

const contentData: Record<keyof typeof dataSkillsObject, SkillContent> = {
  Languages: {
    intro: "Bases sólidas para qualquer aplicação moderna.",
    bullets: [
      "Performance e escalabilidade",
      "Compatibilidade multiplataforma",
      "Clareza e produtividade no código",
    ],
    outro:
      "Essas linguagens me permitem entregar aplicações confiáveis e eficientes.",
  },

  Backend: {
    intro: "APIs robustas e dados sob controle.",
    bullets: [
      "Desenvolvimento de APIs seguras e escaláveis",
      "Estruturação da lógica de negócios",
      "Gerenciamento eficiente e seguro de dados",
    ],
    outro:
      "Do banco ao endpoint, foco em performance, segurança e arquitetura limpa.",
  },

  DevOps: {
    intro: "Confiabilidade do desenvolvimento à produção.",
    bullets: [
      "Automatização de processos com CI/CD",
      "Ambientes estáveis com containers e IaC",
      "Monitoramento e consistência em produção",
    ],
    outro:
      "Menos falhas, mais velocidade e previsibilidade nos ciclos de entrega.",
  },

  Frontend: {
    intro: "Experiências que encantam e funcionam.",
    bullets: [
      "Interfaces modernas e responsivas",
      "Acessibilidade e fluidez na experiência",
      "Design funcional e com foco no usuário",
    ],
    outro: "Construção visual com performance, clareza e impacto.",
  },
};

const skillsData = Object.keys(dataSkillsObject).map((category) => ({
  category: category,
  content: contentData[category] || `Descrição para ${category}.`,
  iconArr: dataSkillsObject[category],
}));

const TitleArea = (props: {
  activeIndex: number;
  onClick: (index: number) => void;
}) => {
  return (
    <div className="col-span-4 row-span-1 flex justify-between">
      {skillsData.map((skill, index) => (
        <TitleTable
          key={skill.category}
          text={skill.category}
          isActive={index === props.activeIndex}
          onClick={() => props.onClick(index)}
        />
      ))}
    </div>
  );
};

const ContentArea = () => {
  return (
    <div className="col-span-3 row-span-8 flex items-center relative">
      <div className="w-full">
        {skillsData.map((skill, index) => (
          <div
            key={skill.category}
            className="skill-content-item absolute top-0 left-0 w-full"
            style={{
              opacity: index === 0 ? 1 : 0,
              visibility: index === 0 ? "visible" : "hidden",
            }}
          >
            <div className="text-base font-extralight px-2 py-4 space-y-2 border-[0.05rem] border-border mr-8">
              {skill.content.intro && (
                <p className="leading-relaxed">{skill.content.intro}</p>
              )}
              <ul className="list-disc list-inside pl-4">
                {skill.content.bullets.map((bullet, i) => (
                  <li key={i}>{bullet}</li>
                ))}
              </ul>
              {skill.content.outro && (
                <p className="leading-relaxed">{skill.content.outro}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const IconsArea = (props: { activeIndex: number }) => {
  return (
    <div className="col-span-1 row-span-8 flex justify-center pt-4">
      {skillsData[props.activeIndex] && (
        <AreaItem
          key={skillsData[props.activeIndex].category} // Key para re-render
          name={skillsData[props.activeIndex].category}
          iconArr={skillsData[props.activeIndex].iconArr as DataSkillItemType[]}
        />
      )}
    </div>
  );
};

export default function SkillsN8N() {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isPinned, setIsPinned] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const stRef = useRef<ScrollTrigger | null>(null);

  const tlRef = useRef<GSAPTimeline | null>(null);

  useEffect(() => {
    if (!tlRef.current) return;
    tlRef.current.tweenTo(`section-${activeIndex}`);
  }, [activeIndex]);

  useGSAP(() => {
    const contentElements = gsap.utils.toArray<HTMLDivElement>(
      ".skill-content-item"
    );

    // Timeline para transições entre seções
    const tl = gsap.timeline({ paused: true });
    tlRef.current = tl;

    contentElements.forEach((el, i) => {
      if (i === 0) return;

      tl.to(
        contentElements[i - 1],
        { autoAlpha: 0, y: -20, duration: 0.3 },
        `+=${i === 1 ? 0.2 : 0.5}`
      )
        .addLabel(`section-${i}`)
        .fromTo(
          el,
          { autoAlpha: 0, y: 20 },
          { autoAlpha: 1, y: 0, duration: 0.3 }
        );
    });

    // ScrollTrigger principal
    stRef.current = ScrollTrigger.create({
      trigger: containerRef.current,
      pin: contentRef.current,
      pinType: "fixed",
      start: "top top",
      end: `+=${skillsData.length * window.innerHeight}`,
      scrub: true,
      animation: tl,
      pinSpacing: true,
      onUpdate: (self) => {
        let newIndex = 0;

        if (self.progress > 0.25) newIndex = 1;
        if (self.progress > 0.5) newIndex = 2;
        if (self.progress > 0.75) newIndex = 3;

        setActiveIndex((prev) => {
          if (prev !== newIndex) {
            return newIndex;
          }
          return prev;
        });
      },
      onToggle: (self) => {
        setIsPinned(self.isActive);
      },
    });
  }, []);

  const handleTitleClick = (index: number) => {
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

  return (
    <>
      <section
        id="skills"
        ref={containerRef}
        className="relative"
        style={{ height: `${skillsData.length * 100}vh` }}
      >
        <div
          ref={contentRef}
          className={`w-full h-screen flex items-center justify-center ${
            isPinned ? "fixed top-0 left-0 z-10" : ""
          }`}
        >
          <div className="max-w-7xl w-full mx-auto px-4">
            <div className="grid grid-cols-4 grid-rows-12 text-txt-primary gap-y-2 h-full">
              <div className="col-span-4 flex justify-center row-span-2 items-center">
                <TitleSection>Skills</TitleSection>
              </div>

              <TitleArea activeIndex={activeIndex} onClick={handleTitleClick} />
              <ContentArea />
              <IconsArea activeIndex={activeIndex} />

              {/* Espaço inferior */}
              <div className="col-span-4 row-span-2"></div>
            </div>
          </div>
        </div>
      </section>
      <section className="h-screen flex items-center justify-center"></section>
    </>
  );
}
