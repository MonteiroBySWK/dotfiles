# Componentes Refatorados

## Convenções de Nomenclatura

### 📁 Arquivos e Componentes
- **PascalCase** para componentes e arquivos de componentes
  - ✅ `AsciiBackground.tsx`, `HeroTitle.tsx`, `FloatingParticle.tsx`
  - ❌ `ascii-background.tsx`, `hero-title.tsx`, `floating-particle.tsx`

### 🔧 Variáveis e Funções
- **camelCase** para todas as variáveis, funções e constantes não-componentes
  - ✅ `asciiShaderMaterial`, `useMobile`, `currentIndex`
  - ❌ `AsciiShaderMaterial`, `UseMobile`, `CurrentIndex`

### 📂 Estrutura de Pastas
- Pastas em **PascalCase** para contextos de componentes
- Hooks centralizados em `src/hooks` (não dentro de cada componente)
- Estrutura simplificada sem subpastas desnecessárias

## Estrutura de Pastas

```
src/
├── hooks/                          # Hooks globais reutilizáveis
│   ├── useMobile.ts               # Detecta dispositivos móveis
│   ├── useMounted.ts              # Previne hydration errors
│   └── useCategoryRotation.ts     # Lógica de rotação de categorias
│
└── components/
    ├── AsciiBackground/           # Contexto: Background 3D animado
    │   ├── index.tsx             # Barrel export
    │   ├── AsciiBackground.tsx   # Componente principal
    │   ├── Scene.tsx             # Cena 3D com todos os elementos
    │   ├── constants.ts          # Configurações e cores
    │   ├── asciiShader.ts        # Shader GLSL
    │   ├── AsciiEffect.tsx       # Post-processing effect
    │   ├── FloatingParticle.tsx  # Partículas flutuantes
    │   ├── OuterRing.tsx         # Anel externo
    │   ├── InnerRing.tsx         # Anel interno
    │   ├── WireframeSphere.tsx   # Esfera wireframe
    │   ├── MainIcosahedron.tsx   # Forma geométrica principal
    │   ├── WaveRings.tsx         # Anéis expansivos
    │   ├── SpiralParticles.tsx   # Partículas em espiral
    │   ├── FrequencyWaves.tsx    # Ondas de frequência
    │   └── RotatingSegmentedRing.tsx # Anel segmentado
    │
    ├── HeroTitle/                 # Contexto: Título hero
    │   ├── index.tsx             # Barrel export
    │   ├── HeroTitle.tsx         # Componente principal
    │   ├── constants.ts          # Categorias e timings
    │   ├── TheraLogo.tsx         # Logo "thera"
    │   ├── Separator.tsx         # Separador "|"
    │   ├── CategoryText.tsx      # Texto animado
    │   └── Tagline.tsx           # Tagline inferior
    │
    └── README.md
```

## Padrões Utilizados

### 1. **Compound Components Pattern**
Componentes complexos quebrados em componentes menores e focados.

**Exemplo (AsciiBackground):**
```tsx
// AsciiBackground.tsx
<Scene />
<AsciiEffect />

// Scene.tsx
<OuterRing />
<InnerRing />
<WireframeSphere />
<MainIcosahedron />
<FloatingParticle />
<WaveRings />
```

### 2. **Separation of Concerns**
- **Hooks** (`src/hooks/`): Lógica reutilizável global
- **Constants** (`constants.ts`): Valores hardcoded centralizados
- **Components**: UI e renderização organizados por contexto

### 3. **Custom Hooks Globais**
Todos os hooks ficam em `src/hooks/` para reuso em toda aplicação:
- `useMobile`: Detecta se é dispositivo móvel
- `useMounted`: Previne hydration errors do SSR
- `useCategoryRotation`: Gerencia rotação de categorias

### 4. **Type Safety**
Todos os componentes usam TypeScript com interfaces bem definidas.

### 5. **Barrel Exports**
Cada pasta de componente tem um `index.tsx` que exporta o componente principal:
```tsx
// src/components/AsciiBackground/index.tsx
export { default } from './AsciiBackground';
```

## Como Usar

### Importar componentes principais:
```tsx
import AsciiBackground from '@/components/AsciiBackground';
import HeroTitle from '@/components/HeroTitle';
```

### Usar hooks globais:
```tsx
import { useMobile } from '@/hooks/useMobile';
import { useMounted } from '@/hooks/useMounted';
import { useCategoryRotation } from '@/hooks/useCategoryRotation';
```

### Usar componentes internos (se necessário):
```tsx
import { FloatingParticle } from '@/components/AsciiBackground/FloatingParticle';
import { TheraLogo } from '@/components/HeroTitle/TheraLogo';
```

### Modificar constantes:
```tsx
// AsciiBackground/constants.ts
export const PARTICLE_CONFIG = {
  mobile: {
    count: 80,    // Altere aqui
    opacity: 0.6,
    size: 0.03,
  },
  // ...
}
```

## Benefícios

✅ **Manutenibilidade**: Cada arquivo tem responsabilidade única  
✅ **Testabilidade**: Componentes menores são mais fáceis de testar  
✅ **Reutilização**: Hooks globais podem ser usados em qualquer lugar  
✅ **Legibilidade**: Código organizado com nomenclatura consistente  
✅ **Escalabilidade**: Fácil adicionar novos componentes/efeitos  
✅ **Performance**: Imports específicos permitem tree-shaking  
✅ **Consistência**: PascalCase para componentes, camelCase para o resto  

## Convenções do Projeto

### Nomenclatura
- ✅ Componentes: `PascalCase` (AsciiBackground, TheraLogo)
- ✅ Hooks: `camelCase` com prefixo `use` (useMobile, useMounted)
- ✅ Variáveis/Funções: `camelCase` (mousePosition, handleClick)
- ✅ Constantes: `camelCase` ou `UPPER_SNAKE_CASE` (asciiShaderMaterial, COLORS)
- ✅ Pastas: `PascalCase` (AsciiBackground, HeroTitle)

### Estrutura
- ✅ Hooks globais em `src/hooks/`
- ✅ Cada componente em sua própria pasta
- ✅ Componentes relacionados agrupados por contexto
- ❌ Subpastas desnecessárias (geometries/, effects/, particles/)
- ✅ Estrutura plana dentro do contexto do componente

## Próximos Passos

- [ ] Adicionar testes unitários para hooks e componentes
- [ ] Adicionar Storybook para documentação visual
- [ ] Criar variantes de temas
- [ ] Adicionar mais efeitos visuais modulares
- [ ] Implementar lazy loading de efeitos pesados
