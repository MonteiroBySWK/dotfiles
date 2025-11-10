# Convenções

Este documento descreve as convenções de nomenclatura e organização adotadas no projeto. Siga estas regras ao adicionar ou modificar código.

## Nomenclatura

- **Componentes e pastas de componente**: `PascalCase`
  - Exemplo: `AsciiBackground/AsciiBackground.tsx`, `HeroTitle/HeroTitle.tsx`
- **Hooks**: `camelCase`, exportados com prefixo `use`, mantidos em `src/hooks`
  - Exemplo: `useMobile`, `useMounted`, `useCategoryRotation`
- **Variáveis e funções**: `camelCase`
  - Exemplo: `mousePositionRef`, `handleMouseMove`
- **Constantes**: `camelCase` ou `UPPER_SNAKE_CASE` para constantes de ambiente
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
