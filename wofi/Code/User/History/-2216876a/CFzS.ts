import { ProjectRepository } from "@/repositories";

async function main() {
  const projectRepo = new ProjectRepository();  

  await projectRepo.create({
    name: 'Test project',
    description: 'created by test',
    status: 'planning',
    progress: 0,
    startDate: new Date(),
    priority: 'medium',
    teamMembers: [],
    managerId: 'manager_1',
    category: 'general',
    tags: [],
    milestones: [],
    attachments: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  })

}

main().catch(e => console.log(e));