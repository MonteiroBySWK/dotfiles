# Guia de Desenvolvimento

## Configuração do Ambiente

### Pré-requisitos

- **Node.js**: versão 18.17+ ou 20+
- **npm**: versão 9+ (incluído com Node.js)
- **Git**: para controle de versão
- **VS Code**: recomendado para desenvolvimento
- **Java**: versão 11+ (para backend)
- **PostgreSQL**: versão 12+ (para banco de dados)

### Instalação Inicial

```bash
# Clone o repositório
git clone https://github.com/MonteiroBySWK/varejo_rapido.git
cd varejo_rapido

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

### Configuração do Backend

```bash
# Backend Java Spring Boot deve estar rodando na porta 8080
# Configurar banco PostgreSQL
# Aplicar migrations necessárias
```

## Estrutura do Projeto

### Organização de Arquivos

```
varejo_rapido/
├── docs/                           # 📚 Documentação
│   ├── resumo.md                   # Visão geral do projeto
│   ├── arquitetura.md              # Arquitetura e padrões
│   ├── api.md                      # Documentação da API
│   ├── componentes.md              # Componentes React
│   └── desenvolvimento.md          # Este arquivo
├── public/                         # 🌐 Arquivos estáticos
├── src/
│   ├── app/                        # 🚀 App Router (Next.js 15)
│   │   ├── api/                    # 🔌 API Routes (Proxy)
│   │   │   ├── confirm-dat/        # Confirmação upload
│   │   │   ├── upload-dat/         # Upload arquivos
│   │   │   └── vendas/             # Endpoints vendas
│   │   ├── globals.css             # 🎨 Estilos globais
│   │   ├── layout.tsx              # 📋 Layout raiz
│   │   └── page.tsx                # 🏠 Página principal
│   ├── components/
│   │   ├── custom/                 # 🧩 Componentes específicos
│   │   └── ui/                     # 🎛️ Componentes shadcn/ui
│   ├── hooks/                      # 🪝 Hooks customizados
│   │   ├── use-gsap.ts            # Animações GSAP
│   │   ├── use-animated-toast.ts   # Toast animados
│   │   └── use-mobile.ts          # Detecção mobile
│   ├── lib/                        # 🛠️ Utilitários
│   │   ├── dat-processor.ts        # Processar arquivos .dat
│   │   ├── formatters.ts           # Formatação de dados
│   │   └── utils.ts                # Utilitários gerais
│   └── types/                      # 📝 Tipos TypeScript
├── components.json                 # ⚙️ Config shadcn/ui
├── package.json                    # 📦 Dependências
├── tailwind.config.ts              # 🎨 Config Tailwind
└── tsconfig.json                   # 📘 Config TypeScript
```

### Convenções de Nomenclatura

#### Arquivos e Pastas
```bash
# Componentes React: PascalCase
SalesTable.tsx
DatFileUpload.tsx

# Páginas: kebab-case ou PascalCase
page.tsx
layout.tsx

# Utilitários: kebab-case
dat-processor.ts
use-animated-toast.ts

# Tipos: kebab-case
sales.ts
sorting.ts

# Documentação: kebab-case
arquitetura.md
desenvolvimento.md
```

#### Código TypeScript/React
```typescript
// Interfaces: PascalCase com sufixo adequado
interface SaleData { }
interface SalesTableProps { }

// Componentes: PascalCase
const SalesTable = () => { };

// Funções: camelCase
const fetchSalesData = () => { };

// Constantes: UPPER_SNAKE_CASE ou camelCase
const API_BASE_URL = 'http://localhost:8080';
const defaultPageSize = 10;

// Variáveis: camelCase
const isLoading = false;
const currentPage = 0;
```

## Stack Tecnológica

### Core Framework
```json
{
  "next": "15.5.4",           // React framework
  "react": "19.1.0",          // UI library
  "typescript": "^5",         // Type safety
}
```

### UI e Estilização
```json
{
  "@radix-ui/react-*": "*",   // Componentes base headless
  "tailwindcss": "^4.0.0",   // Utility-first CSS
  "class-variance-authority": "*", // Variantes de componentes
  "clsx": "*",                // Conditional classes
  "tailwind-merge": "*"       // Merge Tailwind classes
}
```

### Animações e UX
```json
{
  "gsap": "*",                // Animações avançadas
  "sonner": "*",              // Toast notifications
  "lucide-react": "*"         // Ícones
}
```

### Desenvolvimento
```json
{
  "eslint": "*",              // Code linting
  "eslint-config-next": "*",  // Next.js ESLint config
  "@types/node": "*",         // Node.js types
  "@types/react": "*",        // React types
  "@types/react-dom": "*"     // React DOM types
}
```

## Padrões de Desenvolvimento

### 1. Estrutura de Componentes

```typescript
// Template padrão para componentes
'use client'; // Quando necessário (interatividade)

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { animations } from '@/hooks/use-gsap';
import { useAnimatedToast } from '@/hooks/use-animated-toast';

interface ComponentNameProps {
  // Props tipadas
  data: DataType[];
  onAction: () => void;
  config?: ConfigType; // Props opcionais
}

export function ComponentName({ data, onAction, config }: ComponentNameProps) {
  // 1. Estado local
  const [loading, setLoading] = useState(false);
  
  // 2. Refs para animações
  const elementRef = useRef<HTMLDivElement>(null);
  
  // 3. Hooks customizados
  const toast = useAnimatedToast();
  
  // 4. Efeitos
  useEffect(() => {
    if (elementRef.current) {
      animations.fadeIn(elementRef.current);
    }
  }, []);
  
  // 5. Handlers
  const handleAction = async () => {
    setLoading(true);
    try {
      await onAction();
      toast.success('Ação realizada com sucesso!');
    } catch (error) {
      toast.error('Erro ao realizar ação');
    } finally {
      setLoading(false);
    }
  };
  
  // 6. Render
  return (
    <div ref={elementRef}>
      <Button onClick={handleAction} disabled={loading}>
        {loading ? 'Carregando...' : 'Ação'}
      </Button>
    </div>
  );
}
```

### 2. Hooks Customizados

```typescript
// Template para hooks customizados
import { useState, useEffect, useCallback } from 'react';

interface UseHookNameOptions {
  // Opções tipadas
  initialValue?: any;
  onSuccess?: () => void;
}

export function useHookName(options: UseHookNameOptions = {}) {
  // Estado interno
  const [state, setState] = useState(options.initialValue);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Lógica principal
  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // ... lógica
      options.onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  }, [options]);
  
  // Retorno do hook
  return {
    state,
    loading,
    error,
    execute,
  };
}
```

### 3. API Routes

```typescript
// Template para API routes
import { NextRequest, NextResponse } from 'next/server';

// Tipos para request/response
interface RequestBody {
  // Definir estrutura esperada
}

interface ResponseBody {
  success: boolean;
  data?: any;
  error?: string;
}

export async function GET(request: NextRequest) {
  try {
    // Extrair parâmetros
    const { searchParams } = new URL(request.url);
    const param = searchParams.get('param');
    
    // Validações
    if (!param) {
      return NextResponse.json(
        { success: false, error: 'Parâmetro obrigatório' },
        { status: 400 }
      );
    }
    
    // Lógica principal
    const result = await processData(param);
    
    // Response de sucesso
    return NextResponse.json({
      success: true,
      data: result
    });
    
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: RequestBody = await request.json();
    
    // Validações do body
    // Lógica de processamento
    // Response
    
  } catch (error) {
    // Tratamento de erro
  }
}
```

## Configurações

### TypeScript (tsconfig.json)
```json
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"]    // Path mapping
    }
  }
}
```

### Tailwind CSS (tailwind.config.ts)
```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],        // Dark mode via class
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",                 // Sem prefix
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      // Extensões customizadas
      colors: {
        // Cores do tema
      },
      keyframes: {
        // Animações CSS customizadas
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
```

### ESLint (eslint.config.mjs)
```javascript
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default eslintConfig;
```

## Fluxo de Desenvolvimento

### 1. Iniciar Desenvolvimento
```bash
# Terminal 1: Frontend
npm run dev

# Terminal 2: Backend (Java)
cd ../backend
./mvnw spring-boot:run

# Terminal 3: Banco de dados
psql -U postgres -d varejo_rapido
```

### 2. Criar Nova Funcionalidade

#### a) Definir Tipos
```typescript
// src/types/nova-funcionalidade.ts
export interface NovaFuncionalidadeData {
  id: number;
  nome: string;
  // ... outros campos
}
```

#### b) Criar Componente
```typescript
// src/components/custom/nova-funcionalidade.tsx
export function NovaFuncionalidade() {
  // Implementação
}
```

#### c) Adicionar API Route (se necessário)
```typescript
// src/app/api/nova-funcionalidade/route.ts
export async function GET() {
  // Proxy para backend
}
```

#### d) Integrar na Página
```typescript
// src/app/page.tsx
import { NovaFuncionalidade } from '@/components/custom/nova-funcionalidade';

export default function Home() {
  return (
    <div>
      {/* ... outros componentes */}
      <NovaFuncionalidade />
    </div>
  );
}
```

### 3. Testes
```bash
# Lint do código
npm run lint

# Build de produção (teste)
npm run build

# Testes unitários (quando implementados)
npm run test
```

### 4. Commit
```bash
# Staged changes
git add .

# Commit com mensagem descritiva
git commit -m "feat: adicionar nova funcionalidade de X"

# Push para repositório
git push origin main
```

## Debugging

### 1. Console Logs Estruturados
```typescript
// Padrão para logs de desenvolvimento
console.log('🚀 Action started:', { param1, param2 });
console.log('✅ Action completed:', result);
console.error('❌ Action failed:', error);

// Logs específicos por contexto
console.log('📊 Data fetched:', data.length, 'items');
console.log('🔍 Search term:', searchTerm);
console.log('📄 Page change:', currentPage, '→', newPage);
```

### 2. React DevTools
- Instalar extensão React DevTools
- Usar Profiler para performance
- Inspecionar estado dos componentes

### 3. Network Tab
- Monitorar chamadas de API
- Verificar payload de requests
- Analisar tempo de resposta

### 4. GSAP DevTools (futuro)
```typescript
// Debug de animações
gsap.set('.debug-element', { 
  border: '2px solid red',
  duration: 0
});
```

## Performance

### 1. Bundle Analysis
```bash
# Analisar tamanho do bundle
npm run build
npx @next/bundle-analyzer
```

### 2. Core Web Vitals
- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1

### 3. Otimizações Implementadas
```typescript
// Lazy loading de componentes
const LazyComponent = dynamic(() => import('./Component'), {
  loading: () => <Skeleton />
});

// Memoização de componentes
const MemoizedComponent = React.memo(Component);

// Otimização de re-renders
const memoizedValue = useMemo(() => expensiveCalculation(data), [data]);
const memoizedCallback = useCallback(() => handleAction(), [dependency]);
```

## Deploy

### 1. Build de Produção
```bash
npm run build
npm run start
```

### 2. Variáveis de Ambiente
```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8080
DATABASE_URL=postgresql://...
```

### 3. Otimizações de Produção
- Minificação automática
- Tree shaking
- Image optimization
- Static generation quando possível

## Troubleshooting

### Problemas Comuns

#### 1. Erro de CORS
```typescript
// Verificar se proxy está funcionando
// src/app/api/vendas/route.ts
const response = await fetch('http://localhost:8080/vendas');
```

#### 2. Animações não funcionam
```typescript
// Verificar se refs estão sendo criados
const elementRef = useRef<HTMLDivElement>(null);

// Verificar se useEffect está executando
useEffect(() => {
  console.log('🎬 Animation useEffect:', elementRef.current);
  if (elementRef.current) {
    animations.fadeIn(elementRef.current);
  }
}, []);
```

#### 3. Estado não atualiza
```typescript
// Verificar dependências do useEffect
useEffect(() => {
  fetchData();
}, [dependency]); // ✅ Incluir todas as dependências

// Verificar se estado está sendo atualizado corretamente
const handleUpdate = (newData) => {
  console.log('🔄 Updating state:', newData);
  setData(newData);
};
```

#### 4. TypeScript Errors
```bash
# Verificar tipos
npm run type-check

# Regenerar tipos se necessário
npx tsc --noEmit
```

## Próximos Passos

### Curto Prazo
- [ ] Implementar testes unitários
- [ ] Adicionar Storybook para componentes
- [ ] Configurar CI/CD pipeline
- [ ] Otimizar performance

### Médio Prazo
- [ ] Implementar autenticação
- [ ] Adicionar dashboard com gráficos
- [ ] Sistema de notificações
- [ ] Modo offline

### Longo Prazo
- [ ] PWA (Progressive Web App)
- [ ] Internacionalização (i18n)
- [ ] Temas customizáveis
- [ ] Mobile app (React Native)