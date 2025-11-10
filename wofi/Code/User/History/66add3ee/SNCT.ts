import webimg from "../assets/serv/web.webp";
import mobileimg from "../assets/serv/mobile.webp";
import supportimg from "../assets/serv/support.webp";
import secimg from "../assets/serv/sec.webp";

export interface ServiceProps {
  title: string;
  description: string;
  highlights: string[];
  urlImage: string;
}

export const ServiceData: ServiceProps[] = [
  {
    title: "Soluções Web",
    description:
      "Desenvolvimento de sistemas completos, desde o front-end moderno até o back-end escalável, entregando qualidade, segurança e performance.",
    highlights: [
      "Front-end responsivo (React, Next.js, Tailwind, GSAP)",
      "APIs robustas com Spring Boot ou Django",
      "Banco de dados PostgreSQL ou MongoDB",
      "Integrações com serviços externos e cloud",
    ],
    urlImage: webimg,
  },
  {
    title: "Aplicações Mobile",
    description:
      "Apps híbridos e PWAs com ótima usabilidade, podendo ser integrados ao seu sistema web ou funcionando de forma independente.",
    highlights: [
      "Progressive Web Apps (PWAs)",
      "Integração com Firebase/Supabase",
      "Design otimizado para Android e iOS",
      "Sincronização com back-end e banco de dados",
    ],
    urlImage: mobileimg,
  },
 {
  title: "Segurança de Aplicações",
  description:
    "Consultoria e implementação de segurança aplicada a sistemas web e mobile, garantindo resiliência contra ataques e conformidade com boas práticas do mercado.",
  highlights: [
    "Arquitetura segura desde o design da aplicação (Security by Design)",
    "Autenticação e autorização robustas (JWT, OAuth2, RBAC, Spring Security)",
    "Proteção contra ameaças avançadas (XSS, CSRF, SQL Injection, Session Hijacking)",
    "Monitoramento, auditoria e testes de segurança contínuos (Pentests, OWASP Top 10)",
    "Integração com pipelines de CI/CD para validação de segurança",
  ],
  urlImage: secimg,
}
,
  {
    title: "Suporte Técnico & Monitoria",
    description:
      "Acompanhamento técnico para equipes e profissionais, incluindo revisão de código, orientação em projetos e resolução de bugs.",
    highlights: [
      "Mentoria em programação e boas práticas",
      "Revisão de código e arquitetura",
      "Auxílio em bugs e deploy",
      "Aulas e orientação personalizada",
    ],
    urlImage: supportimg,
  },
];
