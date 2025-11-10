import webimg from "../assets/serv/web.webp";
import mobileimg from "../assets/serv/mobile.webp";
import supportimg from "../assets/serv/support.webp";
import secimg from "../assets/serv/sec.webp";

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
    urlImage: webimg,
  },
  {
    title: "Programação Mobile",
    description:
      "Aplicações híbridas ou PWAs com ótima experiência de uso, integradas ao seu sistema web.",
    urlImage: mobileimg,
  },
  {
    title: "Segurança de Aplicações",
    description:
      "Análise de segurança e implementação de boas práticas com JWT, HTTPS, CORS, autenticação e mais.",
    urlImage: secimg,
  },
  {
    title: "Monitoria e Suporte Técnico",
    description:
      "Aulas, revisão de código, ajuda com bugs e orientação técnica para projetos ou estudos.",
    urlImage: supportimg,
  },
];
