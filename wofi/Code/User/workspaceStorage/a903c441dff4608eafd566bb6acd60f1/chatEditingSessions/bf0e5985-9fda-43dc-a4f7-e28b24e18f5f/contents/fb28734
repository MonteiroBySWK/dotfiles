import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import {
  Home,
  User,
  Workflow,
  Lightbulb,
  FolderGit2,
  MessageSquare,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState, type MouseEvent } from "react";
import { type LinkItemProps } from "../types/SectionGuideTypes";
import { linksItemsData } from "../constants/SectionGuideData";

const iconsMap = {
  Home: <Home />,
  Sobre: <User />,
  "Serviços": <Workflow />,
  Skills: <Lightbulb />,
  Projetos: <FolderGit2 />,
  Contatos: <MessageSquare />,
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
    const el = linkRef.current;
    if (!el) return;

    try {
      gsap.to(el, {
        backgroundColor: active ? "#4ade80" : "transparent",
        paddingLeft: active ? 32 : 16,
        paddingRight: active ? 32 : 16,
        duration: 0.2,
      });
    } catch (err) {
      // elemento pode ter sido removido antes da animação
    }
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
      {iconsMap[name as keyof typeof iconsMap] || name}
    </a>
  );
};

export default function SectionsGuide() {
  const [arrStates, setArrStates] = useState<boolean[]>([
    true,
    false,
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
    // Use a single observer with multiple thresholds and a small hysteresis
    // to avoid flickering when sections are near the boundary.
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .map((el, i) => ({ el, i }))
      .filter((s) => s.el !== null) as { el: HTMLElement; i: number }[];

    if (sections.length === 0) return;

    let currentIndex = sections.findIndex((s) => s.i === 0) >= 0 ? 0 : 0;
    let pendingTimeout: number | null = null;

    const thresholds = [0, 0.25, 0.5, 0.75, 1];
    const observer = new IntersectionObserver(
      (entries) => {
        // find the entry with highest intersectionRatio
        const best = entries.reduce((acc, e) => (e.intersectionRatio > (acc?.intersectionRatio || 0) ? e : acc), entries[0]);
        if (!best) return;

        const candidateIndex = sections.find((s) => s.el === best.target)?.i;
        if (candidateIndex === undefined) return;

        const ratio = best.intersectionRatio;

        // hysteresis: require ratio > 0.55 to switch to a section, and
        // require ratio < 0.45 to switch away
        const SWITCH_IN = 0.55;
        const SWITCH_OUT = 0.45;

        const shouldSwitch =
          (candidateIndex !== currentIndex && ratio >= SWITCH_IN) ||
          (candidateIndex === currentIndex && ratio <= SWITCH_OUT && ratio > 0);

        if (!shouldSwitch) return;

        // debounce quick flips
        if (pendingTimeout) window.clearTimeout(pendingTimeout);
        pendingTimeout = window.setTimeout(() => {
          currentIndex = candidateIndex;
          updateArrStates(candidateIndex);
          pendingTimeout = null;
        }, 80);
      },
      { threshold: thresholds }
    );

    sections.forEach((s) => observer.observe(s.el));

    return () => {
      observer.disconnect();
      if (pendingTimeout) window.clearTimeout(pendingTimeout);
    };
  }, [sectionIds, updateArrStates]);

  // @ts-ignore
  const animateTransition = (targetId: string, callback: () => void) => {
    const tl = gsap.timeline({ onComplete: () => setIsAnimating(false) });

    tl.to("#block-transition", { width: "100%", duration: 0.01 })
       .to(
        [
          "#transition-1",
          "#transition-2",
          "#transition-3",
          "#transition-4",
          "#transition-5",
        ],
        {
          width: "100%",
          duration: 0.2,
          stagger: 0.08,
        }
      )
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
      className="fixed bottom-4 sm:bottom-15 left-1/2 -translate-x-1/2 flex flex-wrap gap-2 
        p-1.5 bg-card/80 backdrop-blur-2xl text-white z-11
        w-max overflow-x-auto scrollbar-hidden"
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
