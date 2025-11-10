import { Tabs, TabsTrigger, TabsContent, TabsList } from "@/components/ui/tabs";

const areas = ["projetos", "normas", "processos", "papers", "ideias"];

const tabsTriggers = areas.map((item) => (
  <TabsTrigger value={item}>{item.normalize()}</TabsTrigger>
));

const tabsContents = areas.map((item) => (
  <TabsContent value={item}>{item}</TabsContent>
));

export default function Explorer() {
  return (
    <div>
      <h2 className="text-xl font-bold">Explore Documentações</h2>
      <Tabs defaultValue={areas[0]}>
        <TabsList>{tabsTriggers}</TabsList>
        {tabsContents}
      </Tabs>
    </div>
  );
}
