import gsap from "gsap";

export default function Home() {

  return (
    <section className="h-screen flex items-center justify-center">
      <span className="text-6xl font-bold">MonteiroBySWK</span>

      <div className="flex w-full absolute top-0 z-[-1]">
        <div id="block1" className="h-screen w-1/4 bg-purple-500"></div>
        <div id="block2" className="h-screen w-1/4 bg-blue-500"></div>
        <div id="block3" className="h-screen w-1/4 bg-purple-500"></div>
        <div id="block4" className="h-screen w-1/4 bg-blue-500"></div>
      </div>
    </section>
  );
}
