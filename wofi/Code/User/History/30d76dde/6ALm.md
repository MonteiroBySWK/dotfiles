# Varejo Rápido

Sistema de visualização e gerenciamento de dados de vendas desenvolvido com Next.js 15, React 19 e shadcn/ui. O projeto oferece uma interface moderna e responsiva para visualizar, filtrar e gerenciar dados de vendas, com funcionalidades de upload de arquivos .dat, integração com API Java Spring Boot e animações GSAP.

## 📚 Documentação Completa

**Para informações detalhadas, consulte a [documentação completa](./docs/indice.md) na pasta `/docs`:**

- **[resumo.md](./docs/resumo.md)** - Visão geral e características do projeto
- **[arquitetura.md](./docs/arquitetura.md)** - Arquitetura técnica e padrões
- **[api.md](./docs/api.md)** - Documentação completa da API
- **[componentes.md](./docs/componentes.md)** - Componentes React e sistema de design
- **[desenvolvimento.md](./docs/desenvolvimento.md)** - Guia para desenvolvedores

## ✨ Características Principais

### 🎨 Interface
- Design moderno usando shadcn/ui exclusivamente
- Interface totalmente responsiva
- Animações suaves com GSAP
- Toast notifications animados com Sonner
- Tema claro/escuro (sistema)

### 📊 Funcionalidades de Dados
- Visualização de dados de vendas em tabela paginada
- Busca em tempo real (não bloqueia digitação)
- Ordenação por múltiplos campos
- Paginação server-side
- Upload e processamento de arquivos .dat
- Preview de dados antes da confirmação

### 🚀 Performance
- Server-side pagination para grandes volumes de dados
- AbortController para cancelar requisições desnecessárias
- Lazy loading e otimizações de renderização
- Animações otimizadas para 60fps

### 🔌 Integração
- API Java Spring Boot no backend (porta 8080)
- Proxy CORS integrado no Next.js
- Processamento de arquivos .dat no frontend
- Sistema de cache e invalidação automática

## Table Columns

The sales table displays the following information:
- **Data da Venda** (Sale Date)
- **Nome do Cliente** (Customer Name)
- **Nome do Produto** (Product Name)
- **Quantidade** (Quantity)
- **Valor Unitário** (Unit Value)
- **Valor Total** (Total Value)

## 🛠️ Stack Tecnológica

### Frontend
- **Next.js 15.5.4** - Framework React com App Router
- **React 19.1.0** - Biblioteca de interface
- **TypeScript** - Tipagem estática
- **Tailwind CSS 4** - Estilização utilitária
- **shadcn/ui** - Componentes de interface
- **GSAP** - Animações avançadas
- **Sonner** - Toast notifications

### Backend Integration
- **Java Spring Boot** - API REST (localhost:8080)
- **CORS Proxy** - Integração via API Routes do Next.js

## Project Structure

```
src/
├── app/
│   ├── api/vendas/          # Sales API endpoint
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home page
├── components/
│   ├── ui/                  # shadcn/ui components
│   └── custom/              # Custom components
│       ├── sales-table.tsx
│       └── sales-table-skeleton.tsx
├── lib/
│   ├── utils.ts             # shadcn/ui utilities
│   └── formatters.ts        # Formatting utilities
└── types/
    └── sales.ts             # TypeScript types
```

## API Endpoints

### GET /api/vendas

Returns sales data in JSON format:

```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "saleDate": "2024-10-01",
      "customerName": "João Silva",
      "productName": "Smartphone Samsung Galaxy",
      "quantity": 1,
      "unitValue": 1200.00,
      "totalValue": 1200.00
    }
  ],
  "total": 8
}
```

## 🚀 Início Rápido

```bash
# Clone o repositório
git clone https://github.com/MonteiroBySWK/varejo_rapido.git
cd varejo_rapido

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev

# Acesse http://localhost:3001
```

### Pré-requisitos
- Node.js 18.17+ ou 20+
- Backend Java Spring Boot rodando na porta 8080
- PostgreSQL (configurado no backend)

## 📋 Scripts Disponíveis

```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build de produção
npm run start        # Servidor de produção
npm run lint         # Verificação de código
```

## 🏗️ Arquitetura

O projeto segue uma arquitetura moderna de frontend/backend separados:

```
Frontend (Next.js) ↔ API Proxy ↔ Backend (Spring Boot) ↔ Database (PostgreSQL)
```

- **Frontend**: React 19 + Next.js 15 + shadcn/ui + GSAP
- **Proxy**: API Routes do Next.js para resolver CORS
- **Backend**: Java Spring Boot com REST API
- **Database**: PostgreSQL com dados de vendas

## 🎯 Principais Funcionalidades

- ✅ **Tabela de Vendas**: Visualização paginada com ordenação
- ✅ **Busca em Tempo Real**: Filtro por cliente/produto sem travar UI
- ✅ **Upload de Arquivos .dat**: Drag & drop com preview
- ✅ **Animações GSAP**: Transições suaves e feedback visual
- ✅ **Toast Notifications**: Feedback animado para ações
- ✅ **Responsividade**: Interface adaptável para mobile/desktop
- ✅ **Server-side Pagination**: Performance para grandes datasets
- ✅ **Integração API Java**: Comunicação via proxy CORS

## 📱 Formatação

O aplicativo usa formatação brasileira:
- **Moeda**: Real brasileiro (BRL) - R$ 1.234,56
- **Datas**: DD/MM/AAAA - 03/12/2024
- **Números**: Separadores brasileiros - 1.234,56

## 🤝 Contribuindo

1. Consulte a [documentação completa](./docs/indice.md)
2. Siga os [padrões de desenvolvimento](./docs/desenvolvimento.md)
3. Use apenas componentes shadcn/ui
4. Mantenha TypeScript strict mode
5. Teste responsividade

## 📄 Licença

Projeto privado - Todos os direitos reservados.
