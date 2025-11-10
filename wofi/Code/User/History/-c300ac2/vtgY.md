# Como funciona

## Pipeline de renderização

1. O App Next.js monta a página. `AsciiBackground` é um componente cliente que renderiza um `Canvas` do R3F.
2. O componente `Scene` constrói o grafo da cena e registra animações por frame via `useFrame` para os componentes que necessitam.
3. Após a cena ser renderizada para um `WebGLRenderTarget`, o `AsciiEffect` lê essa textura e executa um passe de renderização em um quad full-screen com um shader que mapeia blocos de pixels para uma saída no estilo ASCII.

## Interações com o mouse

- As coordenadas do mouse são normalizadas e armazenadas em refs. No desktop, essas refs são interpoladas (lerp) em `useFrame` para produzir um movimento mais suave.
- Em dispositivos móveis, o handler do mouse é desativado e os valores de influência dependentes do mouse são zerados.

## Rotação de categorias

- O hook `useCategoryRotation` expõe `currentIndex`, `nextIndex`, `isAnimating`, e duas refs (`currentRef`, `nextRef`) usadas para medir a largura do texto. A sequência de rotação usa timeouts para coordenar o fade out, ajuste de largura e troca de texto.

## Shaders

- O shader ASCII amostra a textura renderizada em uma resolução reduzida para criar um efeito de caracteres em blocos, converte para escala de cinza e seleciona uma bitmask que representa o caractere ASCII.
- Uniforms do shader: `tDiffuse`, `resolution`, `uTime`, `uMouse`.

## Billboarding

- Grupos usados para sobreposições circulares copiam o quaternion da câmera para manter os elementos sempre de frente para ela, evitando distorção.

## Armadilhas comuns

- Evite alocar novos objetos dentro de loops `useFrame`. Reutilize `THREE.Vector3`/`Vector2` e buffers de geometria sempre que possível.
- Alterar atributos de geometria (como posições) exige que `needsUpdate = true` seja definido no atributo.
