import { Tabs, TabsList } from "@/components/ui/tabs";
import { TabsTrigger } from "@radix-ui/react-tabs";

const areas = ["projetos", "normas", "processos", "papers", "ideias"];

const tabsTriggers = areas.map((item) => <TabsTrigger value={item} />);

export default function Explorer() {
  return (
    <div>
      <h2 className="text-xl font-bold">Explore Documentações</h2>
      <Tabs>
        <TabsList>{tabsTriggers}</TabsList>
      </Tabs>
    </div>
  );
}
