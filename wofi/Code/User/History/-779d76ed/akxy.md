---
applyTo: '**'
---
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
