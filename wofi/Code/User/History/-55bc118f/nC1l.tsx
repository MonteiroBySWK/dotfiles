import React, {
  memo,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { gsap } from "gsap";
import TitleSection from "./ui/TitleSection";
import FadeIn from "./animation/FadeIn";

// Importando os logos
import reactLogo from "../assets/logos/react.svg";
import nextjsLogo from "../assets/logos/nextjs.svg";
import typescriptLogo from "../assets/logos/typescript.svg";
import javascriptLogo from "../assets/logos/javascript.svg";
import nodejsLogo from "../assets/logos/nodejs.svg";
import html5Logo from "../assets/logos/html5.svg";
import css3Logo from "../assets/logos/css3.svg";
import tailwindLogo from "../assets/logos/tailwind.svg";
import pythonLogo from "../assets/logos/python.svg";
import djangoLogo from "../assets/logos/django.svg";
import postgresqlLogo from "../assets/logos/postgresql.svg";
import mongodbLogo from "../assets/logos/mongodb.svg";
import dockerLogo from "../assets/logos/docker.svg";
import awsLogo from "../assets/logos/aws.svg";
import firebaseLogo from "../assets/logos/firebase.svg";
import graphqlLogo from "../assets/logos/graphql.svg";
import rustLogo from "../assets/logos/rust.svg";
import wasmLogo from "../assets/logos/wasm.svg";
import javaLogo from "../assets/logos/java.svg";
import springLogo from "../assets/logos/spring.svg";
import electronLogo from "../assets/logos/electron.svg";
import kotlinLogo from "../assets/logos/kotlin.svg";
import linuxLogo from "../assets/logos/linux.svg";
import nginxLogo from "../assets/logos/nginx.svg";

interface Tecnologia {
  nome: string;
  logo: string;
}

const tecnologiasLinha1: Tecnologia[] = [
  { nome: "React", logo: reactLogo },
  { nome: "Next.js", logo: nextjsLogo },
  { nome: "TypeScript", logo: typescriptLogo },
  { nome: "JavaScript", logo: javascriptLogo },
  { nome: "Node.js", logo: nodejsLogo },
  { nome: "HTML5", logo: html5Logo },
  { nome: "CSS3", logo: css3Logo },
  { nome: "TailwindCSS", logo: tailwindLogo },
];

const tecnologiasLinha2: Tecnologia[] = [
  { nome: "Python", logo: pythonLogo },
  { nome: "Django", logo: djangoLogo },
  { nome: "PostgreSQL", logo: postgresqlLogo },
  { nome: "MongoDB", logo: mongodbLogo },
  { nome: "Docker", logo: dockerLogo },
  { nome: "AWS", logo: awsLogo },
  { nome: "Firebase", logo: firebaseLogo },
  { nome: "GraphQL", logo: graphqlLogo },
];

const tecnologiasLinha3: Tecnologia[] = [
  { nome: "Rust", logo: rustLogo },
  { nome: "Web Assembly", logo: wasmLogo },
  { nome: "Java", logo: javaLogo },
  { nome: "Spring", logo: springLogo },
  { nome: "Electron", logo: electronLogo },
  { nome: "Kotlin", logo: kotlinLogo },
  { nome: "Linux", logo: linuxLogo },
  { nome: "NGINX", logo: nginxLogo },
];

const TecnologiaCard: React.FC<{ tecnologia: Tecnologia }> = memo(
  ({ tecnologia }) => {
    let invert = "";
    if (
      tecnologia.nome === "Next.js" ||
      tecnologia.nome === "AWS" ||
      tecnologia.nome === "Rust"
    ) {
      invert = "invert";
    }
    return (
      <div
        id="tech"
        className="flex flex-col items-center justify-center p-3 mx-3 md:mx-10 h-28 w-20 text-white"
      >
        <div className="relative w-14 md:w-18 h-14 md:h-18 mb-2">
          {tecnologia.logo ? (
            <img
              src={tecnologia.logo}
              alt={`${tecnologia.nome} logo`}
              style={{ objectFit: "contain" }}
              className={`${invert}`}
            />
          ) : (
            <div className="w-full h-full bg-white bg-opacity-30 rounded-full flex items-center justify-center">
              {tecnologia.nome.charAt(0)}
            </div>
          )}
        </div>
      </div>
    );
  }
);

function useContainerWidth(
  ref: React.RefObject<HTMLDivElement>,
  itens: Tecnologia[]
) {
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    if (!ref.current) return;

    const observer = new ResizeObserver(() => {
      if (ref.current) {
        let totalWidth = 0;
        const cards = ref.current.children;
        for (let i = 0; i < itens.length; i++) {
          const card = cards[i] as HTMLElement;
          if (card) {
            const style = window.getComputedStyle(card);
            totalWidth +=
              card.offsetWidth +
              parseFloat(style.marginLeft || "0") +
              parseFloat(style.marginRight || "0");
          }
        }
        setWidth(totalWidth);
      }
    });

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, itens]);

  return width;
}

const LinhaInfinita: React.FC<{
  tecnologias: Tecnologia[];
  direction: "left" | "right";
  speed: number;
}> = ({ tecnologias, direction, speed }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<gsap.core.Timeline | null>(null);

  const containerWidth = useContainerWidth(containerRef, tecnologias);

  const duration = tecnologias.length * (10 / speed);

  const [visibleItemCount, setVisibleItemCount] = useState(0);

  useEffect(() => {
    const calcularQuantidade = () => {
      const largura = window.innerWidth;
      setVisibleItemCount(Math.ceil(largura / 100) + 2);
    };

    calcularQuantidade();
    window.addEventListener("resize", calcularQuantidade);
    return () => window.removeEventListener("resize", calcularQuantidade);
  }, []);

  useLayoutEffect(() => {
    if (!containerRef.current || containerWidth === 0) return;

    // Limpa a animação anterior se existir
    if (animationRef.current) {
      animationRef.current.kill();
    }

    const container = containerRef.current;

    // Define as posições inicial e final baseado na direção
    const startX = direction === "left" ? 0 : -containerWidth;
    const endX = direction === "left" ? -containerWidth : 0;

    // Define a posição inicial
    gsap.set(container, { x: startX });

    // Cria a animação infinita
    animationRef.current = gsap.timeline({ repeat: -1 });
    animationRef.current.to(container, {
      x: endX,
      duration: duration,
      ease: "none",
    });

    return () => {
      if (animationRef.current) {
        animationRef.current.kill();
      }
    };
  }, [containerWidth, direction, duration]);

  const items = Array.from(
    { length: visibleItemCount * 3 },
    (_, i) => tecnologias[i % tecnologias.length]
  );

  return (
    <div className="relative overflow-hidden py-2 w-full">
      <div className="absolute left-0 top-0 w-16 h-full z-2 pointer-events-none bg-gradient-to-r from-[#0d0126] to-transparent"></div>
      <div className="absolute right-0 top-0 w-16 h-full z-2 pointer-events-none bg-gradient-to-l from-[#0d0126] to-transparent"></div>

      <div ref={containerRef} className="flex items-center">
        {items.map((tech, index) => (
          <TecnologiaCard key={`${tech.nome}-${index}`} tecnologia={tech} />
        ))}
      </div>
    </div>
  );
};

const TecnologiasShowcase: React.FC = () => {
  return (
    <section className="w-full">
      <FadeIn>
        <div className="py-12 overflow-x-hidden bg-[#0d0126]">
          <div className="container mx-auto px-4">
            <TitleSection>Nossas Tecnologias</TitleSection>
            <p className="text-xl text-gray-300 text-center mb-12">
              Criamos soluções inovadoras de alta performance, utilizando as
              melhores tecnologias do mercado.
            </p>
          </div>

          <div className="space-y-6 lg:container mx-auto">
            <LinhaInfinita
              tecnologias={tecnologiasLinha1}
              direction="left"
              speed={8}
            />
            <LinhaInfinita
              tecnologias={tecnologiasLinha2}
              direction="right"
              speed={4}
            />
            <LinhaInfinita
              tecnologias={tecnologiasLinha3}
              direction="left"
              speed={6}
            />
          </div>
        </div>
      </FadeIn>
    </section>
  );
};

export default TecnologiasShowcase;
