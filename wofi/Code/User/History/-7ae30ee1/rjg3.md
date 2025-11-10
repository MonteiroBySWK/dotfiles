# Arquitetura de Componentes

## Organização de Componentes

### `/src/components/ui/` - Componentes shadcn/ui
Componentes base do sistema de design, fornecidos pela biblioteca shadcn/ui:

- **Button**: Botões com variantes e tamanhos
- **Card**: Containers para conteúdo
- **Input**: Campos de entrada de dados
- **Select**: Dropdowns e seletores
- **Dialog**: Modais e diálogos
- **Table**: Tabelas básicas
- **Badge**: Etiquetas e status
- **Avatar**: Avatares de usuários
- **Progress**: Barras de progresso

### `/src/components/custom/` - Componentes Customizados
Componentes específicos do projeto que estendem funcionalidades:

#### **DataTable**
```tsx
<DataTable
  columns={columns}
  data={data}
  searchKey="name"
  filters={filters}
  enableRowSelection={true}
  enableExport={true}
/>
```
- Tabela avançada com TanStack Table
- Filtros e busca integrados
- Seleção múltipla de linhas
- Exportação para CSV/Excel
- Paginação automática

#### **Animations**
```tsx
<FadeIn delay={200}>
  <StaggeredList delay={100}>
    {items.map(item => <Item key={item.id} />)}
  </StaggeredList>
</FadeIn>
```
- **FadeIn**: Animação de entrada suave
- **StaggeredList**: Animação escalonada para listas
- **SlideIn**: Deslizamento direcional
- **ScaleIn**: Animação de escala
- **Pulse/Bounce**: Efeitos de destaque

#### **Feedback**
```tsx
const { addNotification } = useToast()

<FeedbackButton
  loading={isLoading}
  onClick={() => addNotification({
    type: "success",
    message: "Operação realizada!"
  })}
>
  Salvar
</FeedbackButton>
```
- **ToastProvider**: Context de notificações
- **Notification**: Componente de notificação
- **FeedbackButton**: Botão com estados visuais
- **ConfirmDialog**: Modal de confirmação

#### **Loading**
```tsx
<LoadingState loading={isLoading}>
  <Content />
</LoadingState>

<LoadingOverlay isLoading={isLoading}>
  <Form />
</LoadingOverlay>
```
- **LoadingSpinner**: Indicador de carregamento
- **LoadingState**: Wrapper condicional
- **LoadingOverlay**: Overlay transparente

### `/src/components/dashboard/` - Componentes Específicos

#### **PersonalizedDashboard**
Dashboard principal com widgets customizáveis:
- Widgets redimensionáveis
- Métricas em tempo real
- Gráficos interativos
- Layout responsivo

#### **MainDashboard**
Dashboard original com visão geral:
- Estatísticas principais
- Atividades recentes
- Resumo de projetos

### Componentes de Navegação

#### **AppSidebar**
```tsx
<AppSidebar>
  <NavMain items={navItems} />
  <NavProjects projects={projects} />
  <NavUser user={user} />
</AppSidebar>
```
- Sidebar collapsível
- Busca integrada
- Navegação hierárquica
- Status do sistema

#### **NavMain**
- Navegação principal agrupada
- Ícones e badges
- Sub-menus expansíveis

#### **NavProjects**
- Lista de projetos em destaque
- Indicadores de progresso
- Status visual dos projetos

#### **NavUser**
- Perfil do usuário
- Menu de configurações
- Logout seguro

## Padrões de Design

### Composição de Componentes
```tsx
// ✅ Boa prática - Composição
<Card>
  <CardHeader>
    <CardTitle>Título</CardTitle>
  </CardHeader>
  <CardContent>
    Conteúdo
  </CardContent>
</Card>

// ❌ Evitar - Componente monolítico
<CardComplete title="Título" content="Conteúdo" />
```

### Props Tipadas
```tsx
interface ComponentProps {
  title: string
  variant?: "default" | "destructive"
  onClick?: () => void
  children: React.ReactNode
}

const Component: React.FC<ComponentProps> = ({ 
  title, 
  variant = "default", 
  onClick,
  children 
}) => {
  // implementação
}
```

### Forwarded Refs
```tsx
const Button = React.forwardRef<
  HTMLButtonElement,
  ButtonProps
>(({ className, variant, size, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
})
```

### Estados de Carregamento
```tsx
const Component = () => {
  const [loading, setLoading] = useState(false)
  
  return (
    <LoadingState loading={loading}>
      <DataTable loading={loading} />
    </LoadingState>
  )
}
```

## Responsividade

### Breakpoints Tailwind
- `sm`: 640px+
- `md`: 768px+
- `lg`: 1024px+
- `xl`: 1280px+
- `2xl`: 1536px+

### Grid Responsivo
```tsx
<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
  {items.map(item => <Card key={item.id} />)}
</div>
```

### Sidebar Adaptativa
```tsx
<Sidebar collapsible="icon" className="hidden lg:flex" />
<Sheet> {/* Mobile sidebar */}
  <SidebarContent />
</Sheet>
```

## Acessibilidade

### Práticas Implementadas
- Semântica HTML adequada
- ARIA labels e roles
- Navegação por teclado
- Contraste adequado
- Focus visível
- Screen reader support

### Exemplos
```tsx
<Button aria-label="Fechar modal">
  <X className="h-4 w-4" />
</Button>

<Input 
  aria-describedby="email-help"
  aria-invalid={hasError}
/>
```

## Performance

### Lazy Loading
```tsx
const HeavyComponent = lazy(() => import('./HeavyComponent'))

<Suspense fallback={<LoadingSpinner />}>
  <HeavyComponent />
</Suspense>
```

### Memoização
```tsx
const ExpensiveComponent = memo(({ data }) => {
  const processedData = useMemo(() => 
    processData(data), [data]
  )
  
  return <div>{processedData}</div>
})
```

### Otimização de Renders
```tsx
const { projects } = useProjectStore(
  useShallow(state => ({ projects: state.projects }))
)
```
