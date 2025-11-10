# 🚀 REVIS - Guia Rápido de Referência

Referência rápida para desenvolvimento e uso do Sistema REVIS.

## 📁 Estrutura de Arquivos

```
/app                    → Páginas Next.js (9 rotas)
/src/components         → Componentes React (45+)
  /ui                  → Shadcn/ui (20 componentes)
  /layout              → HeaderMainPage, Sidebar
  /dashboard           → Cards de métricas
  /estoque             → Ingredientes, ajuste estoque
  /pedidos             → Pedidos, upload documentos
  /producao            → Lotes, BOM
  /eventos             → Eventos
  /vendas              → Vendas por evento/ponto
  /alertas             → Central de notificações
  /relatorios          → 4 relatórios completos
/src/hooks             → 10 hooks customizados
/src/lib               → Firebase, utils, business rules
/src/types             → Interfaces TypeScript (25+)
/docs                  → Documentação completa
```

## 🎯 Comandos Principais

```bash
# Desenvolvimento
pnpm dev                # Inicia servidor dev (http://localhost:3000)
pnpm build              # Build de produção
pnpm start              # Inicia servidor produção

# Banco de Dados
pnpm run seed           # Popula Firestore com dados de teste

# Linting
pnpm lint               # ESLint check
pnpm lint:fix           # ESLint fix

# Tipos
pnpm type-check         # TypeScript check
```

## 🔥 Firebase Collections

| Collection | Documentos | Propósito |
|-----------|-----------|-----------|
| `ingredientes` | Insumos | Gestão de estoque |
| `produtos` | Drinks | Produtos acabados com BOM |
| `pedidos` | Pedidos | Controle de compras |
| `lotesProducao` | Lotes | Planejamento e execução |
| `lotesProduto` | Lotes FIFO | Controle de validade |
| `eventos` | Eventos | Feiras, shows, etc |
| `vendas` | Vendas | Histórico de vendas |
| `pontosVenda` | Ilhas | Pontos de venda |
| `alertas` | Alertas | Notificações |
| `usuarios` | Usuários | Controle de acesso |

## 🎨 Paleta de Cores REVIS

```css
--color-primary: #37D4E6     /* Azul turquesa - ações principais */
--color-accent: #F37C87      /* Rosa coral - destaques */
--color-success: #E84E1B     /* Laranja - sucesso */
--color-warning: #F6E14E     /* Amarelo - avisos */
--color-background: #8C64EB  /* Roxo - branding */
```

## 🪝 Hooks Disponíveis

```typescript
useAuth()              // Autenticação, usuário logado
useFirestore()         // Operações CRUD genéricas
useIngredientes()      // CRUD Ingredientes
usePedidos()          // CRUD Pedidos
useLotesProducao()    // CRUD Lotes
useEventos()          // CRUD Eventos
useVendas()           // CRUD Vendas com filtros
usePontosVenda()      // CRUD Pontos de Venda
useProdutos()         // CRUD Produtos
useAlertas()          // Gestão de alertas
```

### Exemplo de uso:
```typescript
const { data, loading, create, update, remove } = useIngredientes();

// Criar
await create({ nome: 'Vodka', categoria: 'Bebida', ... });

// Atualizar
await update(id, { estoqueAtual: 1000 });

// Remover
await remove(id);
```

## 📦 Componentes Shadcn Instalados

- Button, Card, Input, Label, Select
- Dialog, Dropdown, Badge, Separator
- Textarea, Tabs, Calendar, Checkbox
- Table, Avatar, Alert, Skeleton
- Progress, Command

## 🔐 Níveis de Acesso

```typescript
enum NivelUsuario {
  ADMIN = 'admin',              // Acesso total
  PRODUCAO = 'producao',        // Produção e estoque
  PEDIDOS = 'pedidos',          // Pedidos e recebimentos
  VISUALIZADOR = 'visualizador' // Apenas leitura
}
```

## 📊 Fluxos Principais

### 1. Criar Pedido
```
1. /pedidos → Novo Pedido
2. Adicionar itens (ingrediente, qtd, preço)
3. Upload documentos (opcional)
4. Salvar → Status: Solicitado
5. Rastreamento: Separação → Entrega → Recebido
6. Ao Receber: Estoque atualizado automaticamente
```

### 2. Executar Produção
```
1. /producao → Novo Lote
2. Selecionar evento
3. Informar total de drinks
4. Sistema distribui por percentuais
5. Ajustar quantidades (opcional)
6. Sistema calcula consumo (BOM)
7. Validar estoque disponível
8. Executar → Baixa automática de ingredientes
```

### 3. Registrar Venda
```
1. /vendas → Nova Venda
2. Selecionar evento + ponto de venda
3. Selecionar produto
4. Informar quantidade e valor
5. Salvar → Atualizado em tempo real
6. Dashboard atualiza totalizadores
```

### 4. Gerar Relatório
```
1. /relatorios
2. Selecionar tipo (Estoque, Perdas, Produção, Vendas)
3. Visualizar dados
4. Exportar CSV
```

## 🚨 Alertas Automáticos

| Tipo | Condição | Ação |
|------|----------|------|
| Estoque Baixo | `atual < mínimo` | Criar alerta |
| Validade Próxima | `< 7 dias` | Criar alerta |
| Perda Registrada | Ajuste manual | Criar alerta |

## 📝 Convenções de Código

### Nomenclatura
```typescript
// Componentes: PascalCase
export function CardPedidoDetalhes() { }

// Hooks: camelCase com prefixo 'use'
export function usePedidos() { }

// Tipos: PascalCase
export interface Pedido { }

// Constantes: UPPER_SNAKE_CASE
const MAX_FILE_SIZE = 5 * 1024 * 1024;
```

### Estrutura de Componente
```typescript
/**
 * Descrição do componente
 * Sistema REVIS - REQ-XX
 */

'use client'; // Se usar hooks

import { ... } from '...';

interface Props {
  // Props aqui
}

export function ComponentName({ prop1, prop2 }: Props) {
  // Hooks
  const [state, setState] = useState();
  
  // Funções
  const handleAction = () => { };
  
  // Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

## 🔧 Troubleshooting

### Firebase não conecta
```bash
# Verificar .env.local
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
# ... etc

# Reiniciar dev server
pnpm dev
```

### Seed não funciona
```bash
# Verificar Firebase credentials
pnpm run seed

# Se erro de Auth, remover usuários do seed
# Criar manualmente no Firebase Console
```

### Build error
```bash
# Limpar cache
rm -rf .next
pnpm build

# Verificar erros TypeScript
pnpm type-check
```

## 📚 Documentação Completa

- **[README.md](../README.md)** - Visão geral do sistema
- **[GUIA_SETUP.md](./GUIA_SETUP.md)** - Setup completo passo a passo
- **[PROXIMOS_PASSOS.md](./PROXIMOS_PASSOS.md)** - Roadmap de desenvolvimento
- **[FINALIZACAO.md](./FINALIZACAO.md)** - Resumo da implementação
- **[TODO.md](../TODO.md)** - Lista de tarefas pendentes
- **[requirements.instructions.md](./.github/instructions/requirements.instructions.md)** - Requisitos funcionais
- **[design.instructions.md](./.github/instructions/design.instructions.md)** - Guia de design

## 🎓 Links Úteis

- **Next.js 15**: https://nextjs.org/docs
- **React 19**: https://react.dev
- **Firebase**: https://firebase.google.com/docs
- **Shadcn/ui**: https://ui.shadcn.com
- **TailwindCSS**: https://tailwindcss.com/docs
- **TypeScript**: https://www.typescriptlang.org/docs

---

**Sistema REVIS** | Desenvolvido com ❤️  
Status: **92% Completo** | Última atualização: 09/11/2025
