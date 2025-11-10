import { Client } from "@notionhq/client";
import dotenv from "dotenv";
import { Properties } from "./interfaces/Properties.js";
import PageRepository from "./repositories/PageRepository.js";


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

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const databaseId = process.env.NOTION_DATABASE_ID!;

async function createPage(title: string, status: string): Promise<Page> {
  const response = await notion.pages.create({
    parent: { database_id: databaseId },
    properties: {
      Name: {
        title: [{ text: { content: title } }],
      },
      Status: {
        select: { name: status },
      },
    },
  });
  return response as Page;
}

async function createPageWithContent(
  databaseId: string,
  title: string,
  status: string,
  content: string
) {
  // Cria a página com propriedades
  const page = await notion.pages.create({
    parent: { database_id: databaseId },
    properties: {
      Name: {
        title: [{ text: { content: title } }],
      },
      Status: {
        select: { name: status },
      },
    },
  });

  // Adiciona conteúdo dentro da página (bloco de parágrafo)
  await notion.blocks.children.append({
    block_id: page.id,
    children: [
      {
        object: "block",
        type: "paragraph",
        paragraph: {
          rich_text: [
            {
              type: "text",
              text: { content },
            },
          ],
        },
      },
    ],
  });

  return page;
}

async function getPages(): Promise<Page[]> {
  const response = await notion.databases.query({
    database_id: databaseId,
    page_size: 50,
  });
  return response.results as Page[];
}

async function updatePage(
  pageId: string,
  newTitle: string,
  newStatus: string
): Promise<Page> {
  const response = await notion.pages.update({
    page_id: pageId,
    properties: {
      Name: { title: [{ text: { content: newTitle } }] },
      Status: { select: { name: newStatus } },
    },
  });
  return response as Page;
}

// DELETE / ARCHIVE
async function archivePage(pageId: string): Promise<Page> {
  const response = await notion.pages.update({
    page_id: pageId,
    archived: true,
  });
  return response as Page;
}

async function createPageWithProperties(
  databaseId: string,
  template: ITemplate,
  options: Properties
) {
  // Cria a página com propriedades da database
  const page = await notion.pages.create({
    parent: { database_id: databaseId },
    properties: {
      Name: { title: [{ text: { content: options.title } }] },
      Status: { select: { name: options.status } },
      Tipo: options.tipo ? { select: { name: options.tipo } } : undefined,
      Prioridade: options.prioridade ? { select: { name: options.prioridade } } : undefined,
      Especialidade: options.especialidade ? { select: { name: options.especialidade } } : undefined,
      Épico: options.epicoId ? { relation: [{ id: options.epicoId }] } : undefined,
      Responsável: options.responsavelId ? { relation: [{ id: options.responsavelId }] } : undefined,
      "Criado Em": options.criadoEm ? { date: { start: options.criadoEm } } : undefined,
    },
  });

  const blocks: any[] = [];

  // ===== História =====
  blocks.push({
    object: "block",
    type: "heading_3",
    heading_3: { rich_text: [{ type: "text", text: { content: "História" } }] },
  });
  blocks.push({
    object: "block",
    type: "paragraph",
    paragraph: {
      rich_text: [{ type: "text", text: { content: `**Como** ${template.UserStory.who}` } }],
    },
  });
  blocks.push({
    object: "block",
    type: "paragraph",
    paragraph: {
      rich_text: [{ type: "text", text: { content: `**Quero** ${template.UserStory.what}` } }],
    },
  });
  blocks.push({
    object: "block",
    type: "paragraph",
    paragraph: {
      rich_text: [{ type: "text", text: { content: `**Para** ${template.UserStory.for}` } }],
    },
  });

  // ===== Critérios de Aceitação =====
  blocks.push({
    object: "block",
    type: "heading_3",
    heading_3: { rich_text: [{ type: "text", text: { content: "Critérios de Aceitação" } }] },
  });
  for (const crit of template.AcceptanceCriteria) {
    blocks.push({
      object: "block",
      type: "to_do",
      to_do: {
        rich_text: [{ type: "text", text: { content: crit } }],
        checked: false,
      },
    });
  }

  // ===== Tarefas Técnicas =====
  blocks.push({
    object: "block",
    type: "heading_3",
    heading_3: { rich_text: [{ type: "text", text: { content: "Tarefas Técnicas" } }] },
  });
  for (const task of template.TechnicalTasks) {
    blocks.push({
      object: "block",
      type: "to_do",
      to_do: {
        rich_text: [{ type: "text", text: { content: task } }],
        checked: false,
      },
    });
  }

  // ===== Impedimentos =====
  blocks.push({
    object: "block",
    type: "heading_3",
    heading_3: { rich_text: [{ type: "text", text: { content: "Impedimentos" } }] },
  });

  // Adiciona todos os blocos na página
  await notion.blocks.children.append({
    block_id: page.id,
    children: blocks,
  });

  return page;
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

  const page = await PageRepository.createPageWithProperties(databaseId, template, options);
  console.log("Página criada:", page.id);
}

main().catch((e) => console.error(e));
