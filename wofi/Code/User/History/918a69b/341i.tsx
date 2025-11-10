import Explorer from "./_components/Explorer";
import SearchPrincipal from "./_components/SearchPrincipal";

export default function WikiPage() {
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center space-y-2">
      <SearchPrincipal />
      <Explorer />
    </div>
  );
}
