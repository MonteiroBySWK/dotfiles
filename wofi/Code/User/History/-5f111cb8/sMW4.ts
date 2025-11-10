import { Client } from "@notionhq/client";
import dotenv from "dotenv";
import PageRepository from "./repositories/PageRepository.ts";
import { type ITemplate } from "./interfaces/ITemplate.ts";
import { type Properties } from "./interfaces/Properties.ts";
import { processCsvAndCreatePages } from "./repositories/CsvRepository.ts";

dotenv.config();



async function main() {
  await processCsvAndCreatePages("backlog.csv", process.env.NOTION_DATABASE_ID);
}

main().catch((e) => console.error(e));
