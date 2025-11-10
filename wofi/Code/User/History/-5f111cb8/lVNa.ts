import dotenv from "dotenv";
import { createNotionClient } from "./lib/notion.ts";

dotenv.config();

const apiKey = process.env.NOTION_TOKEN;
const databaseId = process.env.NOTION_DATABASE_ID;

export const notion = createNotionClient(apiKey);

async function main() {}

main().catch((e) => console.error(e));
