export default function Navbar() {
  function ItemNavBar({href, children}: {href: string, children: React.ReactNode}) {
    return <a href={href}></a>
  }


  return <nav>
    <a href="#about-me">Sobre Mim</a>
    <a href="#projects">Projetos</a>
    <a href="#contact">Contatos</a>
  </nav>;
}
