import { useRef, useState } from "react";

export default function Navbar() {
  function ItemNavBar({
    href,
    children,
  }: {
    href: string;
    children: React.ReactNode;
  }) {
    const lineRef = useRef<HTMLSpanElement>(null);
    const [houvered, setHovered] = useState<boolean>(false);

    return (
      <a
        href={href}
        className="px-4 py-2"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="relative">
          {children}
          <span
            ref={lineRef}
            className={`h-0.5 bg-black/70 w-full absolute bottom-0 left-0 duration-300 transition-all ${houvered ? "w-1/2" : "w-0"}`}
          ></span>
        </div>
      </a>
    );
  }

  return (
    <nav className="flex">
      <ItemNavBar href="#about-me">Sobre Mim</ItemNavBar>
      <ItemNavBar href="#projects">Projetos</ItemNavBar>
      <ItemNavBar href="#contact">Contatos</ItemNavBar>
    </nav>
  );
}
