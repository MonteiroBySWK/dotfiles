import { LinkedinPlain } from "devicons-react";
import { ArrowDown } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";

export default function ItemsContact() {
  return (
    <div className=" flex justify-center items-center flex-col mt-4 gap-y-2">
      <p className="flex items-center justify-center gap-x-2 text-white font-extralight text-sm md:text-base">
        Entre em contato comigo <ArrowDown size={25} />
      </p>
      <div className="flex items-center gap-x-2 md:gap-x-4">
        <a
          href="https://github.com/MonteiroBySWK"
          aria-label="Meu perfil no GitHub"
          title="GitHub"
        >
          <FaGithub
            color="white"
            className="transition-all duration-200 hover:scale-110 cursor-pointer hover:bg-primary/50 rounded-xl p-2 w-12 h-12 md:w-16 md:h-16"
          />
        </a>

        <a
          href="https://linkedin.com/in/montbyswk"
          aria-label="Meu perfil no LinkedIn"
          title="LinkedIn"
        >
          <LinkedinPlain
            color="white"
            className="transition-all duration-200 hover:scale-110 cursor-pointer hover:bg-primary/50 rounded-xl p-2 w-12 h-12 md:w-16 md:h-16"
          />
        </a>

        <a
          href="mailto:eumonteiro.ofc@gmail.com"
          aria-label="Enviar email para eumonteiro.ofc@gmail.com"
          title="Email"
        >
          <MdOutlineEmail
            color="white"
            className="transition-all duration-200 hover:scale-110 cursor-pointer hover:bg-primary/50 rounded-xl p-2 w-12 h-12 md:w-16 md:h-16"
          />
        </a>
      </div>
    </div>
  );
}
