# Thera Software House - Landing Page

Este é o site de apresentação da Thera Software House, uma landing page interativa e visualmente impressionante.

## Estrutura do Projeto

O projeto foi organizado em componentes e hooks reutilizáveis:

### Componentes

- **AsciiArt/Ascii3DScene**: Renderiza uma cena 3D em tempo real convertida para arte ASCII
- **Terminal/Terminal**: Simula um terminal interativo com comandos e sequência de boot
- **Background/MouseTrackingBackground**: Efeitos de gradiente que seguem o movimento do mouse
- **Background/BackgroundEffects**: Efeitos de fundo como estrelas e ruído digital

### Hooks

- **useMousePosition**: Controla a posição do mouse com debounce para evitar muitas renderizações
- **useTerminalCommands**: Gerencia comandos do terminal e histórico
- **useBootSequence**: Controla a sequência de inicialização do terminal
- **use3DAsciiScene**: (Placeholder) Para encapsular a lógica de renderização 3D ASCII

### Página Principal

O componente `Home` na raiz do aplicativo (`app/page.tsx`) compõe todos esses elementos para criar a experiência completa.

## Comandos do Terminal

O terminal aceita os seguintes comandos:

- `help`: Mostra comandos disponíveis
- `version`: Exibe a versão do sistema
- `status`: Mostra o status atual dos sistemas
- `clear`: Limpa o terminal
- `projects`: Lista os projetos atuais
- `logo`: Exibe o logo ASCII da Thera

## Efeitos Visuais

- Cena 3D renderizada em ASCII art com rotação
- Terminal com efeitos de CRT e scanlines
- Efeitos de fundo que reagem ao movimento do mouse
- Animações de título e brilho

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) for font optimization.

## Tecnologias

- Next.js
- React com Hooks
- TypeScript
- Canvas API para renderização 3D
- Tailwind CSS para estilização
