import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '../guards';
import { ProjectService } from '../services';
import {
  CreateProjectDto,
  UpdateProjectDto,
} from '../types';
import { successResponse } from '../lib';

@Controller('v1/projects')
@UseGuards(AuthGuard)
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  // Lista projects com filtros opcionais clientId, planId e pesquisa por nome
  @Get()
  async getProjects(
    @Query('clientId') clientId?: string,
    @Query('planId') planId?: string,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    if (clientId) {
      const projects = await this.projectService.findProjectsByClient({ id: clientId });
      return successResponse('Projects fetched successfully', {
        items: projects.map(p => ({
          id: p.id.id,
          name: p.name,
          description: p.description,
          cost: p.cost,
          deadline: p.deadline,
          scope: p.scope.map(s => s.id),
          backlogId: p.backlogId.id,
          clientId: p.clientId.id,
          planId: p.planId.id,
          sprints: p.sprints.map(s => s.id),
          requirements: p.requirements.map(r => r.id),
          members: p.members.map(m => m.id),
        })),
        total: projects.length,
      });
    }

    if (planId) {
      const projects = await this.projectService.findProjectsByPlan({ id: planId });
      return successResponse('Projects fetched successfully', {
        projects: projects.map(p => ({
          id: p.id.id,
          name: p.name,
          description: p.description,
          cost: p.cost,
          deadline: p.deadline,
          scope: p.scope.map(s => s.id),
          backlogId: p.backlogId.id,
          clientId: p.clientId.id,
          planId: p.planId.id,
          sprints: p.sprints.map(s => s.id),
          requirements: p.requirements.map(r => r.id),
          members: p.members.map(m => m.id),
        })),
        total: projects.length,
      });
    }

    if (search) {
      const projects = await this.projectService.searchProjectsByName(search);
      return successResponse('Projects fetched successfully', {
        projects: projects.map(p => ({
          id: p.id.id,
          name: p.name,
          description: p.description,
          cost: p.cost,
          deadline: p.deadline,
          scope: p.scope.map(s => s.id),
          backlogId: p.backlogId.id,
          clientId: p.clientId.id,
          planId: p.planId.id,
          sprints: p.sprints.map(s => s.id),
          requirements: p.requirements.map(r => r.id),
          members: p.members.map(m => m.id),
        })),
        total: projects.length,
      });
    }

    // Paginação simples
    if (page || pageSize) {
      const pageNum = page ? parseInt(page) : 1;
      const size = pageSize ? parseInt(pageSize) : 10;

      const allProjects = await this.projectService.getProjects();
      const pagedProjects = allProjects.slice((pageNum - 1) * size, pageNum * size);

      return successResponse('Projects fetched successfully', {
        projects: pagedProjects.map(p => ({
          id: p.id.id,
          name: p.name,
          description: p.description,
          cost: p.cost,
          deadline: p.deadline,
          scope: p.scope.map(s => s.id),
          backlogId: p.backlogId.id,
          clientId: p.clientId.id,
          planId: p.planId.id,
          sprints: p.sprints.map(s => s.id),
          requirements: p.requirements.map(r => r.id),
          members: p.members.map(m => m.id),
        })),
        total: allProjects.length,
        page: pageNum,
        pageSize: size,
      });
    }

    // Sem filtro, retornar todos
    const projects = await this.projectService.getProjects();
    return successResponse('Projects fetched successfully', {
      projects: projects.map(p => ({
        id: p.id.id,
        name: p.name,
        description: p.description,
        cost: p.cost,
        deadline: p.deadline,
        scope: p.scope.map(s => s.id),
        backlogId: p.backlogId.id,
        clientId: p.clientId.id,
        planId: p.planId.id,
        sprints: p.sprints.map(s => s.id),
        requirements: p.requirements.map(r => r.id),
        members: p.members.map(m => m.id),
      })),
      total: projects.length,
    });
  }

  // Busca project por id
  @Get(':id')
  async getProjectById(@Param('id') id: string) {
    const project = await this.projectService.getProjectById({ id });
    return successResponse('Project fetched successfully', {
      project: {
        id: project.id.id,
        name: project.name,
        description: project.description,
        cost: project.cost,
        deadline: project.deadline,
        scope: project.scope.map(s => s.id),
        backlogId: project.backlogId.id,
        clientId: project.clientId.id,
        planId: project.planId.id,
        sprints: project.sprints.map(s => s.id),
        requirements: project.requirements.map(r => r.id),
        members: project.members.map(m => m.id),
      },
    });
  }

  // Cria novo project
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createProject(@Body() body: CreateProjectDto) {
    const result = await this.projectService.createProject(body);
    return successResponse('Project created successfully', {
      project: {
        id: result.id,
        name: result.project.name,
        description: result.project.description,
        cost: result.project.cost,
        deadline: result.project.deadline,
        scope: result.project.scope.map(s => s.id),
        backlogId: result.project.backlogId.id,
        clientId: result.project.clientId.id,
        planId: result.project.planId.id,
        sprints: result.project.sprints.map(s => s.id),
        requirements: result.project.requirements.map(r => r.id),
        members: result.project.members.map(m => m.id),
      },
    });
  }

  // Atualiza project
  @Put(':id')
  async updateProject(@Param('id') id: string, @Body() body: UpdateProjectDto) {
    const project = await this.projectService.updateProject({ id }, body);
    return successResponse('Project updated successfully', {
      project: {
        id: project.id.id,
        name: project.name,
        description: project.description,
        cost: project.cost,
        deadline: project.deadline,
        scope: project.scope.map(s => s.id),
        backlogId: project.backlogId.id,
        clientId: project.clientId.id,
        planId: project.planId.id,
        sprints: project.sprints.map(s => s.id),
        requirements: project.requirements.map(r => r.id),
        members: project.members.map(m => m.id),
      },
    });
  }

  // Métodos para gerenciar arrays

  @Post(':id/scopes')
  async addScope(@Param('id') id: string, @Body() body: { scopeId: string }) {
    const project = await this.projectService.addScope({ id }, { id: body.scopeId });
    return successResponse('Scope added successfully', {
      project: { id: project.id.id, scope: project.scope.map(s => s.id) },
    });
  }

  @Delete(':id/scopes/:scopeId')
  @HttpCode(HttpStatus.OK)
  async removeScope(@Param('id') id: string, @Param('scopeId') scopeId: string) {
    const project = await this.projectService.removeScope({ id }, { id: scopeId });
    return successResponse('Scope removed successfully', {
      project: { id: project.id.id, scope: project.scope.map(s => s.id) },
    });
  }

  @Post(':id/sprints')
  async addSprint(@Param('id') id: string, @Body() body: { sprintId: string }) {
    const project = await this.projectService.addSprint({ id }, { id: body.sprintId });
    return successResponse('Sprint added successfully', {
      project: { id: project.id.id, sprints: project.sprints.map(s => s.id) },
    });
  }

  @Delete(':id/sprints/:sprintId')
  @HttpCode(HttpStatus.OK)
  async removeSprint(@Param('id') id: string, @Param('sprintId') sprintId: string) {
    const project = await this.projectService.removeSprint({ id }, { id: sprintId });
    return successResponse('Sprint removed successfully', {
      project: { id: project.id.id, sprints: project.sprints.map(s => s.id) },
    });
  }

  @Post(':id/requirements')
  async addRequirement(@Param('id') id: string, @Body() body: { requirementId: string }) {
    const project = await this.projectService.addRequirement({ id }, { id: body.requirementId });
    return successResponse('Requirement added successfully', {
      project: { id: project.id.id, requirements: project.requirements.map(r => r.id) },
    });
  }

  @Delete(':id/requirements/:requirementId')
  @HttpCode(HttpStatus.OK)
  async removeRequirement(@Param('id') id: string, @Param('requirementId') requirementId: string) {
    const project = await this.projectService.removeRequirement({ id }, { id: requirementId });
    return successResponse('Requirement removed successfully', {
      project: { id: project.id.id, requirements: project.requirements.map(r => r.id) },
    });
  }

  @Post(':id/members')
  async addMember(@Param('id') id: string, @Body() body: { memberId: string }) {
    const project = await this.projectService.addMember({ id }, { id: body.memberId });
    return successResponse('Member added successfully', {
      project: { id: project.id.id, members: project.members.map(m => m.id) },
    });
  }

  @Delete(':id/members/:memberId')
  @HttpCode(HttpStatus.OK)
  async removeMember(@Param('id') id: string, @Param('memberId') memberId: string) {
    const project = await this.projectService.removeMember({ id }, { id: memberId });
    return successResponse('Member removed successfully', {
      project: { id: project.id.id, members: project.members.map(m => m.id) },
    });
  }

  // Deletar project
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteProject(@Param('id') id: string) {
    await this.projectService.deleteProject({ id });
    return successResponse('Project deleted successfully', null);
  }

  // Estatísticas
  @Get('stats/overview')
  async getProjectStats() {
    const stats = await this.projectService.getProjectStats();
    return successResponse('Project statistics fetched successfully', { stats });
  }
}

