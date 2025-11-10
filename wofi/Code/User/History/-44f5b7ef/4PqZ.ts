export interface Properties {
  title: string;
  status: string;
  tipo?: "Spike" | "Task" | "Bug" | "User Story";
  prioridade?: "Muito Alta" | "Alta" | "Média" | "Baixa";
  especialidade?: "Backend" | "Frontend" | "DevOps";
  epicoId?: string; // ID da página relacionada no campo Épico
  responsavelId?: string; // ID do usuário relacionado
  criadoEm?: string; // ISO date string
};
