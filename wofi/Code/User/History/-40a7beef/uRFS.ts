/**
 * Script para popular o banco de dados com dados de teste
 * Execute: npm run seed
 */

import { userService, projectService, taskService, clientService } from '../src/services';
import type { User, Project, Task, Client } from '../src/types';

// Função para criar usuários de teste
async function createTestUsers() {
  console.log('Criando usuários de teste...');

  const users = [
    {
      name: 'Admin Sistema',
      email: 'admin@dashboardthera.com',
      role: 'admin' as const,
      status: 'active' as const,
      department: 'Tecnologia',
      position: 'Administrador do Sistema',
      phone: '+55 11 99999-0001',
      bio: 'Administrador responsável pela configuração e manutenção do sistema.',
      skills: ['Administração', 'Firebase', 'React', 'Node.js'],
      preferences: {
        theme: 'system' as const,
        language: 'pt-BR',
        timezone: 'America/Sao_Paulo',
        notifications: {
          email: true,
          push: true,
          inApp: true
        },
        dashboard: {
          layout: 'default',
          widgets: []
        }
      },
      permissions: ['admin.*'],
      teamIds: [],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'João Silva',
      email: 'joao.silva@exemplo.com',
      role: 'developer' as const,
      status: 'active' as const,
      department: 'Desenvolvimento',
      position: 'Desenvolvedor Senior',
      phone: '+55 11 99999-0002',
      bio: 'Desenvolvedor fullstack com 8+ anos de experiência em React e Node.js.',
      skills: ['React', 'Node.js', 'TypeScript', 'Firebase', 'Next.js'],
      preferences: {
        theme: 'dark' as const,
        language: 'pt-BR',
        timezone: 'America/Sao_Paulo',
        notifications: {
          email: true,
          push: true,
          inApp: true
        },
        dashboard: {
          layout: 'default',
          widgets: []
        }
      },
      permissions: ['projects.read', 'projects.write', 'tasks.read', 'tasks.write'],
      teamIds: [],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Maria Santos',
      email: 'maria.santos@exemplo.com',
      role: 'designer' as const,
      status: 'active' as const,
      department: 'Design',
      position: 'UX/UI Designer',
      phone: '+55 11 99999-0003',
      bio: 'Designer com foco em experiência do usuário e interfaces modernas.',
      skills: ['Figma', 'Adobe XD', 'UI/UX', 'Design System', 'Prototipação'],
      preferences: {
        theme: 'light' as const,
        language: 'pt-BR',
        timezone: 'America/Sao_Paulo',
        notifications: {
          email: true,
          push: false,
          inApp: true
        },
        dashboard: {
          layout: 'default',
          widgets: []
        }
      },
      permissions: ['projects.read', 'tasks.read', 'tasks.write'],
      teamIds: [],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Carlos Oliveira',
      email: 'carlos.oliveira@exemplo.com',
      role: 'manager' as const,
      status: 'active' as const,
      department: 'Gestão',
      position: 'Gerente de Projetos',
      phone: '+55 11 99999-0004',
      bio: 'Gerente de projetos com certificação PMP e 10+ anos de experiência.',
      skills: ['Gestão de Projetos', 'Scrum', 'Kanban', 'Liderança', 'Planejamento'],
      preferences: {
        theme: 'system' as const,
        language: 'pt-BR',
        timezone: 'America/Sao_Paulo',
        notifications: {
          email: true,
          push: true,
          inApp: true
        },
        dashboard: {
          layout: 'default',
          widgets: []
        }
      },
      permissions: ['projects.*', 'tasks.*', 'users.read', 'reports.read'],
      teamIds: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  for (const userData of users) {
    try {
      const existingUser = await userService.getUserByEmail(userData.email);
      if (!existingUser) {
        const userId = await userService.createUser(userData);
        console.log(`✓ Usuário criado: ${userData.name} (${userId})`);
      } else {
        console.log(`- Usuário já existe: ${userData.name}`);
      }
    } catch (error) {
      console.error(`✗ Erro ao criar usuário ${userData.name}:`, error);
    }
  }
}

// Função para criar clientes de teste
async function createTestClients() {
  console.log('\nCriando clientes de teste...');

  const clients = [
    {
      name: 'TechCorp Soluções',
      email: 'contato@techcorp.com',
      phone: '+55 11 3000-1000',
      company: 'TechCorp Ltda',
      website: 'https://www.techcorp.com',
      status: 'active' as const,
      type: 'company' as const,
      projects: [],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Ana Pereira',
      email: 'ana.pereira@email.com',
      phone: '+55 11 99999-5555',
      status: 'active' as const,
      type: 'individual' as const,
      projects: [],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Startup Inovadora',
      email: 'hello@startupinovadora.com',
      phone: '+55 11 3000-2000',
      company: 'Startup Inovadora S.A.',
      website: 'https://www.startupinovadora.com',
      status: 'active' as const,
      type: 'company' as const,
      projects: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  for (const clientData of clients) {
    try {
      // Check if client already exists by email
      const existingClients = await clientService.getClients();
      const existingClient = existingClients.find(c => c.email === clientData.email);
      
      if (!existingClient) {
        const clientId = await clientService.createClient(clientData);
        console.log(`✓ Cliente criado: ${clientData.name} (${clientId})`);
      } else {
        console.log(`- Cliente já existe: ${clientData.name}`);
      }
    } catch (error) {
      console.error(`✗ Erro ao criar cliente ${clientData.name}:`, error);
    }
  }
}

// Função principal
async function main() {
  console.log('🌱 Iniciando seed do banco de dados...\n');

  try {
    await createTestUsers();
    await createTestClients();
    
    console.log('\n✅ Seed concluído com sucesso!');
    console.log('\n📝 Dados criados:');
    console.log('   - 4 usuários de teste (admin, developer, designer, manager)');
    console.log('   - 3 clientes de teste');
    console.log('\n🔗 Você pode fazer login com qualquer um dos emails criados.');
    console.log('   Senha padrão: 123456 (você precisará criar a conta via Firebase Auth)');
    
  } catch (error) {
    console.error('❌ Erro durante o seed:', error);
    process.exit(1);
  }
}

// Executar se for chamado diretamente
if (require.main === module) {
  main();
}

export { main as seed };