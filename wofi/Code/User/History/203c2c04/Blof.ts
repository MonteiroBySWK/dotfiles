import { Client } from "@notionhq/client";
import dotenv from "dotenv";

dotenv.config();

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const databaseId = process.env.NOTION_DATABASE_ID!;

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
  let obj = await describeDatabaseSchema(databaseId);
  console.log(obj.schema)
}

main();
