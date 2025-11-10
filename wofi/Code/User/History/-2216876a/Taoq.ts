import { ProjectRepository } from "@/repositories";

async function main() {
  const projectRepo = new ProjectRepository();  

}

main().catch(e => console.log(e));