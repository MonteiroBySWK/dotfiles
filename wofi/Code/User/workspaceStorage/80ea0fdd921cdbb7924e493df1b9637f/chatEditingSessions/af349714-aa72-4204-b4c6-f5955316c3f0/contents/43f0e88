# 🚀 Próximos Passos - Sistema REVIS

Este documento descreve as próximas etapas de desenvolvimento do sistema.

## ✅ Concluído

- [x] Setup inicial do projeto (Next.js, TypeScript, TailwindCSS)
- [x] Instalação e configuração do Shadcn/ui
- [x] Configuração da paleta de cores REVIS
- [x] Definição de tipos TypeScript (Firestore)
- [x] Configuração do Firebase
- [x] Implementação das regras de negócio core
- [x] Criação do layout principal (Header, Sidebar, Dashboard)
- [x] Dashboard com cards de estatísticas
- [x] Estrutura de pastas organizada
- [x] Sistema de autenticação (AuthContext, Login, ProtectedRoute)
- [x] Hooks genéricos (useFirestore, useIngredientes)
- [x] **Gestão de Estoque completa** (REQ-01, REQ-05, REQ-06)
- [x] **Correções de conectividade Firebase** (persistência offline, tratamento de erros, timeout)

## 🔨 Em Desenvolvimento

### 1. Telas Principais (Alta Prioridade)

#### 1.1 Gestão de Estoque (`/app/estoque`) ✅ CONCLUÍDO
- [x] Lista de ingredientes com busca e filtros
- [x] Formulário de cadastro/edição de ingredientes
- [x] Modal de ajuste de estoque (com detecção de perdas)
- [x] Visualização de histórico de movimentações
- [x] Indicadores visuais de estoque baixo

**Componentes necessários:**
- `TableIngredientList.tsx` ✅
- `FormIngredient.tsx` ✅
- `ModalAjusteEstoque.tsx` ✅
- `HistoricoMovimentacao.tsx` ✅

#### 1.2 Controle de Pedidos (`/app/pedidos`) ✅ CONCLUÍDO
- [x] Lista de pedidos com status
- [x] Formulário de criação de pedido
- [x] Fluxo de aprovação e rastreamento (REQ-08)
- [x] Confirmação de recebimento (atualiza estoque - REQ-09)
- [ ] Upload de documentos (notas fiscais - REQ-11)

**Componentes necessários:**
- `TablePedidosList.tsx` ✅
- `FormPedido.tsx` ✅
- `CardPedidoDetalhes.tsx` ✅
- `UploadDocumento.tsx` (pendente)

#### 1.3 Controle de Produção (`/app/producao`)
- [ ] Planejamento de produção por evento
- [ ] Distribuição automática por percentuais (REQ-17)
- [ ] Cálculo de consumo de insumos (REQ-13)
- [ ] Validação de estoque disponível
- [ ] Registro de produção executada
- [ ] Controle de lotes e validade (FIFO)

**Componentes necessários:**
- `FormLoteProducao.tsx`
- `DistribuicaoAutomatica.tsx`
- `TabelaConsumo.tsx`
- `AlertaValidadeProxima.tsx`

#### 1.4 Eventos (`/app/eventos`)
- [ ] Cadastro de eventos
- [ ] Histórico de vendas por evento
- [ ] Previsão de demanda baseada em histórico

**Componentes necessários:**
- `FormEvento.tsx`
- `TableEventosList.tsx`
- `GraficoPrevisaoDemanda.tsx`

### 2. Funcionalidades de Suporte (Média Prioridade)

#### 2.1 Alertas (`/app/alertas`)
- [ ] Central de notificações
- [ ] Alertas de estoque baixo (REQ-04)
- [ ] Alertas de validade próxima (REQ-15)
- [ ] Alertas de perdas registradas
- [ ] Marcar como lido/não lido

#### 2.2 Vendas (`/app/vendas`)
- [ ] Registro de vendas por evento e ilha
- [ ] Atualização automática de estoque (FIFO)
- [ ] Dashboard de performance

#### 2.3 Relatórios (`/app/relatorios`)
- [ ] Relatório de estoque
- [ ] Relatório de perdas
- [ ] Relatório de produção
- [ ] Relatório de vendas
- [ ] Exportação (Excel, PDF, CSV) - REQ-18

### 3. Firebase Backend (Alta Prioridade)

#### 3.1 Cloud Functions
```javascript
functions/
├── onProducaoExecutada.js    // Atualiza estoque ao executar produção
├── onPedidoRecebido.js       // Atualiza estoque ao receber pedido
├── verificarAlertas.js        // Scheduled function (diária)
├── aplicarFIFO.js            // Consumo FIFO em vendas
└── calcularPrevisao.js       // Previsão de demanda
```

#### 3.2 Security Rules
```javascript
rules/
├── firestore.rules           // Regras de segurança Firestore
└── storage.rules            // Regras para upload de documentos
```

#### 3.3 Indexes
- Criar índices compostos para consultas complexas
- Otimizar queries de histórico e relatórios

### 4. Autenticação e Autorização (Alta Prioridade)

- [x] Tela de login
- [ ] Tela de cadastro (apenas admin)
- [x] Middleware de proteção de rotas
- [x] Controle de acesso por nível de usuário
- [ ] Log de operações críticas (REQ-24)

**Componentes implementados:**
- `LoginPage.tsx` ✅
- `ProtectedRoute.tsx` ✅
- `AuthContext.tsx` ✅

### 5. Hooks Customizados (Média Prioridade)

```typescript
hooks/
├── useAuth.ts                 // Autenticação ✅
├── useIngredientes.ts        // CRUD de ingredientes ✅
├── usePedidos.ts            // CRUD de pedidos
├── useProducao.ts           // CRUD de produção
├── useEventos.ts            // CRUD de eventos
├── useAlertas.ts            // Gestão de alertas
└── useFirestore.ts          // Operações genéricas ✅
```

### 6. Otimizações e Melhorias (Baixa Prioridade)

- [ ] Loading states e skeletons
- [ ] Error boundaries
- [ ] Toast notifications (Sonner)
- [ ] Paginação em listas grandes
- [ ] Cache e otimização de queries
- [ ] Service Worker para offline support
- [ ] PWA (Progressive Web App)
- [ ] Testes unitários e E2E
- [ ] Documentação Storybook

### 7. Migração de Dados (Média Prioridade)

- [ ] Script de migração das planilhas Excel
- [ ] Validação de dados migrados
- [ ] Backup dos dados originais

## 📅 Cronograma Sugerido

### Sprint 1 (2 semanas) - MVP
- Autenticação básica
- Gestão de Estoque completa
- Controle de Pedidos básico
- Cloud Functions essenciais

### Sprint 2 (2 semanas) - Produção
- Controle de Produção completo
- Cálculo de consumo e distribuição
- Controle de validade e FIFO
- Eventos básico

### Sprint 3 (2 semanas) - Análise
- Dashboard avançado
- Vendas e histórico
- Alertas completos
- Previsão de demanda

### Sprint 4 (1 semana) - Relatórios
- Todos os relatórios
- Exportação de dados
- Gráficos e visualizações

### Sprint 5 (1 semana) - Polimento
- Otimizações
- Testes
- Documentação
- Migração de dados

## 🎯 Critérios de Aceitação

Cada funcionalidade deve atender:
- ✅ Responsividade (mobile, tablet, desktop)
- ✅ Acessibilidade (WCAG AA)
- ✅ Performance (consultas ≤3s)
- ✅ Validação de dados
- ✅ Feedbacks visuais claros
- ✅ Documentação no código
- ✅ Testes (quando aplicável)

## 📝 Observações

- Priorize funcionalidades ESSENCIAIS antes das CONDICIONAIS
- Mantenha a consistência com o design system
- Documente decisões arquiteturais importantes
- Commit frequente com mensagens descritivas
- Code review antes de merge

---

**Última atualização**: 09/11/2025
