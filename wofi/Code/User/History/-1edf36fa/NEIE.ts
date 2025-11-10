import fs from "fs";
import { parse } from "csv-parse/sync";
import { type ITemplate } from "../interfaces/ITemplate.ts";
import { type Properties } from "../interfaces/Properties.ts";
import PageRepository from "./PageRepository.ts";

type CsvRow = {
  title: string;
  status: string;
  tipo?: string;
  prioridade?: string;
  especialidade?: string;
  epicoId?: string;
  responsavelId?: string;
  criadoEm?: string;
  who: string;
  what: string;
  for: string;
  acceptanceCriteria: string; // separado por |
  technicalTasks: string; // separado por |
};

function getFormattedDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0"); // Mês começa do 0, então somamos 1
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export async function processCsvAndCreatePages(
  filePath: string,
  databaseId: string
) {
  const content = fs.readFileSync(filePath, "utf-8");
  const rows: CsvRow[] = parse(content, {
    columns: true,
    skip_empty_lines: true,
  });

  const pageRepo = new PageRepository();

  for (const row of rows) {
    console.log("Criando: ", row.title);

    const template: ITemplate = {
      UserStory: {
        who: row.who,
        what: row.what,
        for: row.for,
      },
      AcceptanceCriteria: row.acceptanceCriteria
        ? row.acceptanceCriteria.split("|").map((s) => s.trim())
        : [],
      TechnicalTasks: row.technicalTasks
        ? row.technicalTasks.split("|").map((s) => s.trim())
        : [],
    };

    // Monta as options (Properties)
    const options: Properties = {
      title: row.title,
      status: row.status,
      tipo: row.tipo as Properties["tipo"],
      prioridade: row.prioridade as Properties["prioridade"],
      especialidade: row.especialidade as Properties["especialidade"],
      epicoId: row.epicoId,
      responsavelId: row.responsavelId,
      criadoEm: getFormattedDate(),
    };

    // Chama a função createPage para cada linha
    await pageRepo
      .createPage(databaseId, template, options)
      .then(() => console.log("\rFeito"))
      .catch((e) => console.error(e));
  }
}

export async function deleteAll() {
  
}