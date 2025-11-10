import { useRef, useState, memo } from "react";
import Section from "../components/ui/Section";
import TitleSection from "../components/ui/TitleSection";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { dataSkills as dataSkillsObject } from "../mock-data";
import type { DataSkillItemType } from "../types/skillsTypes";

// GSAP e seus plugins são mantidos para as micro-animações.
// O ScrollToPlugin não é mais necessário, mas pode ser mantido se usado em outro lugar.
gsap.registerPlugin(useGSAP);

const RADIUS_BASE = 160;
const RADIUS_MOBILE = 120;

// O componente AreaItem permanece praticamente o mesmo, pois sua lógica de animação
// dos ícones em órbita é independente do layout da página.
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

    // Animação contínua de rotação
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

    // Animação de entrada dos ícones
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
      <div className="border border-dashed border-border hover:border-primary flex flex-col justify-center items-center rounded-full w-72 h-72 sm:w-80 sm:h-80 relative flex-shrink-0">
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

// O componente de título da aba permanece o mesmo, sua funcionalidade é perfeita para o novo design.
const TitleTab = memo(
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
      <button
        onClick={props.onClick}
        className="cursor-pointer text-center flex-1 py-2"
      >
        <span className="font-semibold text-sm sm:text-base">{props.text}</span>
        <div
          ref={lineRef}
          className="h-[0.1rem] bg-primary mt-1 mx-auto"
          style={{ width: props.isActive ? '100%' : '0%' }}
        />
      </button>
    );
  }
);

// Tipagem e dados de conteúdo permanecem os mesmos.
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

// Estrutura de dados principal, sem alterações.
const skillsData = Object.keys(dataSkillsObject).map((category) => ({
  category: category as keyof typeof dataSkillsObject,
  content: contentData[category],
  iconArr: dataSkillsObject[category] as DataSkillItemType[],
}));

export default function SkillsN8N() {
  const [activeIndex, setActiveIndex] = useState(0);
  const contentContainerRef = useRef<HTMLDivElement>(null);

  // Animação de transição suave (fade in/out) para o conteúdo ao trocar de aba.
  useGSAP(() => {
    gsap.fromTo(
      contentContainerRef.current,
      { autoAlpha: 0, y: 20 },
      { autoAlpha: 1, y: 0, duration: 0.5, ease: "power3.out" }
    );
  }, [activeIndex]);

  const activeSkill = skillsData[activeIndex];

  return (
    <Section id="skills">
      {/* O container agora tem uma altura natural e centraliza o conteúdo */}
      <div className="w-full min-h-screen flex flex-col items-center justify-center py-16 sm:py-24">
        <TitleSection>Skills</TitleSection>
        <div className="max-w-7xl w-full mx-auto px-4 flex flex-col items-center text-txt-primary">
          
          {/* Área das Abas (Tabs) */}
          <div className="w-full max-w-2xl flex justify-between mb-8 border-b border-border">
            {skillsData.map((skill, index) => (
              <TitleTab
                key={skill.category}
                text={skill.category}
                isActive={index === activeIndex}
                onClick={() => setActiveIndex(index)}
              />
            ))}
          </div>

          {/* Container do Conteúdo Ativo - a key força a remontagem e re-animação */}
          <div
            key={activeIndex}
            ref={contentContainerRef}
            className="w-full flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16"
          >
            {/* Área dos Ícones em Órbita */}
            <IconsArea name={activeSkill.category} iconArr={activeSkill.iconArr} />
            
            {/* Área de Conteúdo (Texto) */}
            <ContentArea content={activeSkill.content} />
          </div>

        </div>
      </div>
    </Section>
  );
}

// Componentes internos para melhor organização

const IconsArea = (props: { name: string, iconArr: DataSkillItemType[] }) => (
  <div className="flex justify-center pt-4">
    <AreaItem
      name={props.name}
      iconArr={props.iconArr}
    />
  </div>
);

const ContentArea = (props: { content: SkillContent }) => (
  <div className="w-full max-w-md lg:max-w-sm text-base font-extralight space-y-3 border-[0.05rem] border-border rounded-md p-6">
    {props.content.intro && (
      <p className="leading-relaxed">{props.content.intro}</p>
    )}
    <ul className="list-disc list-inside space-y-1">
      {props.content.bullets.map((b, i) => (
        <li key={i}>{b}</li>
      ))}
    </ul>
    {props.content.outro && (
      <p className="leading-relaxed">{props.content.outro}</p>
    )}
  </div>
);