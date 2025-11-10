import { useEffect, useRef, useState, memo } from "react";
import Section from "../components/ui/Section";
import TitleSection from "../components/ui/TitleSection";
import gsap from "gsap";
import { ScrollTrigger, ScrollToPlugin } from "gsap/all";
import { useGSAP } from "@gsap/react";
import { dataSkills as dataSkillsObject } from "../mock-data";
import type { DataSkillItemType } from "../types/skillsTypes";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, useGSAP);

const RADIUS_BASE = 160;
const RADIUS_MOBILE = 120;

const AreaItem = memo(
  ({
    name,
    iconArr,
  }: {
    name: string;
    iconArr: { name: string; icon: React.JSX.Element }[];
  }) => {
    const iconRefs = useRef<(HTMLDivElement | null)[]>([]);
    const radius =
      typeof window !== "undefined" && window.innerWidth < 640
        ? RADIUS_MOBILE
        : RADIUS_BASE;

    const angles = iconArr.map((_, i) => (360 / iconArr.length) * i);
    const positions = angles.map((angle) => {
      const rad = (angle * Math.PI) / 180;
      return {
        x: radius * Math.cos(rad),
        y: radius * Math.sin(rad),
      };
    });

    useGSAP(() => {
      const localAngles = [...angles];
      const speed = 0.5;
      const update = () => {
        localAngles.forEach((angle, i) => {
          localAngles[i] = (angle + speed) % 360;
          const rad = (localAngles[i] * Math.PI) / 180;
          gsap.set(iconRefs.current[i], {
            x: radius * Math.cos(rad),
            y: radius * Math.sin(rad),
          });
        });
      };
      gsap.ticker.add(update);
      return () => gsap.ticker.remove(update);
    }, [angles, radius]);

    useGSAP(() => {
      iconArr.forEach((_, i) => {
        const el = iconRefs.current[i];
        if (!el) return;
        const { x, y } = positions[i];
        gsap.fromTo(
          el,
          { x: 0, y: 0, opacity: 0, scale: 0.6 },
          {
            x,
            y,
            opacity: 1,
            scale: 1,
            duration: 0.6,
            ease: "power3.out",
            delay: i * 0.05,
          }
        );
      });
    }, [iconArr, positions]);

    return (
      <div className="border border-dashed border-border hover:border-primary flex flex-col justify-center items-center rounded-full w-72 h-72 relative">
        <h1 className="text-2xl font-semibold text-center px-2">{name}</h1>
        {iconArr.map((e, i) => (
          <div
            key={`${e.name}-${i}`}
            //@ts-expect-error
            ref={(el) => (iconRefs.current[i] = el)}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none will-change-transform"
          >
            <div className="flex items-center justify-center text-white transition-transform duration-300 hover:scale-110">
              {e.icon}
            </div>
          </div>
        ))}
      </div>
    );
  }
);

const TitleTable = memo(
  (props: { text: string; isActive: boolean; onClick: () => void }) => {
    const lineRef = useRef<HTMLDivElement>(null);
    useGSAP(() => {
      gsap.to(lineRef.current, {
        width: props.isActive ? "100%" : "0%",
        duration: 0.5,
        ease: "power3.inOut",
      });
    }, [props.isActive]);
    return (
      <h3
        onClick={props.onClick}
        className="cursor-pointer text-center w-1/4 sm:text-left"
      >
        <span className="font-semibold">{props.text}</span>
        <div
          ref={lineRef}
          className="h-[0.1rem] bg-primary mt-1 transition-all duration-500"
        />
      </h3>
    );
  }
);

type SkillContent = { intro?: string; bullets: string[]; outro?: string };

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
  category,
  content: contentData[category],
  iconArr: dataSkillsObject[category] as DataSkillItemType[],
}));

const TitleArea = (props: {
  activeIndex: number;
  onClick: (i: number) => void;
}) => (
  <div className="col-span-4 flex justify-between mb-4">
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

const ContentArea = (props: { activeIndex: number }) => (
  <div className="col-span-3 flex items-center relative">
    <div className="w-full relative">
      {skillsData.map((skill, index) => (
        <div
          key={skill.category}
          className="skill-content-item absolute top-0 left-0 w-full"
          style={{
            opacity: index === props.activeIndex ? 1 : 0,
            visibility: index === props.activeIndex ? "visible" : "hidden",
          }}
        >
          <div className="text-base font-extralight px-2 py-4 space-y-2 border-[0.05rem] border-border rounded-md">
            {skill.content.intro && (
              <p className="leading-relaxed">{skill.content.intro}</p>
            )}
            <ul className="list-disc list-inside pl-4">
              {skill.content.bullets.map((b, i) => (
                <li key={i}>{b}</li>
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

const IconsArea = (props: { activeIndex: number }) => (
  <div className="col-span-1 flex justify-center pt-4">
    {skillsData[props.activeIndex] && (
      <AreaItem
        name={skillsData[props.activeIndex].category}
        iconArr={skillsData[props.activeIndex].iconArr}
      />
    )}
  </div>
);

export default function SkillsDesktop() {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const stRef = useRef<ScrollTrigger | null>(null);
  const prevIndex = useRef(0);

  useEffect(() => {
    const tl = gsap.timeline();
    const elements = gsap.utils.toArray<HTMLElement>(".skill-content-item");
    const prev = elements[prevIndex.current];
    const next = elements[activeIndex];

    if (prev && prev !== next)
      tl.to(prev, { autoAlpha: 0, y: -20, duration: 0.4 });
    if (next)
      tl.fromTo(
        next,
        { autoAlpha: 0, y: 20 },
        { autoAlpha: 1, y: 0, duration: 0.4 }
      );

    prevIndex.current = activeIndex;
  }, [activeIndex]);

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
        const thresholds = [0.25, 0.5, 0.75, 1];
        let newIndex = 0;
        thresholds.forEach((t, i) => {
          if (self.progress > t) newIndex = i + 1;
        });
        setActiveIndex((prev) => (prev !== newIndex ? newIndex : prev));
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
    <Section id="s">
      <section
        id="skills"
        ref={containerRef}
        className="relative"
        style={{ height: `${skillsData.length * 100}vh` }}
      >
        <div
          ref={contentRef}
          className="w-full h-screen flex flex-col items-center justify-center"
        >
          <TitleSection>Skills</TitleSection>
          <div className="max-w-7xl w-full mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-txt-primary">
              <TitleArea activeIndex={activeIndex} onClick={handleTitleClick} />
              <ContentArea activeIndex={activeIndex} />
              <IconsArea activeIndex={activeIndex} />
            </div>
          </div>
        </div>
      </section>
      <section className="h-screen" />
    </Section>
  );
}
