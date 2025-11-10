import Explorer from "./_components/Explorer";
import SearchPrincipal from "./_components/SearchPrincipal";

export default function WikiPage() {
  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <SearchPrincipal />
      <Explorer />
    </div>
  );
}
