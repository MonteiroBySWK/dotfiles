# Sistema REVIS - Gestão de Estoque

Sistema web para gestão de estoque de insumos e produtos acabados de uma empresa de bebidas, substituindo planilhas Excel manuais.

## 🚀 Stack Tecnológica

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: TailwindCSS 4, Shadcn/ui
- **Backend**: Firebase (Firestore, Authentication, Cloud Functions, Storage)
- **Ícones**: Lucide React
- **Utilitários**: date-fns, clsx, tailwind-merge

## 📋 Funcionalidades Principais

### ✅ Gestão de Estoque (ESSENCIAL)
- Cadastro de insumos (REQ-01)
- Registro de entrada e saída (REQ-02)
- Cálculo automático de consumo (REQ-03)
- Alertas de estoque abaixo do mínimo (REQ-04)
- Histórico completo de movimentações (REQ-05)
- Controle automático de perdas (REQ-06)

### ✅ Controle de Pedidos (ESSENCIAL)
- Criação de pedidos com múltiplos itens (REQ-07)
- Rastreamento de status (REQ-08)
- Atualização automática do estoque no recebimento (REQ-09)
- Cálculo do valor total (REQ-10)
- Anexação de documentos (REQ-11)

### ✅ Controle de Produção (ESSENCIAL)
- Registro de produção diária (REQ-12)
- Cálculo automático de consumo por receita (REQ-13)
- Controle de validade de 3 semanas (REQ-14)
- Alertas de produtos próximos ao vencimento (REQ-15)
- Priorização FIFO (REQ-16)
- Distribuição automática de produção (REQ-17)

### 📊 Relatórios (CONDICIONAL)
- Exportação em Excel, PDF e CSV (REQ-18)

## 🗂️ Estrutura do Projeto

```
revis/
├── app/                          # Next.js App Router (Pages)
│   ├── globals.css              # Estilos globais com tokens REVIS
│   ├── layout.tsx               # Layout raiz
│   └── page.tsx                 # Dashboard principal
│
├── src/                         # Código fonte da aplicação
│   ├── components/              # Componentes React
│   │   ├── ui/                 # Componentes Shadcn/ui
│   │   ├── layout/             # Layout components
│   │   │   ├── DashboardLayout.tsx
│   │   │   ├── HeaderMainPage.tsx
│   │   │   └── SidebarNavigation.tsx
│   │   ├── dashboard/          # Dashboard components
│   │   │   └── CardStatistic.tsx
│   │   ├── inventory/          # Gestão de estoque
│   │   ├── production/         # Controle de produção
│   │   └── orders/             # Controle de pedidos
│   │
│   ├── lib/                    # Bibliotecas e utilitários
│   │   ├── firebase/
│   │   │   └── config.ts       # Configuração Firebase
│   │   ├── business-rules.ts   # Regras de negócio
│   │   └── utils.ts            # Utilitários (cn, etc)
│   │
│   ├── types/                  # Definições TypeScript
│   │   └── index.ts           # Tipos do sistema
│   │
│   └── hooks/                  # React Hooks customizados
│
├── docs/                       # Documentação do projeto
│   ├── CHECKLIST.md           # Checklist de implementação
│   ├── COMANDOS.md            # Comandos úteis
│   ├── ESTRUTURA_IMPLEMENTADA.md
│   └── PROXIMOS_PASSOS.md     # Roadmap
│
├── public/                     # Arquivos estáticos
│
├── .env.example               # Exemplo de variáveis de ambiente
├── components.json            # Configuração Shadcn/ui
├── tsconfig.json             # Configuração TypeScript
└── README.md                 # Este arquivo
```

## 🎨 Design System

### Paleta de Cores REVIS

| Token | Cor | Uso |
|-------|-----|-----|
| `--color-primary` | #37D4E6 | Ações principais, ícones ativos |
| `--color-secondary` | #FFFFFF | Texto sobre fundos escuros |
| `--color-accent` | #F37C87 | Destaques sutis |
| `--color-warning` | #F6E14E | Avisos e alertas |
| `--color-success` | #E84E1B | Êxito ou feedback positivo |
| `--color-background-brand` | #8C64EB | Cor de fundo principal |
| `--color-surface` | #F9FAFB | Superfícies claras |
| `--color-text` | #1F2937 | Texto padrão |

### Componentes

Todos os componentes seguem os padrões do Shadcn/ui e as diretrizes de acessibilidade WCAG AA.

## 🔧 Configuração

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Firebase

1. Crie um projeto no [Firebase Console](https://console.firebase.google.com/)
2. Copie `.env.example` para `.env.local`
3. Adicione suas credenciais do Firebase

```bash
cp .env.example .env.local
```

### 3. Executar em Desenvolvimento

```bash
npm run dev
```

Acesse: [http://localhost:3000](http://localhost:3000)

## 📊 Modelagem de Dados (Firestore)

### Collections Principais

#### `ingredientes`
Controle de insumos com histórico de movimentações

#### `produtos`
Drinks prontos com receitas (BOM)

#### `lotesProducao`
Planejamento e execução de produção

#### `pedidos`
Pedidos de compra com rastreamento

#### `eventos`
Eventos para planejamento de produção

#### `vendas`
Registro de vendas por evento

Veja detalhes completos em: `src/types/index.ts`

## 🔐 Segurança

- ✅ Autenticação Firebase (REQ-23)
- ✅ Níveis de acesso por usuário (REQ-25)
- ✅ Log de operações críticas (REQ-24)
- ✅ Criptografia HTTPS (REQ-26)

## 👥 Níveis de Usuário

- **Admin**: Configuração completa do sistema
- **Produção**: Registro de produção e consultas
- **Pedidos**: Criação e acompanhamento de pedidos
- **Visualizador**: Apenas leitura

## 📱 Responsividade

O sistema é totalmente responsivo e funciona em:
- Desktop (1024px+)
- Tablets (768px - 1023px)
- Mobile (320px - 767px)

## 🧪 Testes

```bash
# Executar testes (quando implementados)
npm test
```

## 🏗️ Build

```bash
npm run build
npm start
```

## 📝 Regras de Negócio Implementadas

### Distribuição de Produção (REQ-17)
```typescript
calcularDistribuicao(totalDrinks, percentuais)
```

### Cálculo de Consumo (REQ-13)
```typescript
calcularConsumoProducao(itensPlanejados, produtos)
```

### Controle de Perdas (REQ-06)
```typescript
registrarAjusteEstoque(estoqueAnterior, novoValor, motivo)
```

### FIFO (REQ-16)
```typescript
aplicarFIFO(lotes)
```

Veja implementação completa em: `src/lib/business-rules.ts`

## 📚 Documentação

Consulte os arquivos em `.github/instructions/` para diretrizes detalhadas:
- `design.instructions.md` - Padrões de design
- `general.instructions.md` - Visão geral do sistema
- `requirements.instructions.md` - Requisitos funcionais

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto é propriedade da REVIS.

## 📞 Suporte

Para dúvidas ou suporte, entre em contato com a equipe de desenvolvimento.

---

**REVIS © 2025** - Sistema de Gestão de Estoque

