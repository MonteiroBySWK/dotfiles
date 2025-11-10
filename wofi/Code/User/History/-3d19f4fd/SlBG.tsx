import gsap from "gsap";
import { useEffect } from "react";

export default function Home() {
  let timelineBackground = gsap.timeline();

  useEffect(() => {
    const sizeHeight = window.innerHeight;
    const sizeWidth = window.innerWidth;

    timelineBackground
      .to("#block1", { y: sizeHeight })
      .to("#block2", { y: sizeHeight })
      .to("block2", {y: sizeHeight});
  }, []);

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
