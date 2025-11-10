---
applyTo: '**'
---
````markdown
# 🎨 design.instructions.md

## 1. Visão Geral

Este sistema interno segue uma identidade **corporativa e elegante**, inspirada na marca base apresentada.  
A prioridade é oferecer **consistência visual, acessibilidade e responsividade**, com **feedbacks visuais claros** e uma experiência fluida no estilo **dashboard administrativo**.  

Toda interface deve manter um ar profissional, limpo e de fácil leitura, sem perder leveza e vivacidade.

---

## 2. Paleta de Cores e Tokens Visuais

Cores extraídas da identidade principal:

| Nome do Token | Cor | Uso recomendado |
|----------------|------|----------------|
| `--color-primary` | `#37D4E6` | Ações principais, ícones ativos |
| `--color-secondary` | `#FFFFFF` | Texto sobre fundos escuros |
| `--color-accent` | `#F37C87` | Destaques sutis ou botões secundários |
| `--color-warning` | `#F6E14E` | Avisos e alertas leves |
| `--color-success` | `#E84E1B` | Êxito ou feedback positivo |
| `--color-background` | `#8C64EB` | Cor de fundo principal |
| `--color-surface` | `#F9FAFB` | Superfícies claras e containers |
| `--color-text` | `#1F2937` | Texto padrão em fundos claros |

> Todas as cores devem ser aplicadas via tokens do Tailwind (`theme.extend.colors`)  
> e seguir o padrão de contraste WCAG AA para acessibilidade.

---

## 3. Tipografia

Use a tipografia padrão do Shadcn (Inter), ou substitua por **"Nunito Sans"** para um tom mais humanizado e leve.  
A hierarquia deve refletir o peso informacional:

- **Título de página:** `text-2xl font-semibold`
- **Subtítulo:** `text-lg font-medium text-muted-foreground`
- **Texto padrão:** `text-sm text-foreground`
- **Notas ou labels:** `text-xs text-muted-foreground`

Evite tamanhos excessivos. Prefira consistência e alinhamento vertical.

---

## 4. Layout e Responsividade

- Baseie toda a estrutura em **Grid** e **Flexbox** do Tailwind.  
- Utilize `grid-cols-*` e `gap-*` para layout de dashboards.  
- Breakpoints padrão:
  - `sm`: 640px — dispositivos pequenos  
  - `md`: 768px — tablets  
  - `lg`: 1024px — notebooks  
  - `xl`: 1280px — desktops  
  - `2xl`: 1536px — telas amplas  
- Centralize containers com `max-w-*` e `mx-auto`.  
- Utilize `overflow-y-auto` e `scroll-smooth` para painéis longos.

---

## 5. Componentização e Naming

- **Priorize componentes do Shadcn.**  
  Antes de criar um novo, estenda ou componha a partir de um existente.
- **Composição sobre repetição:** crie componentes legíveis, ex:  
  ```tsx
  <HeaderMainPage title="Produtos" />
  <CardProductItem product={item} />
  <ModalConfirmAction onConfirm={handleDelete} />
````

* Evite longas árvores de `<div>` com classes repetitivas.
* Nomeie componentes de forma semântica e legível:

  * `HeaderMainPage`, `SidebarNavigation`, `TableProductList`
* Prefixos podem seguir o contexto funcional (`Card`, `Form`, `Modal`, `Header`, `Table`, etc.).

---

## 6. Feedbacks Visuais

O sistema deve **responder ao usuário de forma clara e imediata**:

| Tipo       | Cor base          | Aplicação                 |
| ---------- | ----------------- | ------------------------- |
| Sucesso    | `--color-success` | Confirmações, salvamentos |
| Erro       | `#DC2626`         | Validações e falhas       |
| Aviso      | `--color-warning` | Alertas não bloqueantes   |
| Informação | `#3B82F6`         | Dicas, estados neutros    |

### Regras

* Use **transições suaves** (`transition-all duration-200`) para mudanças de estado.
* Inclua **tooltips, skeletons, loaders** e mensagens inline sempre que possível.
* Não utilizar bibliotecas de animação externas — use apenas CSS/Tailwind.

---

## 7. Acessibilidade

* Garanta contraste de cores mínimo WCAG AA.
* Todo elemento interativo deve ter `aria-label` descritivo.
* Use `focus-visible` para indicar navegação por teclado.
* Botões e links devem ser acessíveis sem mouse.
* Ícones devem possuir `aria-hidden` quando decorativos.

Exemplo:

```tsx
<Button aria-label="Adicionar produto">
  <PlusIcon aria-hidden="true" />
  Adicionar
</Button>
```

---

## 8. Documentação e Boas Práticas

* Cada contexto deve possuir documentação em `/docs/<contexto>/*.md`.
* Documente:

  * Propósito do componente
  * Estrutura e props
  * Exemplo de uso
  * Considerações de acessibilidade e estados visuais
* Evite código duplicado sempre que possível — priorize reutilização e abstração.
* Comente o código apenas quando a lógica não for autoexplicativa.
* Mantenha consistência no uso de espaçamento, indentação e semântica.

---

## 9. Diretrizes para o Copilot

> Ao gerar código para este projeto, siga as regras abaixo:

* Sempre que possível, **baseie-se em componentes do Shadcn** antes de criar novos.
* Priorize **legibilidade, consistência e manutenção**.
* Estruture layouts com **Grid** ou **Flex**, evitando inline styles.
* Use **tokens de cor** e **classes Tailwind** configuradas no tema.
* Aplique **feedbacks visuais adequados** conforme a ação do usuário.
* Gere código **acessível** e **documentado** no formato descrito.
* Prefira **composição de componentes** e nomes semânticos (`HeaderMainPage`, `CardProductItem`, etc.).
* Evite duplicação e **respeite a arquitetura modular**.

---

## 10. Exemplo Padrão

```tsx
export function HeaderMainPage({ title }: { title: string }) {
  return (
    <header className="flex items-center justify-between border-b border-border bg-surface px-6 py-4">
      <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
      <Button variant="default">Ação</Button>
    </header>
  )
}
```

> Todos os novos componentes devem seguir esse padrão de clareza, composição e consistência visual.

```
```
