import { useEffect, useRef } from "react";
import { Github, Linkedin, Mail } from "lucide-react";
import type React from "react";
import gsap from "gsap";

function ItemContact({href, children}:{href: string, children: React.ReactNode}) {
  return (
    <a
      href={href}
      className="flex items-center gap-x-2 text-blue-400 bg-white/10 hover:bg-blue-500 hover:text-white px-6 py-3 rounded-full shadow-lg transition-all text-lg font-semibold w-fit mx-auto mb-4"
      target="_blank" rel="noopener noreferrer"
    >
      {children}
    </a>
  );
}

export default function Contact() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(
      sectionRef.current,
      { opacity: 0, y: 60 },
      { opacity: 1, y: 0, duration: 1, delay: 0.2, ease: "power2.out" }
    );
  }, []);

  return (
    <section id="contact" ref={sectionRef} className="py-24 px-4 max-w-2xl mx-auto text-center">
      <h2 className="text-4xl font-extrabold text-purple-300 mb-8 drop-shadow-lg">Contato</h2>
      <p className="text-purple-100 mb-8 text-lg">Entre em contato para oportunidades, parcerias ou só para conversar sobre tecnologia!</p>
      <div className="flex flex-col gap-4 items-center">
        <ItemContact href="mailto:eumonteiro.ofc@gmail.com"><Mail /> eumonteiro.ofc@gmail.com</ItemContact>
        <ItemContact href="https://github.com/MonteiroBySWK"><Github /> github.com/MonteiroBySWK</ItemContact>
        <ItemContact href="https://linkedin.com/in/montbyswk"><Linkedin /> linkedin.com/in/montbyswk</ItemContact>
      </div>
    </section>
  );
}
