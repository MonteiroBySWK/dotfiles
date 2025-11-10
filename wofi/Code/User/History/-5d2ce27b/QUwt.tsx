import { TabsList } from "@/components/ui/tabs";

const Areas = ["Projetos", "Normas", "Processos", "Papers", "Ideias"]

export default function Explorer() {
  return (
    <div>
      <h2 className="text-xl font-bold">Explore Documentações</h2>
      <TabsList></TabsList>

    </div>
  );
}
