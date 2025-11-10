import { Tabs, TabsTrigger, TabsContent, TabsList } from "@/components/ui/tabs";

const areas = ["projetos", "normas", "processos", "papers", "ideias"];

const tabsTriggers = areas.map((item, index) => (
  <TabsTrigger value={item} key={index} className="capitalize">{item}</TabsTrigger>
));

const tabsContents = areas.map((item, index) => (
  <TabsContent value={item} key={index}>
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
    <div className="w-7/10 flex flex-col items-center justify-center gap-6">
      <h2 className="text-xl font-bold">Explore Documentações</h2>
      <Tabs defaultValue={areas[0]}>
        <TabsList>{tabsTriggers}</TabsList>
        {tabsContents}
      </Tabs>
    </div>
  );
}
