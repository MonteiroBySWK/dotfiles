import { useRef, useState } from "react";

function ItemNavBar({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const lineRef = useRef<HTMLSpanElement>(null);

  lineRef.current?.style.width


  return (
    <a href={href} className="px-4 py-2">
      <div className="relative">
        {children}
        <span
          ref={lineRef}
          className="h-0.5 bg-black/70 w-full absolute bottom-0 left-0"
        ></span>
      </div>
    </a>
  );
}

export default function Navbar() {
  return (
    <nav className="flex">
      <ItemNavBar href="#about-me">Sobre Mim</ItemNavBar>
      <ItemNavBar href="#projects">Projetos</ItemNavBar>
      <ItemNavBar href="#contact">Contatos</ItemNavBar>
    </nav>
  );
}
