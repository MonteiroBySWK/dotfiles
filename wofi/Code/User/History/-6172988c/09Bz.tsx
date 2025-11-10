import "./Navbar.css"

function ItemNavBar({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {

  return (
    <a href={href} className="px-4 py-2" id="item-navbar-link">
      <div className="relative">
        {children}
        <span
          className="h-0.5 bg-black absolute bottom-0 left-0"
          id="item-navbar-line"
        ></span>
      </div>
    </a>
  );
}

export default function Navbar() {
  return (
    <nav className="flex">
      <ItemNavBar href="#about-me">Sobre Mim</ItemNavBar>
      <ItemNavBar href="#projects">Projetos</ItemNavBar>
      <ItemNavBar href="#contact">Contatos</ItemNavBar>
    </nav>
  );
}
