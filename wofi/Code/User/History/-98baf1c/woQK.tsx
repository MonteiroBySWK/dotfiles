import LinkedinPlain from "devicons-react/lib/icons/LinkedinPlain";
import { ArrowDown } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import FadeIn from "./animation/FadeIn";

const SIZE = 50; // Adjusted for better mobile fit

export default function ItemsContact() {
  return (
    <div className=" flex justify-center items-center flex-col mt-4 gap-y-2">
      <p className="flex items-center justify-center gap-x-2 text-white font-extralight text-sm sm:text-base">
        Entre em contato comigo <ArrowDown size={25} />
      </p>
      <div className="flex items-center gap-x-2 sm:gap-x-4">
        <FadeIn>
          {" "}
          <a
            href="https://github.com/MonteiroBySWK"
            aria-label="Meu perfil no GitHub"
            title="GitHub"
          >
            <FaGithub
              color="white"
              size={SIZE}
              className="transition-all duration-200 hover:scale-110 cursor-pointer hover:bg-primary/50 rounded-xl p-2"
            />
          </a>
        </FadeIn>
        <FadeIn>
          <a
            href="https://github.com/MonteiroBySWK"
            aria-label="Meu perfil no GitHub"
            title="GitHub"
          >
            <FaGithub
              color="white"
              size={SIZE}
              className="transition-all duration-200 hover:scale-110 cursor-pointer hover:bg-primary/50 rounded-xl p-2"
            />
          </a>
        </FadeIn>
        <FadeIn>
          {" "}
          <a
            href="https://linkedin.com/in/montbyswk"
            aria-label="Meu perfil no LinkedIn"
            title="LinkedIn"
          >
            <LinkedinPlain
              color="white"
              size={SIZE}
              className="transition-all duration-200 hover:scale-110 cursor-pointer hover:bg-primary/50 rounded-xl p-2"
            />
          </a>
        </FadeIn>

        <a
          href="mailto:eumonteiro.ofc@gmail.com"
          aria-label="Enviar email para eumonteiro.ofc@gmail.com"
          title="Email"
        >
          <MdOutlineEmail
            color="white"
            size={SIZE}
            className="transition-all duration-200 hover:scale-110 cursor-pointer hover:bg-primary/50 rounded-xl p-1"
          />
        </a>
      </div>
    </div>
  );
}
