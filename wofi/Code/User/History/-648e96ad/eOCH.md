# Como funciona

Pipeline de renderização

1. A página do Next.js monta o aplicativo. `AsciiBackground` é um componente cliente que monta um `Canvas` do R3F.
2. O componente `Scene` constrói o grafo de cena e registra animações por frame via `useFrame` para os componentes que precisam.
3. A cena é renderizada em um `WebGLRenderTarget`. Em seguida, `AsciiEffect` lê essa textura e executa um pass full-screen com um shader que mapeia blocos de pixels para saída estilo ASCII.

Interações com o mouse

- As coordenadas do ponteiro são normalizadas e armazenadas em refs. No desktop, essas refs são interpoladas (`lerp`) em `useFrame` para movimento mais suave.
- Em mobile, o handler do ponteiro é desativado e valores dependentes do mouse são zerados.

Rotação de categorias

- `useCategoryRotation` expõe `currentIndex`, `nextIndex`, `isAnimating` e dois refs (`currentRef`, `nextRef`) usados para medir larguras dos textos. A sequência de rotação usa timeouts para coordenar fade out, ajuste de largura e troca de texto.

Shaders

- O shader ASCII amostra a textura renderizada em resolução reduzida para criar o efeito de caracteres em blocos, converte para escala de cinza e seleciona um bitmask que representa o caractere ASCII.
- Uniforms do shader: `tDiffuse`, `resolution`, `uTime`, `uMouse`.

Billboarding

- Grupos usados para overlays circulares copiam o quaternion da câmera para manter os elementos virados para a câmera e evitar distorção.

Riscos comuns

- Evite alocar objetos dentro dos loops `useFrame`. Reutilize `THREE.Vector3`/`Vector2` e buffers de geometria.
- Ao alterar atributos de geometria (positions), marque `needsUpdate = true` no atributo.
