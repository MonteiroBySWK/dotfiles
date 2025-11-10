# Guia do Desenvolvedor

## Onboarding

- Leia `docs/overview.md` e `docs/conventions.md`.
- Execute o projeto localmente e inspecione `src/components/AsciiBackground` e `src/components/HeroTitle`.

## Adicionando um novo componente visual

1. Adicione um novo arquivo em `src/components/AsciiBackground/` usando `PascalCase`, por exemplo `MyRing.tsx`.
2. Implemente a animação usando `useFrame` e prefira reutilizar refs e constantes compartilhadas.
3. Exporte o componente e inclua-o em `Scene.tsx`.
4. Se o componente precisar de configuração, adicione-a em `constants.ts`.

## Adicionando um novo hook

- Coloque novos hooks em `src/hooks/` e exponha APIs bem definidas e tipadas.
- Mantenha os hooks agnósticos da UI se forem destinados a reuso.

## Otimização de performance

- Use o hook `useMobile` para controlar efeitos pesados. Reduza a contagem de partículas e desative o pós-processamento para dispositivos de baixo desempenho.
- Use o Chrome DevTools (abas Performance e WebGL inspector) para detectar frames pesados.
- Reutilize geometrias e materiais em vez de recriá-los a cada frame.

## Testes

- Adicione testes unitários para funções puras e hooks. Use React Testing Library e Jest para hooks com DOM.
- Para testes visuais, use Storybook e testes de snapshot.

## Code reviews

- Verifique vazamentos de memória: garanta que listeners de `useEffect` sejam limpos.
- Revise callbacks de `useFrame` em busca de alocações. Prefira reutilização.
- Verifique a tipagem TypeScript nas APIs exportadas.
