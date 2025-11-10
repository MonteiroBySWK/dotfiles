import { useGSAP } from "@gsap/react";
import gsap from "gsap";

gsap.registerPlugin(useGSAP)

export default function Section(
  props: { id: string },
  { children }: { children: React.ReactNode }
) {
  useGSAP(() => {}, []);

  return <section id={props.id} className="max-w-7xl">{children}</section>;
}
