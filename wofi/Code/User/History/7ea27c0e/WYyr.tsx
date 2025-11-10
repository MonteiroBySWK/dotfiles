import { useGSAP } from "@gsap/react";
import gsap from "gsap";

gsap.registerPlugin(useGSAP)

export default function Section(
  props: { id: string, className: string, children: React.ReactNode },
  { children }: {  }
) {
  useGSAP(() => {}, []);

  return <section id={props.id} className={`max-w-7xl min-h-screen ${props.className}`}>{children}</section>;
}
