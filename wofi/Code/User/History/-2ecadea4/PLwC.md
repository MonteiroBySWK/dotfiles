# Componentes de Layout - Dashboard Padronizado

## Visão Geral

Este documento descreve os componentes criados para padronizar o layout das páginas do dashboard, resolvendo inconsistências de breadcrumbs, padding e layout.

## Problemas Resolvidos

### 1. **Breadcrumbs Inconsistentes**
- **Problema**: Muitas páginas mostravam apenas "Dashboard" ao invés do nome da página atual
- **Solução**: Mapeamento completo de rotas e geração automática de breadcrumbs no layout

### 2. **Padding Desigual**
- **Problema**: Páginas com paddings diferentes causando desalinhamento
- **Solução**: Componente `PageContainer` com padding padronizado

### 3. **Campo de Busca Sobreposto**
- **Problema**: Campo de busca ficava por cima de outros elementos quando sidebar minimizado
- **Solução**: Responsividade no sidebar com ocultação inteligente do campo

## Componentes

### PageHeader
Padroniza cabeçalhos de página com breadcrumbs, título, descrição e ações.

```tsx
import { PageHeader } from "@/components/layout/page-header"
import { Plus } from "lucide-react"

<PageHeader
  title="Projetos"
  description="Gerencie todos os seus projetos em andamento"
  actions={[
    {
      label: "Novo Projeto",
      icon: Plus,
      href: "/dashboard/projects/new"
    }
  ]}
  badge={{
    label: `${projects.length} projetos`,
    variant: "secondary"
  }}
/>
```

**Props:**
- `title` (string): Título da página
- `description?` (string): Descrição opcional
- `breadcrumbs?` (BreadcrumbItem[]): Breadcrumbs customizados (auto-gerados se omitido)
- `actions?` (ActionButton[]): Botões de ação no canto direito
- `badge?` (object): Badge opcional ao lado do título
- `className?` (string): Classes CSS adicionais

### PageContainer
Wrapper com padding e largura consistentes.

```tsx
import { PageContainer } from "@/components/layout/page-container"

<PageContainer>
  <PageHeader title="Minha Página" />
  {/* Conteúdo da página */}
</PageContainer>
```

**Props:**
- `children` (ReactNode): Conteúdo da página
- `className?` (string): Classes CSS adicionais
- `maxWidth?` ("sm" | "md" | "lg" | "xl" | "2xl" | "full"): Largura máxima
- `padding?` ("none" | "sm" | "md" | "lg"): Tamanho do padding

## Layout do Dashboard

### Breadcrumbs Automáticos
O layout agora gera breadcrumbs automaticamente baseado na URL:

```
/dashboard → ["Dashboard"]
/dashboard/projects → ["Dashboard", "Projetos"]
/dashboard/projects/alpha → ["Dashboard", "Projetos", "Projeto Alpha"]
/dashboard/settings → ["Dashboard", "Configurações"]
```

### Sidebar Responsivo
- Campo de busca oculto quando minimizado
- Ícone de busca exibido no modo compacto
- Links com truncamento adequado

## Padrão de Uso

### Estrutura Recomendada
```tsx
export default function MinhaPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Título da Página"
        description="Descrição da funcionalidade"
        actions={[
          {
            label: "Nova Ação",
            icon: Plus,
            onClick: handleAction
          }
        ]}
      />
      
      {/* Filtros e controles */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Controles da página */}
      </div>
      
      {/* Conteúdo principal */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Cards ou lista de itens */}
      </div>
    </PageContainer>
  )
}
```

### Exemplo Completo
Veja `/src/app/dashboard/projects/page.tsx` para um exemplo completo de implementação.

## Migração de Páginas Existentes

### Antes
```tsx
export default function MinhaPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Título</h1>
          <p className="text-muted-foreground">Descrição</p>
        </div>
        <Button>Ação</Button>
      </div>
      {/* conteúdo */}
    </div>
  )
}
```

### Depois
```tsx
import { PageHeader } from "@/components/layout/page-header"
import { PageContainer } from "@/components/layout/page-container"

export default function MinhaPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Título"
        description="Descrição"
        actions={[{ label: "Ação", onClick: handleAction }]}
      />
      {/* conteúdo */}
    </PageContainer>
  )
}
```

## Benefícios

1. **Consistência Visual**: Todas as páginas seguem o mesmo padrão
2. **Breadcrumbs Automáticos**: Navegação clara sem configuração manual
3. **Responsividade**: Layout adaptável a diferentes tamanhos de tela
4. **Manutenibilidade**: Mudanças centralizadas nos componentes de layout
5. **Acessibilidade**: Estrutura semântica consistente

## Próximos Passos

1. Migrar outras páginas do dashboard para usar os novos componentes
2. Adicionar temas e variações de layout conforme necessário
3. Implementar breadcrumbs dinâmicos para rotas com parâmetros
4. Adicionar testes para os componentes de layout
