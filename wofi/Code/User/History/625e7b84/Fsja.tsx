"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
} from "react";

type LinkItemProps = {
  link: string;
  name: string;
  active: boolean;
  onClick: (e: MouseEvent<HTMLAnchorElement>) => void;
  isDisabled: boolean;
};

const LinkItem = ({
  link,
  name,
  active,
  onClick,
  isDisabled,
}: LinkItemProps) => {
  const linkRef = useRef<HTMLAnchorElement>(null);

  useGSAP(() => {
    if (!linkRef.current) return;

    gsap.to(linkRef.current, {
      backgroundColor: active ? "#4ade80" : "transparent",
      duration: 0.2,
    });
  }, [active]);

  return (
    <a
      ref={linkRef}
      href={`#${link}`}
      id={name}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      aria-disabled={isDisabled}
      className={`transition-all duration-200 ease-out px-4 py-2 sm:px-5 sm:py-3 text-xs sm:text-sm md:text-base
        ${
          isDisabled
            ? "pointer-events-none opacity-50"
            : "hover:scale-105 hover:bg-primary/80"
        }`}
    >
      {name}
    </a>
  );
};

const linksItemsData = [
  { link: "home", name: "Home" },
  { link: "about", name: "Sobre" },
  { link: "skills", name: "Skills" },
  { link: "projects", name: "Projetos" },
  { link: "contact", name: "Contatos" },
];

export default function SectionsGuide() {
  const [arrStates, setArrStates] = useState<boolean[]>([
    true,
    false,
    false,
    false,
    false,
  ]);
  const [isAnimating, setIsAnimating] = useState(false);

  const sectionIds = linksItemsData.map((item) => item.link);

  const updateArrStates = useCallback((index: number) => {
    setArrStates((prev) => prev.map((_, i) => i === index));
  }, []);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id, index) => {
      const section = document.getElementById(id);

      if (!section) return;

      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) {
            updateArrStates(index);
          }
        },
        { threshold: 0.7 }
      );

      observer.observe(section);
      observers.push(observer);
    });

    return () => observers.forEach((obs) => obs.disconnect());
  }, [sectionIds, updateArrStates]);

  // @ts-ignore
  const animateTransition = (targetId: string, callback: () => void) => {
    const tl = gsap.timeline({ onComplete: () => setIsAnimating(false) });

    tl.to("#block-transition", { width: "100%", duration: 0.01 })
      .to("#transition-1", { width: "100%", duration: 0.2 })
      .to("#transition-2", { width: "100%", duration: 0.2 })
      .to("#transition-3", { width: "100%", duration: 0.2 })
      .to("#transition-4", { width: "100%", duration: 0.2 })
      .to("#transition-5", { width: "100%", duration: 0.2 })
      .add(callback)
      .to(
        [
          "#transition-1",
          "#transition-2",
          "#transition-3",
          "#transition-4",
          "#transition-5",
        ],
        {
          width: 0,
          duration: 0.2,
          stagger: 0.05,
        }
      )
      .to("#block-transition", { width: "0%", duration: 0.01 });
  };

  const handleClick = (e: MouseEvent<HTMLAnchorElement>, index: number) => {
    e.preventDefault();
    if (isAnimating) return;

    setIsAnimating(true);

    const target = document.getElementById(linksItemsData[index].link);
    if (!target) return;

    animateTransition(linksItemsData[index].link, () =>
      target.scrollIntoView({ behavior: "instant" })
    );

    updateArrStates(index);
  };

  return (
    <header
      className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex flex-wrap gap-2 
        p-1.5 bg-card/80 backdrop-blur-2xl text-white z-10 
        max-w-[95vw] overflow-x-auto scrollbar-hidden"
    >
      {linksItemsData.map((item, i) => (
        <LinkItem
          key={item.link}
          link={item.link}
          name={item.name}
          active={arrStates[i]}
          isDisabled={isAnimating}
          onClick={(e) => handleClick(e, i)}
        />
      ))}
    </header>
  );
}
