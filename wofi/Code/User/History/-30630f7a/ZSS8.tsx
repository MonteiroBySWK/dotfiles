import ItemsContact from "../components/ItemsContact";

export default function Hero() {
  return (
    <div className="h-screen flex flex-col items-center justify-center font-mono z-1 relative">
      <div className="bg-card/60 w-fit border-3 border-dashed border-border px-8 py-4">
        <h1 className="text-5xl font-bold font-mono text-primary">
          MonteiroBySWK
        </h1>
        <span className="text-md text-txt-primary font-medium">Backend - DevOps - CyberSecurity</span>
        <p className="text-txt-primary font-light">
          Me chamo <span>Monteiro</span>, sou desenvolvedor, devops e nas horas
          vagas treino pentest
        </p>
      </div>

      <ItemsContact />
    </div>
  );
}
