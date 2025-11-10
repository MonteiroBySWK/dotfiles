import { dataSkills as dataSkillsObject } from "../mock-data";
import type { DataSkillItemType, SkillContent, SkillData } from "../types/skillsTypes";

const contentData: Record<keyof typeof dataSkillsObject, SkillContent> = {
  Languages: {
    intro: "Bases sólidas para qualquer aplicação moderna.",
    bullets: [
      "Performance e escalabilidade",
      "Compatibilidade multiplataforma", 
      "Clareza e produtividade no código",
    ],
    outro: "Essas linguagens me permitem entregar aplicações confiáveis e eficientes.",
  },
  Backend: {
    intro: "APIs robustas e dados sob controle.",
    bullets: [
      "Desenvolvimento de APIs seguras e escaláveis",
      "Estruturação da lógica de negócios",
      "Gerenciamento eficiente e seguro de dados",
    ],
    outro: "Do banco ao endpoint, foco em performance, segurança e arquitetura limpa.",
  },
  DevOps: {
    intro: "Confiabilidade do desenvolvimento à produção.",
    bullets: [
      "Automatização de processos com CI/CD",
      "Ambientes estáveis com containers e IaC",
      "Monitoramento e consistência em produção",
    ],
    outro: "Menos falhas, mais velocidade e previsibilidade nos ciclos de entrega.",
  },
  Frontend: {
    intro: "Experiências que encantam e funcionam.",
    bullets: [
      "Interfaces modernas e responsivas",
      "Acessibilidade e fluidez na experiência",
      "Design funcional e com foco no usuário",
    ],
    outro: "Construção visual com performance, clareza e impacto.",
  },
};

export const useSkillsData = (): SkillData[] => {
  return Object.keys(dataSkillsObject).map((category) => ({
    category,
    content: contentData[category as keyof typeof dataSkillsObject],
    iconArr: dataSkillsObject[category as keyof typeof dataSkillsObject] as DataSkillItemType[],
  }));
};
