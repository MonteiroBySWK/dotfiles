# Padrões de Layout - Sistema REVIS

## 📋 Estrutura de Páginas

### Padrão Obrigatório

```tsx
<DashboardLayout 
  title="Título da Página"
  breadcrumbs={[
    { label: 'Início', href: '/' },
    { label: 'Nome da Página' }, // ⚠️ Último item SEM href
  ]}
>
  <div className="space-y-6">  {/* ✅ SEMPRE space-y-6 */}
    <PageHeader
      title="Título Principal"
      subtitle="Descrição clara e concisa da página"
      actions={
        {/* Botões de ação */}
      }
    />

    {/* Conteúdo da página */}
  </div>
</DashboardLayout>
```

---

## 🎨 Espaçamento Padrão

| Elemento | Classe | Uso |
|----------|--------|-----|
| Container principal | `space-y-6` | Entre PageHeader e conteúdo |
| Cards na mesma página | `space-y-4` | Múltiplos cards empilhados |
| Seções dentro de card | `space-y-3` | Dentro de CardContent |
| Formulários | `space-y-4` | Entre campos de input |

**❌ NÃO USE:** `mt-6`, `mb-6` - Prefira `space-y-*`

---

## 🔘 Botões

### Botão com Ícone

```tsx
<Button size="default" className="gap-2">
  <Plus className="h-4 w-4" />
  Adicionar
</Button>
```

**✅ Sempre:**
- `gap-2` para espaçamento ícone-texto
- `h-4 w-4` para ícones
- `size="default"` explícito

**❌ Evite:**
- `mr-2`, `ml-2` - Use `gap-2`
- Ícones sem tamanho definido

---

## 📊 Tabelas

### Wrapper Padrão

```tsx
<Card className="shadow-sm">
  <CardContent className="pt-6">
    {/* Filtros */}
    <div className="mb-4 flex gap-3">
      {/* Busca e filtros */}
    </div>

    {/* Tabela com scroll horizontal mobile */}
    <div className="overflow-x-auto -mx-6 px-6 md:mx-0 md:px-0">
      <div className="min-w-[640px]">
        <Table>
          {/* ... */}
        </Table>
      </div>
    </div>

    {/* Paginação */}
    <Pagination {...props} />
  </CardContent>
</Card>
```

**Características:**
- `shadow-sm` no Card
- `pt-6` no CardContent
- `min-w-[640px]` para scroll mobile
- `-mx-6 px-6` para sangria em mobile

---

## 🍞 Breadcrumbs

```tsx
breadcrumbs={[
  { label: 'Início', href: '/' },          // ✅ com href
  { label: 'Categoria', href: '/cat' },    // ✅ com href
  { label: 'Página Atual' },               // ❌ SEM href
]}
```

**Regra:** Último item NUNCA tem `href`

---

## 📝 PageHeader

```tsx
<PageHeader
  title="Título Principal"                    // Obrigatório
  subtitle="Descrição opcional"               // Opcional
  actions={<Button>Ação</Button>}             // Opcional
/>
```

**Boas Práticas:**
- Título: 2-4 palavras
- Subtitle: 1 linha explicativa
- Actions: Máximo 2 botões primários

---

## 🎭 Dialogs/Modals

```tsx
<Dialog open={open} onOpenChange={setOpen}>
  <DialogTrigger asChild>
    <Button size="default" className="gap-2">
      <Plus className="h-4 w-4" />
      Novo Item
    </Button>
  </DialogTrigger>
  
  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
    <DialogHeader>
      <DialogTitle>Título do Modal</DialogTitle>
      <DialogDescription>           {/* ✅ OBRIGATÓRIO */}
        Descrição clara da ação
      </DialogDescription>
    </DialogHeader>
    
    {/* Conteúdo */}
  </DialogContent>
</Dialog>
```

**Acessibilidade:**
- `DialogDescription` é OBRIGATÓRIO
- `max-h-[90vh]` para scroll em modais grandes
- `overflow-y-auto` quando necessário

---

## 📱 Responsividade Mobile

### Tabelas
- Sempre com scroll horizontal
- `min-w-[640px]` no container interno
- `-mx-6 px-6` para sangria lateral

### Botões
- `gap-2` ao invés de `mr-2`/`ml-2`
- `h-4 w-4` para ícones
- `shrink-0` em ícones quando necessário

### Espaçamento
- Mobile: `space-y-4` ou `gap-3`
- Desktop: `space-y-6` ou `gap-4`
- Use breakpoints: `md:space-y-6`

---

## ✅ Checklist de Padronização

- [ ] `space-y-6` no container principal
- [ ] Breadcrumb último item SEM `href`
- [ ] Botões com `gap-2` e `h-4 w-4` nos ícones
- [ ] Tabelas com scroll mobile (`min-w-[640px]`)
- [ ] `DialogDescription` em todos os modals
- [ ] `CardContent` com `pt-6`
- [ ] Cards com `shadow-sm`
- [ ] Paginação em todas as tabelas

---

## 🚫 Anti-Padrões

❌ **Evite:**
```tsx
// Espaçamento manual
<div className="mt-6">

// Breadcrumb errado
{ label: 'Atual', href: '/atual' }  // Último com href

// Botão sem gap
<Button><Plus className="mr-2" />Texto</Button>

// Tabela sem scroll mobile
<Table> {/* sem wrapper */}
```

✅ **Prefira:**
```tsx
// Container com space-y
<div className="space-y-6">

// Breadcrumb correto
{ label: 'Atual' }  // Último SEM href

// Botão com gap
<Button className="gap-2"><Plus className="h-4 w-4" />Texto</Button>

// Tabela responsiva
<div className="overflow-x-auto">
  <div className="min-w-[640px]">
    <Table>
```

---

**Última atualização:** 2025-01-09
**Versão:** 1.0.0
