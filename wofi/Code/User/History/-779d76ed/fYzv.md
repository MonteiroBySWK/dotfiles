---
applyTo: '**'
---
````markdown
# ⚙️ requirements.instructions.md

## 1. Propósito

Este arquivo orienta o desenvolvimento técnico e o uso do GitHub Copilot para manter o **sistema de gestão de estoque da Revis** alinhado aos requisitos oficiais de negócio, usabilidade e performance descritos no Documento de Requisitos v1.2.0.

O foco é traduzir os requisitos em **instruções práticas** para implementação, priorizando **clareza, consistência e rastreabilidade**.

---

## 2. Contexto do Sistema

O sistema automatiza o controle de **insumos, produtos e pedidos** da Revis, substituindo processos manuais baseados em planilhas Excel.  
A aplicação deve ser web, responsiva e de fácil uso por operadores com conhecimento técnico básico.

**Objetivos principais:**
- Reduzir erros humanos e retrabalho.  
- Automatizar movimentações e alertas de estoque.  
- Fornecer dados confiáveis para decisões estratégicas.  
- Centralizar pedidos, produção e relatórios.

---

## 3. Diretrizes Gerais de Implementação

- Todo requisito do tipo **ESSENCIAL** tem prioridade máxima e deve ser garantido nas primeiras releases.  
- Cada módulo deve ter sua documentação em `/docs/<contexto>/*.md`.  
- O código deve ser modular, testável e manter rastreabilidade com o código do requisito (`REQ-XX`) via comentários.  
- Nenhum recurso visual ou funcional deve ser criado fora do escopo dos requisitos aprovados.  

Exemplo de anotação:
```ts
// REQ-04: Gera alerta quando estoque < mínimo definido
````

---

## 4. Módulos Principais e Instruções de Implementação

### 4.1 Gestão de Estoque de Insumos

**Requisitos:** REQ-01 a REQ-06
**Prioridade:** ESSENCIAL

**Instruções práticas:**

* Implementar CRUD de insumos com campos: `nome`, `categoria`, `unidade`, `estoque_minimo`, `fornecedor`.
* O consumo deve ser **calculado automaticamente** com base nos registros de produção.
* Criar **alertas automáticos** quando o estoque atingir o mínimo (notificações visuais e e-mails).
* Registrar **todas as movimentações** (entrada, saída, perdas) com data e origem.
* Permitir detecção automática de **perdas de insumos** quando o usuário reduzir manualmente a quantidade.
* Implementar **histórico completo** com filtros por período, insumo e tipo de movimentação.

---

### 4.2 Controle de Pedidos

**Requisitos:** REQ-07 a REQ-11
**Prioridade:** ESSENCIAL

**Instruções práticas:**

* Permitir criação de pedidos com múltiplos itens e status rastreável: `Solicitado → Separação → Entrega → Recebido`.
* Atualizar o estoque automaticamente ao marcar um pedido como “Recebido”.
* Calcular valores totais automaticamente se preços forem informados.
* Permitir **anexo de documentos** (notas fiscais, comprovantes).
* Gerar notificações visuais e logs a cada mudança de status.
* Integrar alertas de pedido pendente ao dashboard principal.

---

### 4.3 Controle de Produção

**Requisitos:** REQ-12 a REQ-17
**Prioridade:** ESSENCIAL

**Instruções práticas:**

* Criar módulo de registro de produção diária com produtos e quantidades.
* Calcular consumo de insumos automaticamente por receita.
* Associar **data de produção** a cada lote e controlar validade (3 semanas).
* Exibir alertas para **produtos próximos ao vencimento**.
* Aplicar regra **FIFO (First In, First Out)** no controle de saídas.
* Permitir que o usuário defina **quantidade total a produzir**, e o sistema distribua automaticamente entre tipos de drinks com base em percentuais configuráveis.
* Toda produção deve atualizar o estoque de insumos e produtos acabados.

---

### 4.4 Relatórios

**Requisitos:** REQ-18
**Prioridade:** CONDICIONAL

**Instruções práticas:**

* Gerar relatórios de estoque, pedidos e produção com filtros e paginação.
* Permitir exportação em **Excel, PDF e CSV**.
* Implementar componentes reutilizáveis de relatório (`<ReportCard>`, `<ReportFilter>`, `<ReportExportMenu>`).
* Documentar cada tipo de relatório em `/docs/reports/*.md`.

---

## 5. Requisitos Não-Funcionais e Técnicos

### 5.1 Performance

* Consultas complexas devem responder em **≤ 3 segundos**.
* Suportar **≥ 10 usuários simultâneos** e até **1000 transações/dia**.
* O backup completo deve levar **≤ 1 hora**.
* Copilot deve otimizar consultas, usar paginação e índices.

### 5.2 Segurança

* Autenticação via usuário e senha (JWT no backend).
* Diferentes níveis de acesso (Administrador, Produção, Pedidos).
* Criptografia HTTPS em toda a comunicação.
* Log de operações críticas (edições, exclusões, movimentações).

### 5.3 Usabilidade

* Interface deve ser **intuitiva e responsiva** (Tailwind + Shadcn).
* Operações principais devem ser concluídas em **≤ 5 cliques**.
* Mensagens de erro claras e orientativas.
* Compatibilidade com tablets.

### 5.4 Confiabilidade

* Disponibilidade mínima de **99% em horário comercial**.
* Backup automático diário e restauração validada.
* Verificação de integridade em cada operação crítica.

---

## 6. Dados, Conformidade e Localização

* Retenção de dados por **2 anos** no mínimo.
* Backup incremental diário + completo semanal.
* Conformidade total com **LGPD**.
* Interface, data e moeda no **padrão brasileiro (pt-BR, dd/mm/aaaa, R$)**.
* Exportações compatíveis com órgãos fiscalizadores.

---

## 7. Diretrizes Específicas para o Copilot

> O Copilot deve seguir estas diretrizes ao gerar código para este projeto:

1. **Mapeie o requisito no comentário** de cada função, módulo ou endpoint (`// REQ-XX:`).
2. Sempre que possível, **sugira soluções reutilizáveis e documentadas**.
3. Use **componentes Shadcn e Tailwind** para consistência de UI.
4. Prefira **código acessível**, com feedbacks visuais claros.
5. Não duplique lógica — utilize **hooks, utils ou contextos globais**.
6. Gere logs estruturados para ações críticas (estoque, pedidos, produção).
7. Quando não houver clareza, **sugira validar com a documentação** ou gerar rascunho comentado.

---

## 8. Exemplo de Implementação Guiada por Requisito

```tsx
// REQ-04: Alertar quando o estoque está abaixo do mínimo definido
export function useStockAlert(stock: number, min: number) {
  const shouldAlert = stock < min

  useEffect(() => {
    if (shouldAlert) {
      toast.warning("Estoque abaixo do mínimo configurado.")
    }
  }, [shouldAlert])

  return shouldAlert
}
```

---

## 9. Conclusão

Este arquivo é o guia de referência para desenvolvimento orientado a requisitos.
Todo código, teste e documentação devem estar rastreáveis a um requisito.
O Copilot deve agir como um **assistente de engenharia de requisitos**, garantindo que cada entrega técnica respeite a visão funcional, visual e operacional definida.

```
```
