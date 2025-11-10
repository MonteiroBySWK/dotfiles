# Arquitetura do Sistema

## Visão Geral da Arquitetura

O Varejo Rápido segue uma arquitetura moderna de frontend/backend separados, com o frontend em Next.js servindo como uma SPA (Single Page Application) que se comunica com uma API Java Spring Boot.

## Diagrama de Arquitetura

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   API Proxy     │    │   Backend       │
│   (Next.js)     │◄──►│   (Next.js)     │◄──►│   (Spring Boot) │
│                 │    │                 │    │                 │
│ - React 19      │    │ - CORS Handler  │    │ - REST API      │
│ - shadcn/ui     │    │ - Route Proxy   │    │ - Data Access   │
│ - GSAP          │    │ - Error Handler │    │ - Business Logic│
│ - Tailwind      │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                        │                        │
         ▼                        ▼                        ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Browser       │    │   Server        │    │   Database      │
│                 │    │   (Node.js)     │    │                 │
│ - DOM           │    │ - Port 3001     │    │ - PostgreSQL    │
│ - State Mgmt    │    │ - API Routes    │    │ - Sales Data    │
│ - Animations    │    │ - File Upload   │    │ - Customers     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Camadas da Aplicação

### 1. Camada de Apresentação (Frontend)
**Responsabilidade**: Interface do usuário e experiência interativa

**Componentes Principais**:
- **Pages**: Rotas da aplicação (`app/page.tsx`)
- **Components**: Componentes reutilizáveis (`components/`)
- **Hooks**: Lógica de estado personalizada (`hooks/`)
- **Lib**: Utilitários e helpers (`lib/`)

**Tecnologias**:
- React 19 para componentes
- Next.js 15 para roteamento
- shadcn/ui para interface
- GSAP para animações
- Tailwind CSS para estilização

### 2. Camada de Proxy/Gateway (API Routes)
**Responsabilidade**: Intermediação entre frontend e backend

**Funções**:
- Resolver problemas de CORS
- Transformar dados entre formatos
- Adicionar headers necessários
- Tratamento de erros padronizado

**Endpoints**:
```
/api/vendas/paginado    # Proxy para paginação
/api/vendas/buscar      # Proxy para busca
/api/confirm-dat        # Confirmação de upload
/api/upload-dat         # Upload de arquivos
```

### 3. Camada de Serviços (Backend)
**Responsabilidade**: Lógica de negócio e acesso a dados

**Endpoints Java**:
```
GET  /vendas/paginado?page=0&size=10&sortBy=id&sortDir=asc
GET  /vendas/buscar?termo=cliente&page=0&size=10
POST /vendas/confirmar
POST /vendas/upload
```

### 4. Camada de Dados
**Responsabilidade**: Persistência e recuperação de dados

**Entidades**:
- Sales (Vendas)
- Customers (Clientes)
- Products (Produtos)

## Fluxos de Dados

### Fluxo de Listagem de Vendas
```
1. User Action: Abrir página
2. Component Mount: SalesTable monta
3. Data Fetch: fetchSalesData()
4. API Call: GET /api/vendas/paginado
5. Proxy: Next.js → Spring Boot
6. Database Query: Spring Boot → PostgreSQL
7. Response Chain: DB → Spring Boot → Next.js → React
8. UI Update: Renderização da tabela
9. Animation: GSAP anima entrada dos dados
```

### Fluxo de Upload de Arquivo
```
1. User Action: Selecionar arquivo .dat
2. File Validation: Verificar formato e tamanho
3. File Processing: dat-processor.ts processa conteúdo
4. Preview: DatPreviewModal mostra dados
5. User Confirmation: Usuário confirma upload
6. API Call: POST /api/confirm-dat
7. Proxy: Next.js → Spring Boot
8. Database Insert: Spring Boot salva dados
9. Event: vendas-updated disparado
10. UI Refresh: Tabela recarrega automaticamente
```

### Fluxo de Busca
```
1. User Input: Digitação no campo de busca
2. Debounce: Aguarda 300ms sem digitação
3. Cancel Previous: AbortController cancela busca anterior
4. API Call: GET /api/vendas/buscar?termo=...
5. Proxy: Next.js → Spring Boot
6. Database Search: Busca com LIKE no banco
7. Response: Dados filtrados retornados
8. UI Update: Tabela atualizada com resultados
9. Animation: Linhas animam entrada
```

## Padrões Arquiteturais

### 1. Proxy Pattern
O Next.js atua como proxy entre o frontend e o backend Java, resolvendo problemas de CORS e padronizando respostas.

### 2. Observer Pattern
Sistema de eventos customizados para comunicação entre componentes:
```javascript
// Disparar evento
window.dispatchEvent(new CustomEvent('vendas-updated'));

// Escutar evento
useEffect(() => {
  const handleUpdate = () => fetchSalesData();
  window.addEventListener('vendas-updated', handleUpdate);
  return () => window.removeEventListener('vendas-updated', handleUpdate);
}, []);
```

### 3. Factory Pattern
Funções utilitárias para criar objetos padronizados:
```javascript
// Formatters para dados
export const formatCurrency = (value: number) => { ... }
export const formatDate = (date: string) => { ... }
```

### 4. Command Pattern
Animações GSAP encapsuladas em comandos reutilizáveis:
```javascript
animations.fadeIn(element);
animations.bounce(button);
animations.staggerFadeIn(tableRows);
```

## Gestão de Estado

### Estado Local (useState)
```javascript
const [data, setData] = useState<SaleData[]>([]);
const [loading, setLoading] = useState(false);
const [pagination, setPagination] = useState({ page: 0, size: 10 });
```

### Estado Derivado (useMemo)
```javascript
const filteredData = useMemo(() => {
  return data.filter(sale => 
    sale.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );
}, [data, searchTerm]);
```

### Efeitos Colaterais (useEffect)
```javascript
// Carregamento inicial
useEffect(() => {
  fetchSalesData();
}, []);

// Animações na renderização
useEffect(() => {
  if (data.length > 0) {
    animations.staggerFadeIn('.table-row-item');
  }
}, [data]);
```

## Otimizações de Performance

### 1. Server-side Pagination
```javascript
// Busca apenas a página necessária
const fetchSalesData = async (page = 0, size = 10) => {
  const response = await fetch(`/api/vendas/paginado?page=${page}&size=${size}`);
  return response.json();
};
```

### 2. Request Cancellation
```javascript
const abortController = new AbortController();
const response = await fetch(url, { signal: abortController.signal });
```

### 3. Debounced Search
```javascript
const debouncedSearch = useMemo(
  () => debounce((term: string) => searchSalesData(term), 300),
  []
);
```

### 4. Animation Performance
```javascript
// GSAP otimizado para 60fps
gsap.fromTo(element, 
  { opacity: 0, y: 20 },
  { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
);
```

## Tratamento de Erros

### Hierarquia de Tratamento
1. **Component Level**: Try/catch nos componentes
2. **API Level**: Error boundaries nas API routes
3. **Network Level**: Fetch error handling
4. **User Level**: Toast notifications

### Estratégias de Fallback
```javascript
try {
  const data = await fetchSalesData();
  setData(data);
} catch (error) {
  toast.error('Erro ao carregar dados');
  setData([]); // Fallback para array vazio
}
```

## Segurança

### CORS
- Configurado no proxy Next.js
- Headers apropriados para comunicação cross-origin

### Validação de Input
```javascript
// Validação de arquivos .dat
const validateDatFile = (file: File) => {
  if (!file.name.endsWith('.dat')) {
    throw new Error('Apenas arquivos .dat são aceitos');
  }
  if (file.size > 10 * 1024 * 1024) { // 10MB
    throw new Error('Arquivo muito grande');
  }
};
```

### Sanitização
- Escape de HTML em dados exibidos
- Validação de tipos TypeScript
- Sanitização de parâmetros de query