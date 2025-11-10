# Sistema de Estilização

## Tailwind CSS - Framework Principal

### Configuração Base (`tailwind.config.ts`)

```typescript
import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config
```

## Sistema de Cores

### Variáveis CSS (`globals.css`)

```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96%;
    --secondary-foreground: 222.2 84% 4.9%;
    --muted: 210 40% 96%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96%;
    --accent-foreground: 222.2 84% 4.9%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 221.2 83.2% 53.3%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 222.2 84% 4.9%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 224.3 76.3% 94.1%;
  }
}
```

### Paleta de Cores do Projeto

```tsx
// Cores semânticas
const colors = {
  // Status de projetos
  status: {
    planning: 'bg-blue-500 text-white',
    active: 'bg-green-500 text-white',
    paused: 'bg-yellow-500 text-black',
    completed: 'bg-gray-500 text-white',
    cancelled: 'bg-red-500 text-white'
  },
  
  // Prioridades
  priority: {
    low: 'bg-green-100 text-green-800 border-green-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    high: 'bg-orange-100 text-orange-800 border-orange-200',
    urgent: 'bg-red-100 text-red-800 border-red-200'
  },
  
  // Notificações
  notification: {
    success: 'border-green-200 bg-green-50 text-green-800',
    error: 'border-red-200 bg-red-50 text-red-800',
    warning: 'border-yellow-200 bg-yellow-50 text-yellow-800',
    info: 'border-blue-200 bg-blue-50 text-blue-800'
  }
}
```

## Utilitário CN (Class Names)

### Função de Merge (`lib/utils.ts`)

```typescript
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

### Uso Prático

```tsx
// Merging condicional
<div className={cn(
  "base-classes p-4 rounded",
  isActive && "bg-primary text-primary-foreground",
  isDisabled && "opacity-50 cursor-not-allowed",
  className
)} />

// Variants com CVA (Class Variance Authority)
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)
```

## Responsividade

### Breakpoints Padrão

```css
/* Tailwind breakpoints */
sm: 640px   /* Tablet pequeno */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop pequeno */
xl: 1280px  /* Desktop */
2xl: 1536px /* Desktop grande */
```

### Grid Responsivo

```tsx
// Layout de cards responsivo
<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
  {items.map(item => <Card key={item.id} />)}
</div>

// Sidebar responsiva
<div className="hidden lg:flex lg:w-64 lg:flex-col">
  <Sidebar />
</div>

// Container responsivo
<div className="container mx-auto px-4 sm:px-6 lg:px-8">
  <Content />
</div>
```

### Tipografia Responsiva

```tsx
<h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
  Título Responsivo
</h1>

<p className="text-sm md:text-base lg:text-lg text-muted-foreground">
  Texto que escala com o viewport
</p>
```

## Componentes Estilizados

### Button Variants

```tsx
// src/components/ui/button.tsx
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      />
    )
  }
)

// Uso
<Button variant="outline" size="sm">Clique</Button>
<Button variant="destructive">Deletar</Button>
```

### Card System

```tsx
// Estrutura de card consistente
<Card className="hover:shadow-lg transition-shadow">
  <CardHeader>
    <CardTitle>Título</CardTitle>
    <CardDescription>Descrição</CardDescription>
  </CardHeader>
  <CardContent>
    Conteúdo principal
  </CardContent>
  <CardFooter>
    <Button>Ação</Button>
  </CardFooter>
</Card>
```

### Badge System

```tsx
// Status badges
<Badge variant="default">Padrão</Badge>
<Badge variant="secondary">Secundário</Badge>
<Badge variant="destructive">Destrutivo</Badge>
<Badge variant="outline">Outline</Badge>

// Custom badges
<Badge className="bg-green-500 text-white">Ativo</Badge>
<Badge className="bg-yellow-500 text-black">Pendente</Badge>
```

## Animações e Transições

### Classes de Transição

```css
/* Transições padrão */
.transition-smooth {
  @apply transition-all duration-200 ease-in-out;
}

.transition-slow {
  @apply transition-all duration-500 ease-in-out;
}

/* Hover effects */
.hover-lift {
  @apply hover:transform hover:-translate-y-1 hover:shadow-lg transition-all duration-200;
}

.hover-scale {
  @apply hover:scale-105 transition-transform duration-200;
}
```

### Loading States

```tsx
// Skeleton loading
<div className="animate-pulse">
  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
</div>

// Spinner
<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
```

### Custom Animations

```tsx
// Fade in animation
<div className="opacity-0 animate-fadeIn">
  Conteúdo que aparece
</div>

// Slide in animation
<div className="transform translate-x-full animate-slideInLeft">
  Conteúdo que desliza
</div>
```

## Dark Mode

### Theme Provider

```tsx
// src/components/theme-provider.tsx
"use client"

import { createContext, useContext, useEffect, useState } from "react"

type Theme = "dark" | "light" | "system"

const ThemeContext = createContext<{
  theme: Theme
  setTheme: (theme: Theme) => void
}>({
  theme: "system",
  setTheme: () => null,
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("system")

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove("light", "dark")

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches ? "dark" : "light"
      root.classList.add(systemTheme)
    } else {
      root.classList.add(theme)
    }
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
```

### Theme Toggle

```tsx
const ThemeToggle = () => {
  const { theme, setTheme } = useTheme()
  
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  )
}
```

## Performance e Otimização

### Purge CSS

```javascript
// tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  // Apenas classes utilizadas serão incluídas no bundle final
}
```

### Critical CSS

```tsx
// Carregamento de estilos críticos
import '../styles/critical.css'

// Lazy loading de estilos não críticos
import dynamic from 'next/dynamic'

const NonCriticalStyles = dynamic(() => import('../styles/non-critical.css'), {
  ssr: false
})
```

### Bundle Splitting

```css
/* Base styles */
@layer base {
  /* Estilos fundamentais */
}

/* Component styles */
@layer components {
  /* Componentes reutilizáveis */
}

/* Utility styles */
@layer utilities {
  /* Utilitários específicos */
}
```

## Conventions e Boas Práticas

### Naming Conventions

```tsx
// ✅ Boas práticas
const Card = ({ className, ...props }) => (
  <div className={cn("card-base", className)} {...props} />
)

// Classes semânticas
<div className="project-card project-card--active">
<div className="user-avatar user-avatar--large">

// ❌ Evitar
<div className="div1 red-bg big-text">
```

### Composition over Inheritance

```tsx
// ✅ Composição
<Card>
  <CardHeader>
    <CardTitle>Título</CardTitle>
  </CardHeader>
  <CardContent>
    Conteúdo
  </CardContent>
</Card>

// ❌ Props excessivas
<Card 
  title="Título"
  content="Conteúdo"
  showHeader={true}
  headerStyle="bold"
/>
```

### Responsive First

```tsx
// ✅ Mobile first
<div className="text-sm md:text-base lg:text-lg">

// ❌ Desktop first
<div className="text-lg lg:text-lg md:text-base sm:text-sm">
```

### Consistent Spacing

```tsx
// Sistema de espaçamento consistente
const spacing = {
  xs: 'p-1',    // 4px
  sm: 'p-2',    // 8px
  md: 'p-4',    // 16px
  lg: 'p-6',    // 24px
  xl: 'p-8',    // 32px
}

// Uso
<div className="space-y-4">  {/* 16px entre elementos */}
  <div className="p-6">      {/* 24px padding */}
    <div className="mb-4">   {/* 16px margin bottom */}
```
