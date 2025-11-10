import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function SearchPrincipal() {
  return (
    <div className="flex flex-col space-y-3 items-center w-7/10">
      <p className="font-extrabold text-3xl">Sonar Docs</p>
      <div className="w-full relative">
        <Input />
        <Button className="absolute right-0.5 py-2">
          <Search />
        </Button>
      </div>
    </div>
  );
}
