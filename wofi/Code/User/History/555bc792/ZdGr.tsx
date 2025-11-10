import Link from "next/link";
import { Instagram, Linkedin, Mail, ChevronRight, Github } from "../components/Icons";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#170542] text-white font-mono">
      {/* Seção principal do footer */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Coluna 1: Sobre a empresa */}
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold mb-4">Thera</h2>
            <p className="text-gray-300 mb-6">
              Transformamos suas ideias em realidade com soluções tecnológicas
              inovadoras e exclusivas para o seu negócio.
            </p>
            <div className="flex space-x-6 mt-auto">
              <Link
                href="https://instagram.com/labthera"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#6d33a6] transition-colors duration-300"
                aria-label="Instagram"
              >
                <Instagram />
              </Link>
              <Link
                href="https://github.com/thera-org"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#6d33a6] transition-colors duration-300"
                aria-label="GitHub"
              >
                <Github />
              </Link>
              <Link
                href="https://linkedin.com/company/theralabs"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#6d33a6] transition-colors duration-300"
                aria-label="LinkedIn"
              >
                <Linkedin />
              </Link>
              <Link
                href="mailto:contato@theralabs.com.br"
                className="hover:text-[#6d33a6] transition-colors duration-300"
                aria-label="E-mail"
              >
                <Mail />
              </Link>
            </div>
          </div>

          {/* Coluna 2: Serviços */}
          <div className="flex flex-col">
            <h3 className="text-xl font-semibold mb-4">Serviços</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/redirect"
                  className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center"
                >
                  <ChevronRight />
                  <span>Desenvolvimento Mobile</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/redirect"
                  className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center"
                >
                  <ChevronRight />
                  <span>Desenvolvimento Web</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/redirect"
                  className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center"
                >
                  <ChevronRight />
                  <span>Consultoria em TI</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/redirect"
                  className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center"
                >
                  <ChevronRight />
                  <span>Produtos</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Coluna 3: Blog e Artigos */}
          <div className="flex flex-col">
            <h3 className="text-xl font-semibold mb-4">Conteúdo</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/redirect"
                  className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center"
                >
                  <ChevronRight />
                  <span>Blog</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/redirect"
                  className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center"
                >
                  <ChevronRight />
                  <span>Artigos</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/redirect"
                  className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center"
                >
                  <ChevronRight />
                  <span>Estudos de Caso</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/redirect"
                  className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center"
                >
                  <ChevronRight />
                  <span>Recursos</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Coluna 4: Contato */}
          <div className="flex flex-col">
            <h3 className="text-xl font-semibold mb-4">Contato</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                {/* <Mail size={20} className="mr-2 mt-1 text-[#6d33a6]" /> */}
                <div>
                  <p className="font-medium">Email:</p>
                  <a
                    href="mailto:contato@theralabs.com.br"
                    className="text-gray-300 hover:text-white transition-colors duration-300"
                  >
                    contato@theralabs.com.br
                  </a>
                </div>
              </li>
              <li>
                <div className="mt-6">
                  <p className="font-medium mb-2">Receba nossas novidades:</p>
                  <div className="flex">
                    <input
                      type="email"
                      placeholder="Seu email"
                      className="pr-4 py-2 w-full text-sm rounded-l-md focus:outline-none"
                    />
                    <button className="bg-[#6d33a6] hover:bg-[#8040cc] transition-colors duration-300 px-4 py-2 rounded-r-md">
                      Enviar
                    </button>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Barra de direitos autorais */}
      <div className="bg-[#0d0126 py-4">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400 mb-2 md:mb-0">
            © {currentYear} Thera. Todos os direitos reservados.
          </p>
          <div className="flex space-x-4">
            <Link
              href="/termos"
              className="text-sm text-gray-400 hover:text-gray-300 transition-colors duration-300"
            >
              Termos de Uso
            </Link>
            <Link
              href="/privacidade"
              className="text-sm text-gray-400 hover:text-gray-300 transition-colors duration-300"
            >
              Política de Privacidade
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
