import { useGSAP } from "@gsap/react";
import gsap from "gsap";

gsap.registerPlugin(useGSAP)

export default function Section(
  props: { id: string, className: string, children: React.ReactNode }
) {
  useGSAP(() => {
    gsap.fromTo(`#${props.id}`, {opacity: 0}, {opacity: 1})

  }, []);

  return <section id={props.id} className={`max-w-7xl min-h-screen ${props.className}`}>{props.children}</section>;
}
