import { Folder, Gift, GraduationCap, Home, Mail, Moon } from "lucide-react";
import { useState } from "react";

const Icon = ({
  children,
  state,
}: {
  children: React.ReactNode;
  state: boolean;
}) => {
  if (state) {
    return (
      <div className="rounded-full transition-all duration-200 py-1.5 px-2 bg-white hover:rounded-full hover:scale-105">
        {children}
      </div>
    );
  }

  return (
    <div className="rounded-full transition-all duration-200 p-1.5 hover:bg-white hover:scale-105">
      {children}
    </div>
  );
};

export default function Navigation() {
  const [home, setHome] = useState<boolean>(true);
  const [folder, setFolder] = useState<boolean>(false);
  const [gift, setGift] = useState<boolean>(false);
  const [graduation, setGraduation] = useState<boolean>(false);

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <div className="backdrop-blur-2xl shadow-md rounded-full flex px-4 py-1 gap-x-4">
        <Icon state={home}>
          <Home />
        </Icon>
        <div className="w-[0.1rem] bg-black" />
        <Icon state={folder}>
          <Folder />
        </Icon>
        <Icon state={gift}>
          <Gift />
        </Icon>
        <Icon state={graduation}>
          <GraduationCap />
        </Icon>
        <Icon state={false}>
          <Mail />
        </Icon>
        <div className="w-[0.1rem] bg-black" />
        <Icon state={false}>
          <Moon />
        </Icon>
      </div>
    </div>
  );
}
