import { Client } from "@notionhq/client";
import dotenv from "dotenv";
import PageRepository from "./repositories/PageRepository.ts"
import { type ITemplate } from "./interfaces/ITemplate.ts";
import { type Properties } from "./interfaces/Properties.ts";

dotenv.config();

interface Page {
  id: string;
  properties: {
    Name: {
      title: { text: { content: string } }[];
    };
    Status: {
      select: { name: string };
    };
  };
}

async function describeDatabaseSchema(databaseId: string) {
  // Busca informações da database
  const database = await notion.databases.retrieve({ database_id: databaseId });

  const schema: Record<string, any> = {};

  for (const key in database.properties) {
    const prop = database.properties[key];

    const type = prop.type;
    const detail: any = { type };

    // Para tipos que possuem opções (select / multi_select)
    if (type === "select" && prop.select?.options) {
      detail.options = prop.select.options.map((o: any) => o.name);
    } else if (type === "multi_select" && prop.multi_select?.options) {
      detail.options = prop.multi_select.options.map((o: any) => o.name);
    }

    schema[key] = detail;
  }

  return {
    id: database.id,
    title: database.title.map((t: any) => t.text.content).join(" "),
    schema,
  };
}

// ===== EXEMPLO DE USO =====
async function main() {
  const databaseId = process.env.NOTION_DATABASE_ID!;

  // Exemplo de template
  const template: ITemplate= {
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

  const page = await PageRepository.createPageWithProperties(databaseId, template, options);
  console.log("Página criada:", page.id);
}

main().catch((e) => console.error(e));
