# Documentação dos Componentes

## Visão Geral

O sistema utiliza exclusivamente componentes do shadcn/ui como base, com componentes customizados específicos para as funcionalidades de vendas. Todos os componentes seguem padrões de design consistentes e incluem animações GSAP.

## Hierarquia de Componentes

```
App
├── Layout (root)
│   ├── Toaster (sonner)
│   └── Page
│       ├── Header
│       ├── SalesTable
│       │   ├── SearchBar
│       │   ├── DataTable
│       │   ├── Pagination
│       │   └── SalesTableSkeleton
│       ├── DatFileUpload (modal)
│       └── DatPreviewModal (modal)
```

## Componentes Customizados

### 1. SalesTable (`src/components/custom/sales-table.tsx`)

**Propósito**: Componente principal para visualização e gerenciamento de dados de vendas.

**Props**:
```typescript
interface SalesTableProps {
  onDataUploaded: () => void;  // Callback para upload de dados
}
```

**Estado Interno**:
```typescript
const [data, setData] = useState<SaleData[]>([]);
const [loading, setLoading] = useState(false);
const [searchTerm, setSearchTerm] = useState("");
const [currentPage, setCurrentPage] = useState(0);
const [itemsPerPage, setItemsPerPage] = useState(10);
const [totalPages, setTotalPages] = useState(0);
const [totalElements, setTotalElements] = useState(0);
const [sortConfig, setSortConfig] = useState<SortConfig>({
  field: "id",
  direction: "asc"
});
```

**Funcionalidades**:
- ✅ Paginação server-side
- ✅ Busca em tempo real com debounce
- ✅ Ordenação por colunas
- ✅ Loading states com skeleton
- ✅ Animações GSAP
- ✅ Toast notifications
- ✅ Responsividade completa

**Hooks Utilizados**:
```typescript
import { useState, useEffect, useCallback, useRef } from "react";
import { animations } from "@/hooks/use-gsap";
import { useAnimatedToast } from "@/hooks/use-animated-toast";
```

**Animações**:
- **Card Principal**: `fadeIn` na montagem
- **Barra de Busca**: `slideInLeft` com delay
- **Botões**: `bounce` no click
- **Linhas da Tabela**: `staggerFadeIn` quando dados carregam

**Métodos Principais**:
```typescript
// Busca paginada de dados
const fetchSalesData = async (page = 0, size = 10, sortBy = "id", sortDir = "asc")

// Busca por termo
const searchSalesData = async (term: string)

// Ordenação local
const handleSort = (field: SortField)

// Navegação de páginas
const handlePageChange = (page: number)
```

### 2. DatFileUpload (`src/components/custom/dat-file-upload.tsx`)

**Propósito**: Modal para upload e processamento de arquivos .dat.

**Props**:
```typescript
interface DatFileUploadProps {
  onFileProcessed: () => void;     // Callback após processamento
  onClose: () => void;             // Callback para fechar modal
}
```

**Estado Interno**:
```typescript
const [selectedFile, setSelectedFile] = useState<File | null>(null);
const [isProcessing, setIsProcessing] = useState(false);
const [error, setError] = useState<string | null>(null);
const [isDragOver, setIsDragOver] = useState(false);
```

**Funcionalidades**:
- ✅ Drag & drop de arquivos
- ✅ Validação de formato .dat
- ✅ Preview do arquivo selecionado
- ✅ Processamento assíncrono
- ✅ Feedback visual de loading
- ✅ Tratamento de erros
- ✅ Animações de entrada/saída

**Validações**:
```typescript
const validateFile = (file: File) => {
  if (!file.name.endsWith('.dat')) {
    throw new Error('Apenas arquivos .dat são aceitos');
  }
  if (file.size > 10 * 1024 * 1024) { // 10MB
    throw new Error('Arquivo muito grande (máximo 10MB)');
  }
  if (file.size === 0) {
    throw new Error('Arquivo vazio');
  }
};
```

**Animações**:
- **Modal**: `scaleIn` na abertura
- **Botões**: `bounce` no click
- **Erro**: `shake` em validações falhadas

### 3. DatPreviewModal (`src/components/custom/dat-preview-modal.tsx`)

**Propósito**: Modal para preview e confirmação dos dados processados do arquivo .dat.

**Props**:
```typescript
interface DatPreviewModalProps {
  data: SaleData[];                // Dados processados para exibição
  originalData: ItemRequestBody[]; // Dados originais para envio à API
  filename: string;                // Nome do arquivo
  onConfirm: () => void;          // Callback de confirmação
  onCancel: () => void;           // Callback de cancelamento
}
```

**Funcionalidades**:
- ✅ Tabela scrollável com dados
- ✅ Resumo estatístico (total vendas, itens, valor)
- ✅ Confirmação com loading state
- ✅ Cancelamento com confirmação
- ✅ Envio para API backend
- ✅ Feedback de sucesso/erro

**Resumo Estatístico**:
```typescript
const totalValue = data.reduce((sum, sale) => sum + sale.totalValue, 0);
const totalQuantity = data.reduce((sum, sale) => sum + sale.quantity, 0);
const totalSales = data.length;
```

**Animações**:
- **Modal**: `scaleIn` na entrada
- **Linhas da Tabela**: `staggerFadeIn` com delay
- **Botões**: `bounce` no click
- **Saída**: `fadeOut` ao cancelar

### 4. SalesTableSkeleton (`src/components/custom/sales-table-skeleton.tsx`)

**Propósito**: Loading state visual para a tabela de vendas.

**Características**:
- ✅ Imita estrutura da tabela real
- ✅ Animação de pulse automática
- ✅ Número configurável de linhas
- ✅ Responsivo
- ✅ Consistente com design system

```typescript
interface SalesTableSkeletonProps {
  rows?: number; // Número de linhas skeleton (default: 5)
}
```

## Componentes shadcn/ui Utilizados

### Layout e Estrutura
- **Card**: Container principal para seções
- **Table**: Tabelas de dados
- **ScrollArea**: Áreas com scroll customizado
- **Separator**: Divisores visuais

### Formulários e Inputs
- **Button**: Botões com variantes (default, outline, ghost)
- **Input**: Campos de texto
- **Label**: Rótulos de formulário

### Feedback e Estados
- **Alert**: Mensagens de alerta
- **Skeleton**: Loading states
- **Progress**: Barras de progresso (futuro)

### Navegação
- **Pagination**: Controles de paginação (customizado)

### Overlays
- **Dialog**: Base para modais (não usado diretamente)
- **Sheet**: Painéis laterais (futuro)

## Padrões de Design

### 1. Composição de Componentes
```typescript
// Exemplo: SalesTable composto por múltiplos componentes
<Card>
  <CardHeader>
    <SearchBar />
  </CardHeader>
  <CardContent>
    <DataTable />
    <Pagination />
  </CardContent>
</Card>
```

### 2. Props Drilling Controlado
```typescript
// Evita props drilling excessivo usando callbacks
interface ComponentProps {
  onAction: () => void;  // Callback simples
  data: DataType[];       // Dados necessários
  config: ConfigType;     // Configurações
}
```

### 3. Estado Colocado (Co-located State)
```typescript
// Estado próximo ao componente que o utiliza
const SalesTable = () => {
  const [localState, setLocalState] = useState();
  // ... lógica específica do componente
};
```

### 4. Hooks Customizados
```typescript
// Lógica reutilizável extraída em hooks
const useAnimatedToast = () => {
  // ... lógica de toast com animações
};

const useGSAP = () => {
  // ... lógica de animações
};
```

## Sistema de Animações

### Configuração GSAP
```typescript
// Hook principal de animações
export const animations = {
  fadeIn: (element, delay = 0) => gsap.fromTo(element, ...),
  bounce: (element) => gsap.fromTo(element, ...),
  staggerFadeIn: (elements, delay = 0) => gsap.fromTo(elements, ...),
  // ... outras animações
};
```

### Aplicação em Componentes
```typescript
// Ref para elemento DOM
const cardRef = useRef<HTMLDivElement>(null);

// Animação na montagem
useEffect(() => {
  if (cardRef.current) {
    animations.fadeIn(cardRef.current, 0);
  }
}, []);

// Animação em interação
const handleClick = (e) => {
  animations.bounce(e.currentTarget);
  // ... lógica adicional
};
```

## Sistema de Toasts

### Hook Customizado
```typescript
const useAnimatedToast = () => {
  const toast = (message: string, type: 'success' | 'error' | 'info') => {
    // ... implementação com Sonner
  };
  
  return {
    success: (message: string) => toast(message, 'success'),
    error: (message: string) => toast(message, 'error'),
    info: (message: string) => toast(message, 'info'),
  };
};
```

### Uso nos Componentes
```typescript
const toast = useAnimatedToast();

// Feedback de sucesso
toast.success('Dados carregados com sucesso!');

// Feedback de erro
toast.error('Erro ao carregar dados');
```

## Responsividade

### Breakpoints Utilizados
```css
/* Tailwind CSS breakpoints */
sm: 640px   /* Tablets */
md: 768px   /* Tablets grandes */
lg: 1024px  /* Desktops */
xl: 1280px  /* Desktops grandes */
```

### Padrões Responsivos
```typescript
// Classes Tailwind para responsividade
className="
  grid grid-cols-1        // Mobile: 1 coluna
  md:grid-cols-2          // Tablet: 2 colunas
  lg:grid-cols-3          // Desktop: 3 colunas
  gap-4                   // Espaçamento consistente
"
```

## Acessibilidade

### ARIA Labels
```typescript
<Button 
  aria-label="Carregar arquivo de dados"
  onClick={handleUpload}
>
  Upload
</Button>
```

### Navegação por Teclado
- ✅ Tab order lógico
- ✅ Enter/Space em botões
- ✅ Escape fecha modais
- ✅ Arrow keys em tabelas (futuro)

### Screen Readers
- ✅ Semantic HTML
- ✅ ARIA roles apropriados
- ✅ Descrições de loading states
- ✅ Anúncios de mudanças de estado

## Performance

### Otimizações Implementadas
- ✅ React.memo para componentes puros
- ✅ useMemo para cálculos custosos
- ✅ useCallback para funções estáveis
- ✅ Lazy loading de imagens
- ✅ Debounce em busca

### Métricas de Performance
```typescript
// Exemplo de medição
const startTime = performance.now();
await fetchData();
const endTime = performance.now();
console.log(`Fetch took ${endTime - startTime} ms`);
```

## Testes (Planejado)

### Testes Unitários
```typescript
// Exemplo com Jest + Testing Library
describe('SalesTable', () => {
  test('should render sales data', () => {
    render(<SalesTable onDataUploaded={() => {}} />);
    expect(screen.getByText('Vendas')).toBeInTheDocument();
  });
});
```

### Testes de Integração
```typescript
// Exemplo de teste de upload
test('should upload and preview dat file', async () => {
  const file = new File(['data'], 'test.dat', { type: 'text/plain' });
  // ... implementação do teste
});
```

## Próximas Implementações

- [ ] Componente de gráficos (Chart.js)
- [ ] Filtros avançados
- [ ] Exportação de dados
- [ ] Modo escuro completo
- [ ] Temas customizáveis
- [ ] Componentes de formulário avançados
- [ ] Sistema de notificações em tempo real