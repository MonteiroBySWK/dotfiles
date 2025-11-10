# Componentes Refatorados - Padrão Compound Components

## Estrutura de Pastas

```
src/components/
├── ascii-background/
│   ├── index.tsx                    # Componente principal exportado
│   ├── scene.tsx                    # Componente Scene com toda a lógica 3D
│   ├── constants.ts                 # Constantes compartilhadas
│   ├── hooks/
│   │   └── use-mobile.ts           # Hook para detectar mobile
│   ├── shaders/
│   │   └── ascii-shader.ts         # Shader material do efeito ASCII
│   ├── geometries/
│   │   ├── outer-ring.tsx          # Anel externo animado
│   │   ├── inner-ring.tsx          # Anel interno animado
│   │   ├── wireframe-sphere.tsx    # Esfera wireframe
│   │   └── main-icosahedron.tsx    # Icosaedro principal
│   ├── particles/
│   │   └── floating-particle.tsx   # Partículas flutuantes
│   └── effects/
│       ├── ascii-effect.tsx        # Efeito ASCII post-processing
│       ├── wave-rings.tsx          # Anéis expansivos
│       ├── spiral-particles.tsx    # Partículas em espiral
│       ├── frequency-waves.tsx     # Ondas de frequência
│       └── rotating-segmented-ring.tsx # Anel segmentado rotativo
│
├── hero-title/
│   ├── index.tsx                   # Componente principal exportado
│   ├── constants.ts                # Constantes (categorias, timings)
│   ├── hooks/
│   │   ├── use-mounted.ts         # Hook para prevenir hydration errors
│   │   ├── use-mobile.ts          # Hook para detectar mobile
│   │   └── use-category-rotation.ts # Lógica de rotação de categorias
│   └── components/
│       ├── thera-logo.tsx         # Logo "thera" com estilização
│       ├── separator.tsx          # Separador "|"
│       ├── category-text.tsx      # Texto de categoria animado
│       └── tagline.tsx            # Tagline inferior
│
├── ascii-background.tsx            # Barrel export (compatibilidade)
└── hero-title.tsx                  # Barrel export (compatibilidade)
```

## Padrões Utilizados

### 1. **Compound Components Pattern**
Cada componente complexo foi quebrado em componentes menores e mais focados que trabalham juntos.

**Exemplo (ascii-background):**
```tsx
// index.tsx
<Scene />
<AsciiEffect />

// scene.tsx
<OuterRing />
<InnerRing />
<WireframeSphere />
<MainIcosahedron />
<FloatingParticle />
<WaveRings />
```

### 2. **Separation of Concerns**
- **Hooks** (`/hooks`): Lógica reutilizável e efeitos
- **Constants** (`constants.ts`): Valores hardcoded centralizados
- **Components** (`/components`, `/geometries`, `/particles`, `/effects`): UI e renderização
- **Shaders** (`/shaders`): Código GLSL e materiais customizados

### 3. **Custom Hooks**
- `use-mobile`: Detecta se é dispositivo móvel
- `use-mounted`: Previne hydration errors do SSR
- `use-category-rotation`: Gerencia estado de rotação de categorias

### 4. **Type Safety**
Todos os componentes usam TypeScript com interfaces bem definidas.

### 5. **Barrel Exports**
Arquivos `index.tsx` exportam os componentes principais, mantendo compatibilidade com imports existentes:
```tsx
// Antigo (ainda funciona)
import AsciiBackground from '@/components/ascii-background';

// Novo (também funciona)
import AsciiBackground from '@/components/ascii-background/index';
```

## Benefícios

✅ **Manutenibilidade**: Cada arquivo tem uma responsabilidade única  
✅ **Testabilidade**: Componentes menores são mais fáceis de testar  
✅ **Reutilização**: Hooks e componentes podem ser reaproveitados  
✅ **Legibilidade**: Código mais organizado e fácil de entender  
✅ **Escalabilidade**: Fácil adicionar novos efeitos/geometrias  
✅ **Performance**: Imports específicos permitem tree-shaking  

## Como Usar

### Importar componentes principais:
```tsx
import AsciiBackground from '@/components/ascii-background';
import HeroTitle from '@/components/hero-title';
```

### Usar componentes internos (se necessário):
```tsx
import { FloatingParticle } from '@/components/ascii-background/particles/floating-particle';
import { useMobile } from '@/components/ascii-background/hooks/use-mobile';
```

### Modificar constantes:
```tsx
// ascii-background/constants.ts
export const PARTICLE_CONFIG = {
  mobile: {
    count: 80,    // Altere aqui
    opacity: 0.6,
    size: 0.03,
  },
  // ...
}
```

## Próximos Passos

- [ ] Adicionar testes unitários para hooks
- [ ] Adicionar Storybook para documentação visual
- [ ] Criar variantes de temas
- [ ] Adicionar mais efeitos visuais modulares
- [ ] Implementar lazy loading de efeitos pesados
