import logo from "../assets/logo.svg";

import Section from "../components/ui/Section";
import ItemsContact from "../components/ItemsContact";
import TextWriting from "../components/animation/TextWriting";

export default function Hero() {
  return (
    <Section
      id="home"
      className="relative flex flex-col items-center justify-center font-mono"
    >
      <div className="bg-card/60 w-fit border-3 border-dashed border-border px-4 sm:px-8 py-4">
        <header className="flex items-center gap-3 mb-1">
          <img
            src={logo}
            alt="Logotipo MonteiroBySWK"
            className="size-10 sm:size-12 md:size-14"
          />
          {<h1 className="text-4xl sm:text-4xl md:text-5xl font-bold text-primary">
            MonteiroBySWK
          </h1>}
        </header>

        <p className="text-xs sm:text-sm text-txt-primary/70 font-medium">
          Backend - DevOps - CyberSecurity
        </p>

        <TextWriting
          size="text-xs sm:text-sm md:text-base text-txt-primary font-light max-w-3xl"
          text="Sou desenvolvedor com foco em backend e infraestrutura, com interesse em segurança ofensiva (pentest)."
        />
      </div>

      <ItemsContact />
    </Section>
  );
}
