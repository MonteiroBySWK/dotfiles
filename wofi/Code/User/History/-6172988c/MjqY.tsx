export default function Navbar() {
  function ItemNavBar({
    href,
    children,
  }: {
    href: string;
    children: React.ReactNode;
  }) {
    return (
      <a href={href} className="px-4 py-2">
        <div className="relative">
          {children}
          <span className="h-0.5 bg-black/70 w-full absolute bottom-0 left-0"></span>
        </div>
      </a>
    );
  }

  return (
    <nav className="flex">
      <ItemNavBar href="#about-me">Sobre Mim</ItemNavBar>
      <ItemNavBar href="#projects">Projetos</ItemNavBar>
      <ItemNavBar href="#contact">Contatos</ItemNavBar>
    </nav>
  );
}
