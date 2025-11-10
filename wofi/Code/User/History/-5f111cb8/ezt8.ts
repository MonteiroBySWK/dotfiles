import { Client } from "@notionhq/client";
import dotenv from "dotenv";
import PageRepository from "./repositories/PageRepository.ts";
import { type ITemplate } from "./interfaces/ITemplate.ts";
import { type Properties } from "./interfaces/Properties.ts";
import { CsvRepository } from "./repositories/CsvRepository.ts";

dotenv.config();

async function test() {
  const databaseId = process.env.NOTION_DATABASE_ID!;

  const template: ITemplate = {
    UserStory: {
      who: "usuário quer login rápido",
      what: "posso me autenticar com Google",
      for: "acessar minha conta sem senha",
    },
    AcceptanceCriteria: [
      "deve autenticar via Google OAuth",
      "não pode falhar no login",
      "feedback visual do processo",
    ],
    TechnicalTasks: [
      "criar integração OAuth",
      "validar token",
      "tratar erros",
      "testes unitários",
      "atualizar documentação",
    ],
  };

  // Preenchendo propriedades adicionais
  const options: Properties = {
    title: "xyz",
    status: "Backlog",
    tipo: "User Story",
    prioridade: "Alta",
    especialidade: "Backend",
    // epicoId: "ID_DO_EPICO_AQUI", // coloque um ID válido se houver
    // responsavelId: "ID_DO_RESPONSAVEL", // coloque um ID válido se houver
    criadoEm: new Date().toISOString(),
  };

  //const repo = new PageRepository();
  //const page = await new PageRepository.create(databaseId, template, options);
  //console.log("Página criada:", page.id);
}

async function main() {
  const csvRepo = new CsvRepository();
  const pageRepo = new PageRepository(csvRepo);
}

main().catch((e) => console.error(e));
