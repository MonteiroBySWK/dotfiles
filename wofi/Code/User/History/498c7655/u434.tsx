import img from "@/app/assets/logo.svg";
import { useEffect, useState } from "react";
import { Lato } from 'next/font/google'

const lato = Lato({
  weight: ['300', '400', '700'], 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-lato', 
})


const BackgroundLogoSVG = () => {
  return (
    <div className="h-screen w-full absolute md:relative flex items-center  justify-center">
      <img
        src={img.src}
        alt="Logo Linned"
        className="invert opacity-50 md:opacity-100"
      />
    </div>
  );
};

export default function Slogan() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // fade-in 
    const timeout = setTimeout(() => setVisible(true), 100); // pode ajustar o tempo
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div
      id="inicio"
      className=" font-custom flex flex-col md:flex-row  md:gap-x-10 font-bold text-5xl text-center h-screen relative justify-center "
    >
      <div
        className={`transition-opacity duration-1000 ease-in-out ${
          visible ? "opacity-100" : "opacity-0"
        } flex flex-col z-10 gap-y-1 md:gap-y-4 md:text-center md:-mt-14 items-center md:font-extrabold`}
      >
        <div className=" font-custom justify-center flex flex-col md:flex-row items-center   md:gap-x-10 font-bold text-5xl text-center h-screen relative ">
          <BackgroundLogoSVG />
          <div className="flex flex-col  z-1 gap-y-1 md:gap-y-4 md:text-left md:font-extrabold  md:left-20 md:top-1/4 ">
            <span className={`${lato.className} tracking-[2px]`}>Transforme</span>
            <span className={`${lato.className} tracking-[2px]`}>Suas</span>
            <span className={`${lato.className} text-green-400`}>Ideias</span>
            <span className={`${lato.className} tracking-[2px]`}>Em</span>
            <span className={`${lato.className} text-[#6d33a6] shadow-2xl tracking-[2px]`}>Realidade</span>
            {/* <a className="bg-slate-200  rounded-full mx-auto md:m-0 text-lg font-normal text-black/60 py-1.5 duration-200 ease-in-out hover:shadow-md shadow-amber-200 px-6 w-fit">
          Saiba Mais
        </a> */}
            {/**  <button className="rounded-full p-1 m-5  text-xl bg-[#6d33a6] text-white-200 hover:text-purple-300 transition-colors">
          Fale conosco
        </button>**/}
          </div>

          {/* Setinha Animada */}
          {/* <span className="text-3xl animate-pulse w-min px-1 text-black rounded-full bg-purple-100 absolute bottom-10 left-1/2 -translate-x-1/2">
        &darr;
      </span> */}
        </div>

        {/*<h1>
          Transforme Suas <span className="text-green-400">Ideias</span> em{" "}
          <br />
          <span className="text-[#6d33a6] shadow-2xl">Realidade</span>
        </h1>
        <p className="mt-10 text-xl text-center items-center max-w-2xl leading-relaxed text-white/80">
          Unimos conhecimento científico e tecnologia para desenvolver soluções
          que geram valor real para empresas.
        </p>

         <a className="bg-slate-200  rounded-full mx-auto md:m-0 text-lg font-normal text-black/60 py-1.5 duration-200 ease-in-out hover:shadow-md shadow-amber-200 px-6 w-fit">
          Saiba Mais
        </a> 
        <a href="#projetos">
          <button className="mt-10 cursor-pointer border border-gray-800 bg-purple-800 rounded-full w-fit px-4 p-10  items-center text-center py-3   text-lg font-custom text-white hover:bg-purple-900 transition">
            Ver Projetos
          </button>
        </a>*/}
      </div>

      {/* Setinha Animada 
      <span className="text-3xl animate-pulse w-min px-1 text-black rounded-full bg-purple-100 absolute bottom-10 left-1/2 -translate-x-1/2">
        &darr;
      </span>*/}
    </div>
  );
}
