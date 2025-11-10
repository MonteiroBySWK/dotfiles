import { Tabs, TabsList } from "@/components/ui/tabs";
import { TabsTrigger } from "@radix-ui/react-tabs";

const areas = ["projetos", "normas", "processos", "papers", "ideias"];

const tabsTriggers = areas.map((item) => (
  <TabsTrigger value={item}>{item}</TabsTrigger>
));

export default function Explorer() {
  return (
    <div>
      <h2 className="text-xl font-bold">Explore Documentações</h2>
      <Tabs defaultValue={areas[0]}>
        <TabsList>{tabsTriggers}</TabsList>
      </Tabs>
    </div>
  );
}
