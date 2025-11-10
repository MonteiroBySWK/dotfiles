import ItemsContact from "../components/ItemsContact";
import SectionsGuide from "../components/SectionGuide";
import logo from "../assets/logo.svg";

export default function Hero() {
  return (
    <section
      id="home"
      className="h-screen flex flex-col items-center justify-center font-mono relative text-center md:text-left"
    >
      <div className="bg-card/60 w-fit border-3 border-dashed border-border px-4 md:px-8 py-4">
        <h1 className="text-3xl md:text-5xl font-bold font-mono text-primary flex flex-col md:flex-row gap-3 items-center mb-1">
          <img src={logo} alt="logo" className="size-12 md:size-14" />
          <span>MonteiroBySWK</span>
        </h1>
        <span className="text-sm md:text-md text-txt-primary/70 font-medium">
          Backend - DevOps - CyberSecurity
        </span>
        <p className="text-txt-primary font-light max-w-3xl text-sm md:text-base">
          Sou desenvolvedor com foco em backend e infraestrutura, com interesse
          em segurança ofensiva (pentest).
        </p>
      </div>

      <ItemsContact />
      <SectionsGuide />
    </section>
  );
}
