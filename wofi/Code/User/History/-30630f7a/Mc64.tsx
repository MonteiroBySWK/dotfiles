import ItemsContact from "../components/ItemsContact";
import SectionsGuide from "../components/SectionGuide";
import logo from "../assets/logo.svg";

export default function Hero() {
  return (
    <section
      id="home"
      className="h-screen flex flex-col items-center justify-center font-mono  relative"
    >
      <div className="bg-card/60 w-fit border-3 border-dashed border-border px-8 py-4">
        <h1 className="text-5xl font-bold font-mono text-primary flex gap-2 items-center">
          <img src={logo} alt="logo" className="size-10" />
          <span>MonteiroBySWK</span>
        </h1>
        <span className="text-md text-txt-primary/70 font-medium">
          Backend - DevOps - CyberSecurity
        </span>
        <p className="text-txt-primary font-light max-w-3xl">
          Sou desenvolvedor com foco em backend e infraestrutura, com interesse
          em segurança ofensiva (pentest).
        </p>
      </div>

      <ItemsContact />
      <SectionsGuide />
    </section>
  );
}
