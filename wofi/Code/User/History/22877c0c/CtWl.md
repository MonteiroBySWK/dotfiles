# Thera | Software House

## 🎨 Projeto de Arte 3D Interativa

Uma experiência visual impressionante combinando **Three.js**, **ASCII Art** e **Next.js** para criar um showcase performático e artístico.

### ✨ Características

- **Background 3D Interativo**: Cena 3D animada com geometria icosaédrica e partículas flutuantes
- **Efeito ASCII Art**: Shader personalizado que converte renderização 3D em arte ASCII
- **Interações de Mouse**: Parallax suave e distorções responsivas ao movimento do cursor
- **Paleta de Cores Customizada**:
  - Primária (Violeta): `#8937E6`
  - Secundária (Azul Ciano): `#0069CC`
  - Background: `#212121`
  - Texto: `#F7F7F7`
- **Tipografia**: 
  - **Geist Mono** para "Thera" (estilo técnico com letter-spacing aumentado)
  - **Geist Sans** para "Software House" (limpo e moderno)
- **Performance Otimizada**: 
  - Suspense boundaries
  - DPR limitado
  - Antialias desabilitado para melhor desempenho com ASCII
  - Renderização client-side eficiente

### 🚀 Tecnologias

- **Next.js 15** com App Router
- **React Three Fiber** (@react-three/fiber)
- **Three.js** para renderização 3D
- **Tailwind CSS v4** para estilização
- **TypeScript** para type safety

### 📂 Estrutura de Componentes

```
src/
├── app/
│   ├── layout.tsx          # Layout raiz com fontes Geist
│   ├── page.tsx            # Página inicial
│   ├── not-found.tsx       # Página 404
│   └── globals.css         # Estilos globais e variáveis CSS
└── components/
    ├── ascii-background.tsx # Background 3D com efeito ASCII
    └── hero-title.tsx       # Título principal centralizado
```

### 🎯 Componentes Principais

#### `<AsciiBackground />`
Renderiza uma cena 3D com:
- Geometria icosaédrica animada
- 50 partículas flutuantes
- Shader customizado de ASCII art
- Iluminação dinâmica com cores da paleta
- Interação responsiva ao mouse

#### `<HeroTitle />`
Exibe o título principal com:
- Animação de entrada suave
- Tipografia diferenciada para cada segmento
- Efeitos de sombra e brilho (glow)
- Gradientes aplicados ao texto
- Responsividade completa

### 🎨 Customização

As variáveis CSS globais podem ser ajustadas em `src/app/globals.css`:

```css
:root {
  --color-primary: hsla(268, 78%, 56%, 1);
  --color-secondary: hsla(209, 100%, 40%, 1);
  --color-background: hsla(0, 0%, 13%, 1);
  --color-text: hsla(0, 0%, 97%, 1);
}
```

### 🏃 Como Executar

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Executar produção
npm start
```

### 📱 Responsividade

O layout é totalmente responsivo com breakpoints:
- Mobile: texto menor, layout em coluna
- Tablet/Desktop: texto maior, layout em linha
- Interações otimizadas para touch e mouse

### ⚡ Performance

- Lazy loading com Suspense
- Limite de DPR para dispositivos de alta resolução
- Antialiasing desabilitado (não necessário com ASCII)
- Smooth lerp para animações de mouse
- Renderização otimizada com Three.js

### 🎬 Efeitos Visuais

- **Rotação contínua** da geometria 3D
- **Pulsação suave** (escala animada)
- **Parallax de mouse** com suavização
- **Partículas em movimento** orbital
- **Gradientes dinâmicos** no shader ASCII
- **Glow effects** no texto

---

**Desenvolvido com 💜 por Thera**
