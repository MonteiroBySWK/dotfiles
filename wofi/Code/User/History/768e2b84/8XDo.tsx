import Link from "next/link";
import { MobileHeader } from "../components/MobileHeader";
import logo from "@/app/assets/logo.svg";
import { Merriweather } from "next/font/google";
import Image from "next/image";

const merriweather = Merriweather({
  weight: ["400", "700"],
  subsets: ["latin"],
});
{
  /*tirei o md-absolutre posicionar em telas maiores topo,qualquer coisa so adicionar*/
}

const ItemNavbar = ({ link, name }: { link: string; name: string }) => {
  return (
    <Link href={link} className="hover:text-purple-300 transition-colors">
      {name}
    </Link>
  );
};

const itemNavbarData = [
  { link: "#about", name: "Sobre" },
  { link: "#about", name: "Sobre" },
  { link: "#about", name: "Sobre" },
  { link: "#about", name: "Sobre" },
];

export default function Header() {
  return (
    <header className="bg-background text-white text-2xl z-50 font-mono fixed md:fixed border-b top-0  md:top-auto h-fit w-full flex justify-between items-center gap-x-2">
      <div className="flex items-center justify-between max-w-7xl w-full mx-auto">
        <span
          className={`${merriweather.className} tracking-[2px] flex items-center`}
        >
          Thera
        </span>

        <nav className="hidden md:flex text-white font-mono px-8 py-4 items-center gap-x-8  ml-auto z-10">
          {itemNavbarData.map((e, i) => (
            <ItemNavbar link={e.link} name={e.name} key={i} />
          ))}
        </nav>
      </div>

      <MobileHeader />
    </header>
  );
}
