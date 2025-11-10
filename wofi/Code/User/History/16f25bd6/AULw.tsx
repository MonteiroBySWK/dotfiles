"use client";

import React, {
  memo,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { gsap } from "gsap";
import Image from "next/image";
import TitleSection from "../components/TitleSection";

interface Tecnologia {
  nome: string;
  logo: string;
}

const tecnologiasLinha1: Tecnologia[] = [
  { nome: "React", logo: "/logos/react.svg" },
  { nome: "Next.js", logo: "/logos/nextjs.svg" },
  { nome: "TypeScript", logo: "/logos/typescript.svg" },
  { nome: "JavaScript", logo: "/logos/javascript.svg" },
  { nome: "Node.js", logo: "/logos/nodejs.svg" },
  { nome: "HTML5", logo: "/logos/html5.svg" },
  { nome: "CSS3", logo: "/logos/css3.svg" },
  { nome: "TailwindCSS", logo: "/logos/tailwind.svg" },
];

const tecnologiasLinha2: Tecnologia[] = [
  { nome: "Python", logo: "/logos/python.svg" },
  { nome: "Django", logo: "/logos/django.svg" },
  { nome: "PostgreSQL", logo: "/logos/postgresql.svg" },
  { nome: "MongoDB", logo: "/logos/mongodb.svg" },
  { nome: "Docker", logo: "/logos/docker.svg" },
  { nome: "AWS", logo: "/logos/aws.svg" },
  { nome: "Firebase", logo: "/logos/firebase.svg" },
  { nome: "GraphQL", logo: "/logos/graphql.svg" },
];

const tecnologiasLinha3: Tecnologia[] = [
  { nome: "Rust", logo: "/logos/rust.svg" },
  { nome: "Web Assembly", logo: "/logos/wasm.svg" },
  { nome: "Java", logo: "/logos/java.svg" },
  { nome: "Spring", logo: "/logos/spring.svg" },
  { nome: "Electron", logo: "/logos/electron.svg" },
  { nome: "Kotlin", logo: "/logos/kotlin.svg" },
  { nome: "Linux", logo: "/logos/linux.svg" },
  { nome: "NGINX", logo: "/logos/nginx.svg" },
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
      <div id="tech" className="flex flex-col items-center justify-center p-3 mx-3 md:mx-10 h-28 w-20 text-white">
        <div className="relative w-14 md:w-18 h-14 md:h-18 mb-2">
          {tecnologia.logo ? (
            <Image
              src={tecnologia.logo}
              alt={`${tecnologia.nome} logo`}
              fill
              sizes="40px"
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

  useEffect(() => {
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

      <div
        ref={containerRef}
        className="flex items-center"
      >
        {items.map((tech, index) => (
          <TecnologiaCard key={`${tech.nome}-${index}`} tecnologia={tech} />
        ))}
      </div>
    </div>
  );
};

const TecnologiasShowcase: React.FC = () => {
  return (
    <section className="py-12 overflow-x-hidden bg-[#0d0126]">
      <div className="container mx-auto px-4">
        <TitleSection text="Nossas Tecnologias" />
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
    </section>
  );
};

export default TecnologiasShowcase;