import { text } from "stream/consumers";
import { type ITemplate } from "../interfaces/ITemplate.ts";
import { type Properties } from "../interfaces/Properties.ts";
import { notion } from "../../main.ts";

export default class PageRepository {
  private createUserStory(blocks: any[], template: ITemplate) {
    blocks.push({
      object: "block",
      type: "heading_3",
      heading_3: {
        rich_text: [{ type: "text", text: { content: "História" } }],
      },
    });
    blocks.push({
      object: "block",
      type: "divider",
      divider: {},
    });
    blocks.push({
      object: "block",
      type: "paragraph",
      paragraph: {
        rich_text: [
          {
            type: "text",
            text: { content: "Como " },
            annotations: { bold: true },
          },
          {
            type: "text",
            text: { content: `${template.UserStory.who}` },
          },
        ],
      },
    });
    blocks.push({
      object: "block",
      type: "paragraph",
      paragraph: {
        rich_text: [
          {
            type: "text",
            text: { content: "Quero " },
            annotations: { bold: true },
          },
          {
            type: "text",
            text: { content: `${template.UserStory.what}` },
          },
        ],
      },
    });
    blocks.push({
      object: "block",
      type: "paragraph",
      paragraph: {
        rich_text: [
          {
            type: "text",
            text: { content: "Para " },
            annotations: { bold: true },
          },
          {
            type: "text",
            text: { content: `${template.UserStory.for}` },
          },
        ],
      },
    });
    blocks.push({
      object: "block",
      type: "paragraph",
      paragraph: {
        rich_text: [],
      },
    });
  }

  private createAcceptanceCriteria(blocks: any[], template: ITemplate) {
    blocks.push({
      object: "block",
      type: "heading_3",
      heading_3: {
        rich_text: [
          { type: "text", text: { content: "Critérios de Aceitação" } },
        ],
      },
    });
    blocks.push({
      object: "block",
      type: "divider",
      divider: {},
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
    blocks.push({
      object: "block",
      type: "paragraph",
      paragraph: {
        rich_text: [],
      },
    });
  }

  private createTechnicalTasks(blocks: any[], template: ITemplate) {
    blocks.push({
      object: "block",
      type: "heading_3",
      heading_3: {
        rich_text: [{ type: "text", text: { content: "Tarefas Técnicas" } }],
      },
    });
    blocks.push({
      object: "block",
      type: "divider",
      divider: {},
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
    blocks.push({
      object: "block",
      type: "paragraph",
      paragraph: {
        rich_text: [],
      },
    });
  }

  public async createPage(
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
        Prioridade: options.prioridade
          ? { select: { name: options.prioridade } }
          : undefined,
        Especialidade: options.especialidade
          ? { select: { name: options.especialidade } }
          : undefined,
        Épico: options.epicoId
          ? { relation: [{ id: options.epicoId }] }
          : undefined,
        Responsável: options.responsavelId
          ? { relation: [{ id: options.responsavelId }] }
          : undefined,
        "Criado Em": options.criadoEm
          ? { date: { start: options.criadoEm } }
          : undefined,
      },
    });

    const blocks: any[] = [];

    this.createUserStory(blocks, template);
    this.createAcceptanceCriteria(blocks, template);
    this.createTechnicalTasks(blocks, template);

    blocks.push({
      object: "block",
      type: "heading_3",
      heading_3: {
        rich_text: [{ type: "text", text: { content: "Impedimentos" } }],
      },
    });

    blocks.push({
      object: "block",
      type: "divider",
      divider: {},
    });

    await notion.blocks.children.append({
      block_id: page.id,
      children: blocks,
    });

    return page;
  }
}
