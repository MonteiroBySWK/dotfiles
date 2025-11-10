import gsap from "gsap";
import { useEffect } from "react";

export default function Home() {
  let timelineBackground = gsap.timeline();
  let timelineText = gsap.timeline();

  useEffect(() => {
    const sizeHeight = window.innerHeight;
    const sizeWidth = window.innerWidth;

    timelineText.fromTo(
      "#my-name",
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.07,
        ease: "power2.out",
      }
    ).to("#my-name", {color: "white"});

    timelineBackground
      .fromTo("#high-block", { opacity: 0 }, { opacity: 1 })
      .to("#block1", { y: sizeHeight, duration: 0.4 })
      .to("#block2", { y: sizeHeight, duration: 0.4 })
      .to("#block3", { y: sizeHeight, duration: 0.4 })
      .to("#block4", { y: sizeHeight, duration: 0.4 })
      .to("#high-block", { display: "none" })
      .to("#home", { backgroundColor: "purple" });
  }, []);

  return (
    <section
      id="home"
      className="h-screen flex items-center justify-center overflow-y-hidden"
    >
      <span id="my-name" className="text-6xl font-bold">
        MonteiroBySWK
      </span>

      <div id="high-block" className="flex w-full absolute top-0 z-[-1]">
        <div id="block1" className="h-screen w-1/4 bg-purple-500"></div>
        <div id="block2" className="h-screen w-1/4 bg-blue-500"></div>
        <div id="block3" className="h-screen w-1/4 bg-purple-500"></div>
        <div id="block4" className="h-screen w-1/4 bg-blue-500"></div>
      </div>
    </section>
  );
}
