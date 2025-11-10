# Visão geral do projeto

Este repositório contém o front-end da experiência de landing/hero do Thera Lab, construído com Next.js (App Router) e React Three Fiber. O foco do projeto é entregar um background 3D animado com bom desempenho e um componente de hero enxuto.

## Principais tecnologias

- Next.js (App Router)
- React (componentes funcionais e hooks)
- React Three Fiber (integração com three.js)
- three.js (geometrias e shaders de baixo nível)
- TypeScript (tipagem)
- Tailwind CSS (estilos utilitários)

## Objetivos

- Entregar um hero visualmente marcante, mas com desempenho aceitável.
- Manter animações suaves em dispositivos móveis reduzindo detalhes e desativando rastreamento do ponteiro.
- Preservar uma estrutura modular e clara para facilitar manutenção e extensão.

## Conteúdo do repositório

- `src/components/AsciiBackground/` — cena 3D e efeitos (componente AsciiBackground)
- `src/components/HeroTitle/` — título/hero, rotação de categorias e pequenos elementos de UI
- `src/hooks/` — hooks reutilizáveis usados pelos componentes
- `public/` — ativos estáticos, incluindo `favicon.svg`
- `src/app/` — rotas e layout do Next.js

## Público-alvo

- Engenheiros de frontend que trabalham com sistemas de design e UIs com bastante animação.
- Profissionais com experiência em React e three.js.

## Limitações e restrições

- O shader de pós-processamento ASCII é intensivo para GPU; mantenha `dpr` e `antialias` conservadores em mobile.
- Muitos efeitos são desativados em dispositivos móveis para preservar desempenho.
