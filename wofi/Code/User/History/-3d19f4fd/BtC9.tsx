import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Home() {
  const myName = "MonteiroBySWK";
  const lettersRef = useRef<(HTMLSpanElement | null)[]>([]);
  const introRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const sizeHeight = window.innerHeight;

    // Animação das letras do nome
    gsap.fromTo(
      lettersRef.current,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.07,
        ease: "power2.out",
      }
    );

    // Animação do texto de introdução
    gsap.fromTo(
      introRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, delay: 1, ease: "power2.out" }
    );

    // Animação do botão
    gsap.fromTo(
      buttonRef.current,
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 0.6, delay: 1.5, ease: "back.out(1.7)" }
    );

    // Animação de background
    const timelineBackground = gsap.timeline();
    timelineBackground
      .fromTo("#high-block", { opacity: 0 }, { opacity: 1 })
      .to("#block1", { y: sizeHeight, duration: 0.4 })
      .to("#block2", { y: sizeHeight, duration: 0.4 })
      .to("#block3", { y: sizeHeight, duration: 0.4 })
      .to("#block4", { y: sizeHeight, duration: 0.4 })
      .to("#high-block", { display: "none" })
      .to("#home", { backgroundColor: "purple" });
  }, []);

  return (
    <section
      id="home"
      className="relative h-screen flex flex-col items-center justify-center overflow-y-hidden transition-colors duration-1000"
    >
      <span className="text-5xl sm:text-7xl font-extrabold text-white mb-6 tracking-tight drop-shadow-lg">
        {myName.split("").map((char, i) => (
          <span
            key={i}
            ref={el => (lettersRef.current[i] = el)}
            style={{ display: "inline-block" }}
            className="hover:text-blue-300 transition-colors duration-200"
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </span>

      <div
        ref={introRef}
        className="text-lg sm:text-2xl text-purple-100 mb-8 text-center max-w-xl drop-shadow"
      >
        Olá! Eu sou o Monteiro, desenvolvedor apaixonado por tecnologia, interfaces animadas e soluções criativas. <br />
        Bem-vindo ao meu portfólio!
      </div>

      <button
        ref={buttonRef}
        className="px-8 py-3 rounded-full bg-blue-500 hover:bg-blue-400 text-white font-semibold text-lg shadow-lg transition-all duration-200"
      >
        Entre em contato
      </button>

      <div id="high-block" className="flex w-full absolute top-0 left-0 z-[-1]">
        <div id="block1" className="h-screen w-1/4 bg-purple-500"></div>
        <div id="block2" className="h-screen w-1/4 bg-blue-500"></div>
        <div id="block3" className="h-screen w-1/4 bg-purple-500"></div>
        <div id="block4" className="h-screen w-1/4 bg-blue-500"></div>
      </div>
    </section>
  );
}
