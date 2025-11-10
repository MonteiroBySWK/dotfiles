import { Client } from "@notionhq/client";

export function createNotionClient(auth: string | undefined) {
  if (!auth) {
    throw new Error("A chave de autenticação da Notion não foi fornecida.");
  }
  return new Client({ auth });
}