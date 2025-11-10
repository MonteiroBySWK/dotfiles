import { LinkedinPlain } from "devicons-react";
import { FaGithub } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";

const SIZE = 60;

export default function ItemsContact() {
  return (
    <div className="flex items-center gap-x-4 mt-4">
      <a href="http://github.com/MonteiroBySWK">
        <FaGithub
          color="white"
          size={SIZE}
          className="transition-all duration-200 hover:scale-110 cursor-pointer hover:bg-primary/50 rounded-xl px-2"
        />
      </a>

      <a href="http://linkedin/in/montbyswk">
        <LinkedinPlain
          color="white"
          size={SIZE}
          className="transition-all duration-200 hover:scale-110 cursor-pointer hover:bg-primary/50 rounded-xl px-2"
        />
      </a>

      <MdOutlineEmail
        color="white"
        size={SIZE}
        className="transition-all duration-200 hover:scale-110 cursor-pointer hover:bg-primary/50 rounded-xl px-0.5"
      />
    </div>
  );
}
