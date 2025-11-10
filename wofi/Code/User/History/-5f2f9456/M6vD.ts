import { BaseRepository } from './base.repository'
import { Team, TeamSettings } from '@/types'

export class TeamRepository extends BaseRepository<Team> {
  constructor() {
    // Use pluralized collection name to match existing convention and data
    super('teams')
  }

  // Get teams by company
  async getByCompany(companyId: string): Promise<Team[]> {
    return this.getAll({
      where: [{ field: 'companyId', operator: '==', value: companyId }],
      orderBy: [{ field: 'createdAt', direction: 'desc' }]
    })
  }

  // Get teams by leader
  async getByLeader(leaderId: string): Promise<Team[]> {
    return this.getAll({
      where: [{ field: 'leaderId', operator: '==', value: leaderId }],
      orderBy: [{ field: 'updatedAt', direction: 'desc' }]
    })
  }

  // Get teams where the user is a member
  async getByMember(userId: string): Promise<Team[]> {
    return this.getAll({
      where: [{ field: 'memberIds', operator: 'array-contains', value: userId }],
      orderBy: [{ field: 'updatedAt', direction: 'desc' }]
    })
  }

  // Add a member to a team (no duplicates)
  async addMember(teamId: string, userId: string): Promise<void> {
    const team = await this.getById(teamId)
    if (!team) throw new Error('Team not found')

    if (team.memberIds.includes(userId)) {
      return
    }

    const updatedMembers = [...team.memberIds, userId]
    await this.update(teamId, { memberIds: updatedMembers })
  }

  // Remove a member from a team
  async removeMember(teamId: string, userId: string): Promise<void> {
    const team = await this.getById(teamId)
    if (!team) throw new Error('Team not found')

    const updatedMembers = team.memberIds.filter(id => id !== userId)
    await this.update(teamId, { memberIds: updatedMembers })
  }

  // Assign or change team leader
  async assignLeader(teamId: string, userId: string): Promise<void> {
    await this.update(teamId, { leaderId: userId })
  }

  // Link a project to a team
  async addProject(teamId: string, projectId: string): Promise<void> {
    const team = await this.getById(teamId)
    if (!team) throw new Error('Team not found')

    if (team.projectIds.includes(projectId)) {
      return
    }

    const updated = [...team.projectIds, projectId]
    await this.update(teamId, { projectIds: updated })
  }

  // Unlink a project from a team
  async removeProject(teamId: string, projectId: string): Promise<void> {
    const team = await this.getById(teamId)
    if (!team) throw new Error('Team not found')

    const updated = team.projectIds.filter(id => id !== projectId)
    await this.update(teamId, { projectIds: updated })
  }

  // Update team settings (partial)
  async updateSettings(teamId: string, settings: Partial<TeamSettings>): Promise<void> {
    const team = await this.getById(teamId)
    if (!team) throw new Error('Team not found')

    await this.update(teamId, { settings: { ...team.settings, ...settings } as TeamSettings })
  }

}