# Simplificação do globals.css

## 🎯 Objetivo

Retornar ao **padrão Shadcn** mantendo apenas as **cores REVIS** essenciais, sem utilitários customizados desnecessários.

---

## ✅ O que foi feito

### 1. Removido

- ❌ `@import "tw-animate-css"` - biblioteca externa desnecessária
- ❌ `@custom-variant dark` - configuração não essencial
- ❌ Todas as utility classes customizadas (`.bg-gradient-primary`, `.animate-slide-up`, etc.)
- ❌ Todos os keyframes customizados (`@keyframes slide-up`, `fade-in`, `scale-in`)
- ❌ Estilos extras em `@layer base` (transições, focus-visible, etc.)
- ❌ Variáveis customizadas extras (`--surface`, `--success`, `--warning`, `--info`)

### 2. Mantido (Essencial Shadcn + REVIS)

#### 2.1 Estrutura Base
```css
@import "tailwindcss";

@theme inline {
  /* Tokens de mapeamento */
}

:root {
  /* Variáveis CSS do tema */
}

.dark {
  /* Dark mode (opcional) */
}

@layer base {
  /* Estilos base mínimos */
}
```

#### 2.2 Cores REVIS Oficiais

| Token | Cor HSL | Hex Aproximado | Uso |
|-------|---------|----------------|-----|
| `--primary` | `186 75% 56%` | `#37D4E6` | Cyan - Ações principais |
| `--accent` | `355 85% 72%` | `#F37C87` | Coral - Destaques sutis |
| `--ring` | `186 75% 56%` | `#37D4E6` | Focus ring (mesma cor primary) |
| `--sidebar-primary` | `186 75% 56%` | `#37D4E6` | Sidebar itens ativos |
| `--sidebar-ring` | `186 75% 56%` | `#37D4E6` | Sidebar focus |

#### 2.3 Cores Shadcn Padrão (Mantidas)

- `--background`, `--foreground` - Fundo e texto principal
- `--card`, `--popover` - Superfícies elevadas
- `--secondary` - Botões secundários
- `--muted` - Elementos desabilitados/silenciados
- `--destructive` - Erros e ações destrutivas
- `--border`, `--input` - Bordas e inputs
- `--chart-*` - Cores de gráficos
- `--sidebar-*` - Tokens do sidebar

---

## 📊 Comparação Antes vs Depois

### Antes (complexo)
```css
@import "tailwindcss";
@import "tw-animate-css"; /* ❌ Biblioteca externa */

@custom-variant dark (&:is(.dark *)); /* ❌ Desnecessário */

:root {
  --surface: ...; /* ❌ Extra */
  --success: ...; /* ❌ Extra */
  --warning: ...; /* ❌ Extra */
  --info: ...; /* ❌ Extra */
  --primary: 186 75% 56%; /* ✅ Mantido */
  --accent: 355 85% 72%; /* ✅ Mantido */
}

/* ❌ 50+ linhas de utilities customizadas */
@layer utilities {
  .bg-gradient-primary { ... }
  .animate-slide-up { ... }
  /* ... */
}

/* ❌ 30+ linhas de keyframes */
@keyframes slide-up { ... }
@keyframes fade-in { ... }
/* ... */
```

### Depois (simplificado)
```css
@import "tailwindcss"; /* ✅ Apenas Tailwind */

@theme inline {
  /* ✅ Apenas mapeamento de tokens */
}

:root {
  --primary: 186 75% 56%; /* ✅ REVIS Cyan */
  --accent: 355 85% 72%; /* ✅ REVIS Coral */
  --ring: 186 75% 56%; /* ✅ Focus */
  /* + cores Shadcn padrão */
}

.dark {
  /* ✅ Dark mode opcional */
}

@layer base {
  /* ✅ Apenas estilos base essenciais */
  * { @apply border-border; }
  body { @apply bg-background text-foreground; }
}
```

**Redução:** ~280 linhas → ~120 linhas (**-57% de código**)

---

## 🎨 Como usar as cores

### Primary (Cyan #37D4E6)
```tsx
<Button variant="default">Ação Principal</Button>
<Badge className="bg-primary text-primary-foreground">Status</Badge>
```

### Accent (Coral #F37C87)
```tsx
<Button variant="outline" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground">
  Destaque
</Button>
```

### Animações
Use as **animações nativas do Tailwind**:
```tsx
<div className="animate-pulse">Carregando...</div>
<div className="transition-all duration-200 hover:scale-105">Hover</div>
<div className="animate-fade-in">Entrada</div> {/* Tailwind v4 */}
```

---

## ✨ Benefícios

1. **Mais leve**: -57% de código CSS
2. **Mais manutenível**: Menos código customizado = menos bugs
3. **Mais padrão**: Segue 100% a convenção Shadcn
4. **Mais flexível**: Fácil adicionar novos componentes Shadcn
5. **Mais performático**: Menos CSS para parsear e processar

---

## 🚀 Próximos Passos

### Se precisar de animações customizadas no futuro:
```tsx
// Preferir: Tailwind utilities inline
<div className="transition-all duration-300 ease-out hover:translate-y-[-2px]">

// Evitar: Classes customizadas no globals.css
<div className="animate-slide-up">
```

### Se precisar de gradientes:
```tsx
// Preferir: Inline no componente
<div className="bg-gradient-to-r from-primary to-accent">

// Evitar: Utility class global
<div className="bg-gradient-primary">
```

### Se precisar de cores extras (Success, Warning, Info):
```tsx
// Adicionar apenas quando necessário como tokens do theme
// Em tailwind.config ou diretamente inline quando usado
<div className="bg-green-500 text-white">Sucesso</div>
<div className="bg-yellow-500 text-black">Aviso</div>
<div className="bg-blue-500 text-white">Info</div>
```

---

## 📝 Conclusão

O `globals.css` agora está **alinhado com Shadcn**, mantendo apenas:
- ✅ Estrutura padrão do Shadcn/ui
- ✅ Cores oficiais REVIS (#37D4E6, #F37C87)
- ✅ Tokens essenciais para componentes Shadcn
- ✅ Suporte a dark mode (opcional)

**Resultado:** Base sólida, simples e escalável! 🎉
