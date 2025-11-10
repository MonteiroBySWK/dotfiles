Project overview

This repository contains the frontend for Thera Lab's landing/hero experience built with Next.js (App Router) and React Three Fiber. The project focuses on a performant animated 3D background and a compact hero component.

Key technologies

- Next.js (App Router)
- React (functional components, hooks)
- React Three Fiber (three.js integration)
- three.js for low-level geometry and shaders
- TypeScript for types
- Tailwind CSS for layout and utilities

# Versão em Português

Visão geral do projeto

Este repositório contém o front-end da experiência de landing/hero do Thera Lab, construído com Next.js (App Router) e React Three Fiber. O foco do projeto é entregar um background 3D animado com bom desempenho e um componente de hero enxuto.

Principais tecnologias

- Next.js (App Router)
- React (componentes funcionais e hooks)
- React Three Fiber (integração com three.js)
- three.js (geometrias e shaders de baixo nível)
- TypeScript (tipagem)
- Tailwind CSS (estilos utilitários)

Objetivos

- Entregar um hero visualmente marcante, mas com desempenho aceitável.
- Manter animações suaves em dispositivos móveis reduzindo detalhes e desativando rastreamento do ponteiro.
- Preservar uma estrutura modular e clara para facilitar manutenção e extensão.

Conteúdo do repositório

- `src/components/AsciiBackground/` — cena 3D e efeitos (componente AsciiBackground)
- `src/components/HeroTitle/` — título/hero, rotação de categorias e pequenos elementos de UI
- `src/hooks/` — hooks reutilizáveis usados pelos componentes
- `public/` — ativos estáticos, incluindo `favicon.svg`
- `src/app/` — rotas e layout do Next.js

Público-alvo

- Engenheiros de frontend que trabalham com sistemas de design e UIs com bastante animação.
- Profissionais com experiência em React e three.js.

Limitações e restrições

- O shader de pós-processamento ASCII é intensivo para GPU; mantenha `dpr` e `antialias` conservadores em mobile.
- Muitos efeitos são desativados em dispositivos móveis para preservar desempenho.

Goals

- Provide a striking but performant hero with 3D visuals
- Keep animations smooth on mobile by reducing detail and disabling mouse tracking
- Maintain clear, modular component structure to ease maintenance and extension


Contents of the repository

- `src/components/AsciiBackground/` - 3D scene and effects (AsciiBackground component)
- `src/components/HeroTitle/` - hero text, category rotation and small UI pieces
- `src/hooks/` - global hooks used across components
- `public/` - static assets, including `favicon.svg`
- `src/app/` - Next.js app routes and layout

Intended audience

- Frontend engineers working on design systems and animation-heavy UI
- Engineers familiar with React and three.js

Limitations and constraints

- Post-processing ASCII shader is GPU-intensive; keep dpr and antialias settings conservative for mobile.
- Many effects are toggled off on mobile to maintain performance.
