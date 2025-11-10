---
applyTo: "**"
---

# Sistema de Gestão de Estoque - Requisitos para GitHub Copilot

## 📋 Contexto do Sistema

Sistema web para gestão de estoque de insumos e produtos acabados de uma empresa de bebidas, substituindo planilhas Excel manuais.

## 🎯 Funcionalidades Principais

### 1. Gestão de Estoque de Insumos (ESSENCIAL)

**REQ-01**: Cadastro de insumos (nome, categoria, unidade, estoque mínimo, fornecedor)
**REQ-02**: Registro de entrada com data, quantidade e número do pedido
**REQ-03**: Cálculo automático de consumo baseado na produção
**REQ-04**: Alertas de estoque abaixo do mínimo
**REQ-05**: Histórico completo de movimentações
**REQ-06**: Identificação automática de perdas com registro de diferença

### 2. Controle de Pedidos (ESSENCIAL)

**REQ-07**: Criação de pedidos com múltiplos itens
**REQ-08**: Rastreamento de status (Solicitado, Separação, Entrega, Recebido)
**REQ-09**: Atualização automática do estoque no recebimento
**REQ-10**: Cálculo do valor total dos pedidos
**REQ-11**: Anexação de documentos (notas fiscais)

### 3. Controle de Produção (ESSENCIAL)

**REQ-12**: Registro de produção diária (produtos e quantidades)
**REQ-13**: Cálculo automático de consumo por receita
**REQ-14**: Controle de validade (3 semanas)
**REQ-15**: Alertas de produtos próximos ao vencimento
**REQ-16**: Priorização FIFO (produtos mais antigos primeiro)
**REQ-17**: Distribuição automática de produção por percentuais configuráveis

### 4. Relatórios (CONDICIONAL)

**REQ-18**: Exportação em Excel, PDF e CSV

## 🔧 Requisitos Técnicos

### Performance

**REQ-19**: Consultas complexas em ≤3 segundos
**REQ-20**: 10 usuários simultâneos
**REQ-21**: 1000 transações/dia
**REQ-22**: Backup completo em ≤1 hora

### Segurança

**REQ-23**: Autenticação usuário/senha
**REQ-24**: Log de operações críticas
**REQ-25**: Diferentes níveis de acesso
**REQ-26**: Criptografia HTTPS

### Usabilidade

**REQ-27**: Interface intuitiva para conhecimento básico
**REQ-28**: Mensagens de erro claras
**REQ-29**: Operações principais em ≤5 cliques
**REQ-30**: Funcionamento em tablets

### Confiabilidade

**REQ-31**: Disponibilidade 99% (horário comercial)
**REQ-32**: Backup automático diário
**REQ-33**: Recuperação de dados em falhas
**REQ-34**: Validação de integridade

## 👥 Classes de Usuário

### Administrador

- Uso diário, conhecimento intermediário
- Configuração do sistema, relatórios, decisões estratégicas

### Equipe de Produção

- Uso diário, conhecimento básico
- Registro de produção, atualização de recebimentos, consulta de estoques

### Responsável por Pedidos

- Uso conforme necessidade, conhecimento básico-intermediário
- Criação de pedidos, acompanhamento de entregas

## 🎨 Interface e Design

### Características Gerais

- Web responsivo (desktop e tablets)
- Design minimalista e intuitivo
- Cores e layout consistentes
- Português brasileiro

### Telas Principais

- Gestão de Estoque (listagem/edição)
- Controle de Pedidos (status/acompanhamento)
- Produção (registro de atividades)
- Relatórios (visualização/exportação)

## 📊 Dados e Formatos

### Localização

- Português brasileiro
- Data: dd/mm/aaaa
- Decimal: vírgula
- Moeda: Real (R$)

### Exportação

- Excel (.xlsx)
- PDF
- CSV

## 🚨 Comportamentos Especiais

### Perdas de Estoque (REQ-06)

```javascript
// Quando houver redução manual no estoque:
// 1. Calcular diferença = valor_anterior - valor_novo
// 2. Registrar perda vinculada ao insumo, data e origem
// 3. Gerar relatórios periódicos de perdas
```

### Distribuição de Produção (REQ-17)

```javascript
// 1. Usuário informa quantidade total de drinks
// 2. Sistema distribui por tipos baseado em percentuais configuráveis
// 3. Permite edição manual antes do registro final
```

## 📝 Observações para Desenvolvimento

### Prioridades

- ESSENCIAL: Funcionalidades críticas para operação
- CONDICIONAL: Funcionalidades importantes mas não críticas
- OPCIONAL: Funcionalidades complementares

### Compatibilidade

- Navegadores: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- Dispositivos: Desktop e tablets
- Resolução mínima: 1024x768

### Dependências

- Migração de dados das planilhas Excel existentes
- Definição de receitas para cálculo de consumo
- Configuração de níveis de acesso por usuário
