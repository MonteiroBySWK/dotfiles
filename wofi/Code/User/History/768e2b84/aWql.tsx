"use client"

import Link from "next/link";
import { MobileHeader } from "../components/MobileHeader";
import { Merriweather } from "next/font/google";
import ProgressLineScroll from "@/components/ProgressLineScroll"

const merriweather = Merriweather({
  weight: ["400", "700"],
  subsets: ["latin"],
});

const ItemNavbar = ({ link, name }: { link: string; name: string }) => {
  return (
    <Link href={link} className="hover:text-purple-300 transition-colors text-md">
      {name}
    </Link>
  );
};

const itemNavbarData = [
  { link: "#about", name: "Sobre" },
  { link: "#services", name: "Serviços" },
  { link: "#contato", name: "Contato" },
  { link: "#empresas", name: "Empresas" },
];

export default function Header() {
  return (
    <header className="bg-background text-white z-50 font-mono fixed md:fixed border-b-[0.05rem] top-0  md:top-auto h-fit w-full flex justify-between items-center gap-x-2">
      <div className="flex items-center justify-between max-w-7xl w-full mx-auto">
        <span
          className={`${merriweather.className} tracking-[2px] text-2xl font-bold px-6 md:px-0`}
        >
          Thera
        </span>

        <nav className="hidden md:flex text-white font-mono px-8 py-4 items-center gap-x-8 z-10">
          {itemNavbarData.map((e, i) => (
            <ItemNavbar link={e.link} name={e.name} key={i} />
          ))}
        </nav>
      </div>

      <MobileHeader />
      <ProgressLineScroll />
    </header>
  );
}
