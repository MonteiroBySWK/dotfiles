import { Tabs, TabsTrigger, TabsContent, TabsList } from "@/components/ui/tabs";

const areas = ["projetos", "normas", "processos", "papers", "ideias"];

const tabsTriggers = areas.map((item) => (
  <TabsTrigger value={item}>{item}</TabsTrigger>
));

const tabsContents = areas.map((item) => (
  <TabsContent value={item}>
    <div className="flex w-full">
      <p>{item}</p>
      Lorem, ipsum dolor sit amet consectetur adipisicing elit. Soluta ipsum,
      dignissimos necessitatibus quis non adipisci quibusdam quam assumenda
      dolor eligendi cum quae deleniti ut architecto esse? Odio explicabo in
      velit distinctio quae.
    </div>
  </TabsContent>
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
