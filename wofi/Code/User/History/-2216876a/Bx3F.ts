import { ProjectRepository } from "@/repositories";

async function main() {
  const projectRepo = new ProjectRepository();  

  projectRepo.create()

}

main().catch(e => console.log(e));