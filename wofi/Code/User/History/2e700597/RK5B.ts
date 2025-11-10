export interface ServiceProps {
  title: string;
  description: string;
  urlImage: string;
}

export const ServiceData: ServiceProps[] = [
  {
    title: "Programação Web",
    description:
      "Criação de sistemas completos com front-end moderno e APIs seguras com Node.js, Django ou Spring Boot.",
    urlImage: "/assets/serv/web.webp",
  },
  {
    title: "Programação Mobile",
    description:
      "Aplicações híbridas ou PWAs com ótima experiência de uso, integradas ao seu sistema web.",
    urlImage: "/assets/serv/mobile.webp",
  },
  {
    title: "Segurança de Aplicações",
    description:
      "Análise de segurança e implementação de boas práticas com JWT, HTTPS, CORS, autenticação e mais.",
    urlImage: "/assets/serv/support.webp",
  },
  {
    title: "Monitoria e Suporte Técnico",
    description:
      "Aulas, revisão de código, ajuda com bugs e orientação técnica para projetos ou estudos.",
    urlImage: "/assets/serv/support.webp",
  },
];
