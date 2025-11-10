import dotenv from "dotenv";
import { processCsvAndCreatePages } from "./repositories/CsvRepository.ts";

dotenv.config();

async function main() {
  const apiKey = process.env.NOTION_TOKEN;
  const databaseId = process.env.NOTION_DATABASE_ID;
  console.log("Iniciando...");
  await processCsvAndCreatePages("backlog.csv", databaseId);
}

main().catch((e) => console.error(e));
