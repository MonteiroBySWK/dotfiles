"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ExitMenu, Menu } from "./Icons";

const navItems = [
  { name: "Início", href: "/" },
  { name: "Sobre", href: "#about" },
  { name: "Serviços", href: "#services" },
  { name: "Parceiros", href: "#empresas" },
  { name: "Contato", href: "#contato" },
];

export function MobileHeader() {
  const [isOpen, setIsOpen] = useState(false);

  // refs para cada parte que animamos
  const iconRef = useRef<HTMLButtonElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const timeline = useRef<gsap.core.Timeline>();

  const toggleMenu = () => {
    setIsOpen((v) => !v);
  };

  // monta a timeline de overlay + menu
  useEffect(() => {
    timeline.current = gsap
      .timeline({ paused: true })
      // overlay: aparecer de 0 → 1
      .to(
        overlayRef.current!,
        {
          opacity: 1,
          duration: 0.2,
          pointerEvents: "auto",
        },
        0
      )
      // menu: deslocar de x=100% → x=0
      .to(
        menuRef.current!,
        {
          x: "0%",
          duration: 0.3,
          ease: "power2.out",
        },
        0
      );
  }, []);

  // play / reverse conforme isOpen
  useEffect(() => {
    if (!timeline.current) return;
    if (isOpen) {
      timeline.current.play();
    } else {
      timeline.current.reverse();
    }

    // anima ícone de troca
    gsap.fromTo(
      iconRef.current!,
      { opacity: 0 },
      { opacity: 1, duration: 0.2 }
    );
  }, [isOpen]);

  return (
    <header className="relative">
      {/* botão de menu móvel */}
      <div className="md:hidden">
        <button
          ref={iconRef}
          onClick={toggleMenu}
          aria-expanded={isOpen}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          className="relative p-2 z-30"
        >
          {isOpen ? <ExitMenu /> : <Menu />}
        </button>
      </div>

      {/* overlay (sempre no DOM, mas só clicável/com opacidade ao abrir) */}
      <div
        ref={overlayRef}
        onClick={toggleMenu}
        aria-hidden="true"
        className="fixed inset-0 bg-black bg-opacity-50 opacity-0 pointer-events-none z-20 md:hidden"
      />

      {/* menu lateral */}
      <div
        ref={menuRef}
        className="fixed top-0 right-0 bottom-0 w-full backdrop-blur-3xl shadow-xl transform translate-x-full md:hidden z-20"
      >
        <nav className="flex flex-col p-6 pt-16 h-full bg-white/10">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="py-3 text-lg font-medium border-b transition-colors"
              onClick={toggleMenu}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
