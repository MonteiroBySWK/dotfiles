import { Folder, Gift, GraduationCap, Home, Mail, Moon } from "lucide-react";
import { useState } from "react";

const Icon = ({ children, state }: { children: React.ReactNode, state: boolean }) => {
  return (
    <div className="rounded-full transition-all duration-200 p-1.5 hover:bg-white hover:scale-105">
      {children}
    </div>
  );
};

const IconsArr = [<Home />, <Folder />, <Gift />, <GraduationCap />]




export default function Navigation() {
  const [home, setHome] = useState<boolean>(true);
  const [folder, setFolder] = useState<boolean>(false);
  const [gift, setGift] = useState<boolean>(false);
  const [graduation, setGraduation] = useState<boolean>(false);


  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <div className="backdrop-blur-2xl shadow-md rounded-full flex px-4 py-1 gap-x-4">
        <Icon>
          <Home />
        </Icon>
        <div className="w-[0.1rem] bg-black" />
        <Icon>
          <Folder />
        </Icon>
        <Icon>
          <Gift />
        </Icon>
        <Icon>
          <GraduationCap />
        </Icon>
        <Icon>
          <Mail />
        </Icon>
        <div className="w-[0.1rem] bg-black" />
        <Icon>
          <Moon />
        </Icon>
      </div>
    </div>
  );
}
