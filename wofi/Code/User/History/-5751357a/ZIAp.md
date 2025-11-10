# Documentação da API

## Visão Geral

A API do Varejo Rápido utiliza um sistema de proxy através das API Routes do Next.js para comunicação com o backend Java Spring Boot. Todos os endpoints frontend fazem proxy para o backend Java na porta 8080.

## Arquitetura da API

```
Frontend Request → Next.js API Route → Java Spring Boot → Database
                     (Port 3001)        (Port 8080)
```

## Endpoints Disponíveis

### 1. Vendas Paginadas

#### GET `/api/vendas/paginado`

Retorna vendas com paginação server-side.

**Parâmetros de Query:**
```typescript
{
  page?: number;        // Página (default: 0)
  size?: number;        // Itens por página (default: 10)
  sortBy?: string;      // Campo para ordenação (default: "id")
  sortDir?: "asc"|"desc"; // Direção da ordenação (default: "asc")
}
```

**Exemplo de Request:**
```bash
GET /api/vendas/paginado?page=0&size=10&sortBy=saleDate&sortDir=desc
```

**Response Schema:**
```typescript
{
  content: SaleData[];           // Array de vendas
  pageable: {
    pageNumber: number;          // Página atual
    pageSize: number;            // Tamanho da página
    sort: {
      sorted: boolean;           // Se está ordenado
      unsorted: boolean;         // Se não está ordenado
    };
    offset: number;              // Offset dos dados
  };
  totalElements: number;         // Total de elementos
  totalPages: number;            // Total de páginas
  last: boolean;                 // Se é a última página
  first: boolean;                // Se é a primeira página
  numberOfElements: number;      // Número de elementos na página
  size: number;                  // Tamanho da página
  number: number;                // Número da página atual
}
```

**Exemplo de Response:**
```json
{
  "content": [
    {
      "id": 1,
      "saleDate": "2024-12-03",
      "customerName": "João Silva",
      "productName": "Produto A",
      "quantity": 2,
      "unitValue": 25.50,
      "totalValue": 51.00
    }
  ],
  "pageable": {
    "pageNumber": 0,
    "pageSize": 10,
    "sort": { "sorted": true, "unsorted": false },
    "offset": 0
  },
  "totalElements": 25,
  "totalPages": 3,
  "last": false,
  "first": true,
  "numberOfElements": 10,
  "size": 10,
  "number": 0
}
```

### 2. Busca de Vendas

#### GET `/api/vendas/buscar`

Busca vendas por termo (nome do cliente ou produto).

**Parâmetros de Query:**
```typescript
{
  termo: string;        // Termo de busca (obrigatório)
  page?: number;        // Página (default: 0)
  size?: number;        // Itens por página (default: 10)
}
```

**Exemplo de Request:**
```bash
GET /api/vendas/buscar?termo=João&page=0&size=10
```

**Response:** Mesmo schema da paginação, mas filtrado pelo termo.

### 3. Upload de Arquivo DAT

#### POST `/api/upload-dat`

Processa arquivo .dat enviado pelo usuário.

**Request Body:**
```typescript
{
  filename: string;     // Nome do arquivo
  content: string;      // Conteúdo do arquivo em base64 ou string
}
```

**Response:**
```typescript
{
  success: boolean;
  message: string;
  data?: ProcessedData[];
}
```

### 4. Confirmação de Dados

#### POST `/api/confirm-dat`

Confirma e salva os dados processados do arquivo .dat.

**Request Body:**
```typescript
{
  data: ItemRequestBody[];  // Array de dados a serem salvos
}
```

**ItemRequestBody Schema:**
```typescript
{
  saleDate: string;         // Data da venda (YYYY-MM-DD)
  customerName: string;     // Nome do cliente
  productName: string;      // Nome do produto
  quantity: number;         // Quantidade vendida
  unitValue: number;        // Valor unitário
  totalValue: number;       // Valor total (quantity * unitValue)
}
```

**Response:**
```typescript
{
  success: boolean;
  message: string;
  count?: number;           // Número de registros processados
}
```

## Tipos de Dados

### SaleData
```typescript
interface SaleData {
  id: number;
  saleDate: string;         // ISO date string
  customerName: string;
  productName: string;
  quantity: number;
  unitValue: number;
  totalValue: number;
  createdAt?: string;       // Timestamp de criação
  updatedAt?: string;       // Timestamp de atualização
}
```

### PaginationResponse
```typescript
interface PaginationResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
  numberOfElements: number;
  size: number;
  number: number;
}
```

## Tratamento de Erros

### Códigos de Status HTTP

- **200 OK**: Requisição bem sucedida
- **400 Bad Request**: Parâmetros inválidos
- **404 Not Found**: Recurso não encontrado
- **500 Internal Server Error**: Erro interno do servidor

### Formato de Erro Padrão

```typescript
{
  error: string;            // Descrição do erro
  message: string;          // Mensagem amigável
  statusCode: number;       // Código HTTP
  timestamp: string;        // Timestamp do erro
}
```

**Exemplo de Response de Erro:**
```json
{
  "error": "Invalid pagination parameters",
  "message": "O tamanho da página deve ser entre 1 e 100",
  "statusCode": 400,
  "timestamp": "2024-12-03T10:30:00Z"
}
```

## Configuração CORS

### Headers Padrão
```javascript
{
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json'
}
```

### Preflight Requests
Todas as API routes suportam requisições OPTIONS para preflight do CORS.

## Rate Limiting

Atualmente não implementado, mas recomendado para produção:

```javascript
// Exemplo de implementação futura
const rateLimit = {
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // 100 requests por window
  message: 'Muitas requisições, tente novamente em 15 minutos'
};
```

## Autenticação

**Status Atual**: Não implementada
**Planejado**: JWT tokens com refresh

```typescript
// Schema futuro
interface AuthRequest {
  headers: {
    Authorization: `Bearer ${string}`;
  };
}

interface AuthResponse {
  token: string;
  refreshToken: string;
  expiresIn: number;
  user: UserData;
}
```

## Logs e Monitoramento

### Estrutura de Logs
```javascript
console.log('🚀 API Request:', {
  method: req.method,
  url: req.url,
  timestamp: new Date().toISOString(),
  params: req.query,
  body: req.body
});
```

### Métricas Importantes
- Tempo de resposta por endpoint
- Taxa de erro por endpoint
- Volume de requisições por minuto
- Tamanho médio das responses

## Endpoints do Backend Java

### Mapeamento de Rotas

| Frontend Route | Java Backend Route | Método |
|---|---|---|
| `/api/vendas/paginado` | `/vendas/paginado` | GET |
| `/api/vendas/buscar` | `/vendas/buscar` | GET |
| `/api/confirm-dat` | `/vendas/confirmar` | POST |
| `/api/upload-dat` | `/vendas/upload` | POST |

### Transformação de Parâmetros

#### Ordenação
```javascript
// Frontend → Backend
sortBy: "customerName" → sort: "customerName,asc"
sortDir: "desc" → sort: "customerName,desc"
```

#### Paginação
```javascript
// Frontend → Backend
page: 0, size: 10 → page=0&size=10
```

## Testes da API

### Teste Manual com cURL

```bash
# Listar vendas paginadas
curl -X GET "http://localhost:3001/api/vendas/paginado?page=0&size=5"

# Buscar vendas
curl -X GET "http://localhost:3001/api/vendas/buscar?termo=João&page=0&size=10"

# Upload de dados (exemplo)
curl -X POST "http://localhost:3001/api/confirm-dat" \
  -H "Content-Type: application/json" \
  -d '{
    "data": [
      {
        "saleDate": "2024-12-03",
        "customerName": "Teste Cliente",
        "productName": "Teste Produto",
        "quantity": 1,
        "unitValue": 10.00,
        "totalValue": 10.00
      }
    ]
  }'
```

### Teste com Frontend

```javascript
// Exemplo de uso no React
const fetchSalesData = async (page = 0, size = 10) => {
  try {
    const response = await fetch(
      `/api/vendas/paginado?page=${page}&size=${size}`
    );
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};
```

## Próximas Implementações

- [ ] Autenticação JWT
- [ ] Rate limiting
- [ ] Logs estruturados
- [ ] Métricas de performance  
- [ ] Cache de responses
- [ ] Validação de schema com Zod
- [ ] Testes automatizados da API
- [ ] Documentação OpenAPI/Swagger