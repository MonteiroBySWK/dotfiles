import { useGSAP } from "@gsap/react";
import gsap from "gsap";

gsap.registerPlugin(useGSAP);

export default function Section(props: {
  id: string;
  className: string;
  children: React.ReactNode;
}) {
  // Animação de aparição
  useGSAP(() => {
    gsap.fromTo(`#${props.id}`, { opacity: 0 }, { opacity: 1, duration: 200 });
  }, []);

  return (
    <section
      id={props.id}
      className={`max-w-7xl min-h-screen mx-auto ${props.className}`}
    >
      {props.children}
    </section>
  );
}
