import ItemsContact from "../components/ItemsContact";
import SectionsGuide from "../components/SectionGuide";
import logo from "../assets/logo.svg";
import Section from "../components/ui/Section";
import TextWriting from "../components/animation/TextWriting";

export default function Hero() {
  return (
    <Section
      id="home"
      className="flex flex-col items-center justify-center font-mono relative"
    >
      <div className="bg-card/60 w-fit border-3 border-dashed border-border px-8 py-4">
        <h1 className="text-3xl md:text-5xl font-bold font-mono text-primary flex gap-3 items-center mb-1">
          <img src={logo} alt="logo" className="size-8 md:size-14" />
          <span>MonteiroBySWK</span>
        </h1>
        <span className=" text-sm md:text-md text-txt-primary/70 font-medium">
          Backend - DevOps - CyberSecurity
        </span>
        <TextWriting
          size="text-sm md:text-base text-txt-primary font-light max-w-3xl"
          text="Sou desenvolvedor com foco em backend e infraestrutura, com
            interesse em segurança ofensiva (pentest)."
        />
      </div>

      <ItemsContact />
    </Section>
  );
}
