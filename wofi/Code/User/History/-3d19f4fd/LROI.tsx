import gsap from "gsap";

export default function Home() {
  let myName = "MonteiroBySWK";

  return (
    <section className="h-screen flex items-center justify-center">
      <span className="text-6xl font-bold">MonteiroBySWK</span>

      <div className="flex w-full z-10">
        <div id="block1"></div>
        <div id="block1"></div>
        <div id="block1"></div>
        <div id="block1"></div>
      </div>
    </section>
  );
}
