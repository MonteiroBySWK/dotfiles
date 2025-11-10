Conventions

This file documents naming and layout conventions used across the project. Follow these rules when adding or changing code.

Naming

- Components and component folders: PascalCase
  - Example: `AsciiBackground/AsciiBackground.tsx`, `HeroTitle/HeroTitle.tsx`
- Hooks: camelCase, exported with `use` prefix, kept under `src/hooks`
  - Example: `useMobile`, `useMounted`, `useCategoryRotation`
- Variables and functions: camelCase
  - Example: `mousePositionRef`, `handleMouseMove`
- Constants: camelCase or UPPER_SNAKE_CASE for environment constants
  - Example: `particleConfig`, `ANIMATION_TIMINGS`

File layout

- Each component gets its own folder (context), containing the main component file and related subcomponents when applicable.
- Barrel export in `index.tsx` inside each component folder to keep imports simple.
  - Example: `import AsciiBackground from '@/components/AsciiBackground'`

Hooks

- Keep hooks in `src/hooks/` for reuse and testability. They should not depend on UI specifics.

Coding

- Prefer small, focused components. One responsibility per file.
- Use TypeScript types and interfaces to document shapes and props.
- Keep side effects in `useEffect` and cleanup listeners.

Performance

- Limit WebGL render target size and dpr for better performance on lower-end devices.
- Avoid expensive per-frame allocations inside `useFrame`; reuse objects where possible.

Testing

- Add unit tests for hooks and critical pure functions. Visual elements can be validated via snapshot tests or Storybook stories.

# Versão em Português

# Convenções

Este documento descreve as convenções de nomenclatura e organização adotadas no projeto. Siga estas regras ao adicionar ou modificar código.

## Nomenclatura

- Componentes e pastas de componente: PascalCase
  - Exemplo: `AsciiBackground/AsciiBackground.tsx`, `HeroTitle/HeroTitle.tsx`
- Hooks: camelCase, exportados com prefixo `use`, mantidos em `src/hooks`
  - Exemplo: `useMobile`, `useMounted`, `useCategoryRotation`
- Variáveis e funções: camelCase
  - Exemplo: `mousePositionRef`, `handleMouseMove`
- Constantes: camelCase ou UPPER_SNAKE_CASE para constantes de ambiente
  - Exemplo: `particleConfig`, `ANIMATION_TIMINGS`

## Estrutura de arquivos

- Cada componente possui sua própria pasta (contexto), contendo o arquivo principal e subcomponentes relacionados quando necessários.
- Use um barrel export (`index.tsx`) dentro da pasta de componente para simplificar importações.
  - Exemplo: `import AsciiBackground from '@/components/AsciiBackground'`

## Hooks

- Centralize hooks em `src/hooks/` para reuso e testabilidade. Evite dependências diretas da UI nos hooks que devem ser reutilizáveis.

## Boas práticas de codificação

- Prefira componentes pequenos e com responsabilidade única.
- Documente shapes e props usando tipos/interfaces TypeScript.
- Coloque efeitos colaterais em `useEffect` e garanta o cleanup de listeners.

## Performance

- Limite o tamanho do render target WebGL e o `dpr` para melhorar a experiência em dispositivos mais modestos.
- Evite criar objetos a cada frame em `useFrame`; reutilize objetos (Vector3, Vector2, etc.).

## Testes

- Escreva testes unitários para hooks e funções puras críticas.
- Para validação visual, use Storybook e/ou snapshots quando apropriado.
