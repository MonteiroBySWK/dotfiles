# 📱 Otimizações para Mobile

## Implementações para Dispositivos Móveis

### 🎯 **Detecção de Dispositivos**

```typescript
const isMobile = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768 || 
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};
```

### ⚡ **Performance 3D Otimizada**

#### Canvas Settings Mobile
```typescript
<Canvas
  camera={{ position: [0, 0, 5], fov: 80 }} // FOV maior para mobile
  gl={{ 
    antialias: false,
    powerPreference: 'low-power', // Economia de bateria
    precision: 'lowp', // Menor precisão = mais FPS
  }}
  dpr={[0.5, 1]} // Redução de pixel ratio (50% - 100%)
  performance={{ min: 0.5 }} // Adaptive FPS
/>
```

#### Geometrias Simplificadas
- **Icosaedro:** `args={[2, 2]}` (era 4 subdivisões → agora 2)
- **Anéis externos:** 32 segmentos (eram 64)
- **Anéis internos:** 32 segmentos (eram 48)
- **Torus waves:** 8x50 (eram 16x100)
- **Esferas partículas:** 6x6 (eram 8x8)

#### Contagem de Elementos Reduzida
| Elemento | Desktop | Mobile |
|----------|---------|--------|
| Partículas flutuantes | 50 | 25 |
| Ondas expansivas | 3 | 2 |
| Partículas espirais | 12 | 8 |
| Ondas de frequência | 5 | 3 |
| Anel segmentado | 24 | 16 |

#### Elementos Desabilitados em Mobile
- ❌ **Wireframe Sphere** (economia de draw calls)
- ❌ **Audio Equalizer** (16 objetos + animação complexa)
- ❌ **Orbital System** (12 objetos + rotações múltiplas)
- ❌ **Deformação de vértices** nas ondas de frequência

### 🎨 **UI/UX Mobile**

#### Tipografia Responsiva
```tsx
// Tamanhos reduzidos para mobile
text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl

// Espaçamento ajustado
letterSpacing: '0.12em' // (era 0.15em)
```

#### Layout Adaptativo
- **Separador "|":** Oculto em mobile (`hidden sm:inline`)
- **Layout vertical:** `flex-col` em telas pequenas
- **Espaçamento:** Gap reduzido de 4 para 2-3
- **Padding:** Reduzido e responsivo
- **Tagline:** Letra menor e tracking reduzido

#### Animações Otimizadas
- **TranslateY:** -15px (era -20px)
- **Text shadows:** Reduzidos (30px → 20px blur)
- **Transições:** Mantidas suaves mas com menos efeitos

### 🔧 **Configurações do Sistema**

#### Meta Tags
```html
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="theme-color" content="#212121">
```

#### CSS Global Mobile
```css
* {
  -webkit-tap-highlight-color: transparent;
}

body {
  touch-action: none;
  overscroll-behavior: none;
  position: fixed;
}

canvas {
  touch-action: none;
}
```

#### Classes Tailwind
```tsx
className="touch-none select-none"
```

### 📊 **Interações**

#### Desktop
- ✅ Parallax de mouse ativo
- ✅ Hover effects
- ✅ Todas as animações complexas

#### Mobile
- ❌ Mouse tracking desabilitado
- ❌ Parallax desabilitado
- ✅ Animações automáticas mantidas
- ✅ Touch events bloqueados (melhor performance)

### 🎯 **Resultados Esperados**

#### Performance
- **FPS:** 30-60fps constante em mobile
- **Bateria:** Consumo reduzido (low-power mode)
- **Memória:** ~50% menos objetos 3D
- **Draw Calls:** Redução de ~40%

#### UX
- **Loading:** Mais rápido (geometrias simplificadas)
- **Scroll:** Bloqueado (fixed layout)
- **Zoom:** Desabilitado
- **Seleção:** Desabilitada
- **Tap highlight:** Removido

### 📱 **Breakpoints**

```css
/* Tailwind Default + Custom */
xs: 475px   /* Extra small (custom) */
sm: 640px   /* Small */
md: 768px   /* Medium */
lg: 1024px  /* Large */
xl: 1280px  /* Extra Large */
```

### 🔄 **Responsive Resize**

```typescript
useEffect(() => {
  const handleResize = () => {
    setMobile(isMobile());
  };
  
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);
```

### ⚙️ **Otimizações Técnicas**

1. **Lazy Loading:** Suspense boundaries mantidos
2. **Memoization:** useMemo para cálculos pesados
3. **Refs:** Evitando re-renders desnecessários
4. **Conditional Rendering:** Componentes removidos em mobile
5. **Lower Precision:** `lowp` shaders em mobile
6. **Adaptive Performance:** FPS dinâmico baseado em carga

### 🎨 **Qualidade Visual Mobile**

Mesmo com as otimizações, mantemos:
- ✅ Círculos pontilhados sempre visíveis
- ✅ Geometria central animada
- ✅ Partículas flutuantes (reduzidas)
- ✅ Ondas expansivas
- ✅ ASCII shader effect
- ✅ Gradientes e cores
- ✅ Animações de texto suaves

### 📈 **Comparação**

| Métrica | Desktop | Mobile |
|---------|---------|--------|
| Objetos 3D | ~120 | ~60 |
| Vértices | Alto | Médio |
| Pixel Ratio | 1-1.5x | 0.5-1x |
| Interatividade | Full | Auto |
| Poder GPU | Alto | Baixo |
| Bateria | N/A | Econômico |

## ✅ **Compatibilidade Testada**

- 📱 iOS Safari
- 🤖 Android Chrome
- 🌐 Mobile browsers modernos
- 💻 Desktop (mantém qualidade alta)
- 🖥️ Tablets (modo automático)
