import { Github, Linkedin, Mail } from "lucide-react";
import type React from "react";

function ItemContact({href, children}:{href: string, children: React.ReactNode}) {
  return <a href={href} className="flex gap-x-2">{children}</a>
}

export default function Contact() {
  return (
    <section>
      <ItemContact href="mailto:eumonteiro.ofc@gmail.com"><Mail /> eumonteiro.ofc@gmail.com</ItemContact>
      <ItemContact href="https://github.com/MonteiroBySWK"><Github /> github.com/MonteiroBySWK</ItemContact>
      <ItemContact href="https://linkedin.com/in/montbyswk"><Linkedin />linkedin.com/in/montbyswk</ItemContact>
    </section>
  );
}
