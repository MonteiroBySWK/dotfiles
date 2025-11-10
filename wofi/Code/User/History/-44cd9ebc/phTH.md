# 📝 TODO - Sistema REVIS

Lista de funcionalidades pendentes para chegar a 100% de completude.

## 🚨 Prioridade ALTA (Core Features)

### 1. Sistema FIFO Automático (REQ-16)
**Status**: 70% - Estrutura pronta, automação pendente  
**Tempo estimado**: 1-2 dias

- [ ] Criar Cloud Function `aplicarFIFO`
- [ ] Integrar com vendas (consumo automático)
- [ ] Adicionar ordenação por data de produção
- [ ] Implementar alertas de lote perto do vencimento
- [ ] Relatório de rotatividade de estoque

**Arquivos a criar/editar**:
- `functions/aplicarFIFO.ts`
- `src/hooks/useFIFO.ts`
- `src/components/producao/ControleValidade.tsx`

---

### 2. Controle de Validade Automático (REQ-14, REQ-15)
**Status**: 85% - Campos criados, automação pendente  
**Tempo estimado**: 1 dia

- [ ] Cloud Function `verificarValidade` (scheduled daily)
- [ ] Alertas automáticos 7 dias antes do vencimento
- [ ] Dashboard de produtos próximos ao vencimento
- [ ] Bloqueio de vendas de produtos vencidos

**Arquivos a criar/editar**:
- `functions/verificarValidade.ts`
- `src/components/dashboard/CardValidade.tsx`
- `src/hooks/useControleValidade.ts`

---

### 3. Cloud Functions Essenciais
**Status**: 0% - Estrutura de tipos pronta  
**Tempo estimado**: 2-3 dias

#### 3.1 onProducaoExecutada
```typescript
// Atualiza estoque automaticamente ao executar produção
exports.onProducaoExecutada = functions.firestore
  .document('lotesProducao/{loteId}')
  .onUpdate(async (change, context) => {
    const after = change.after.data();
    if (after.status === 'executado') {
      // Baixar ingredientes
      // Criar lotes de produtos
      // Gerar alertas se necessário
    }
  });
```

#### 3.2 onPedidoRecebido
```typescript
// Atualiza estoque ao receber pedido
exports.onPedidoRecebido = functions.firestore
  .document('pedidos/{pedidoId}')
  .onUpdate(async (change, context) => {
    const after = change.after.data();
    if (after.status === 'recebido') {
      // Atualizar estoque
      // Registrar entrada no histórico
    }
  });
```

#### 3.3 verificarAlertas (Scheduled)
```typescript
// Roda diariamente às 8h
exports.verificarAlertas = functions.pubsub
  .schedule('0 8 * * *')
  .timeZone('America/Sao_Paulo')
  .onRun(async (context) => {
    // Estoque baixo
    // Validade próxima
    // Pedidos pendentes
  });
```

**Arquivos a criar**:
- `functions/src/index.ts`
- `functions/src/producao.ts`
- `functions/src/pedidos.ts`
- `functions/src/alertas.ts`

---

## 📊 Prioridade MÉDIA (Analytics & Management)

### 4. Previsão de Demanda
**Status**: 0% - Dados históricos coletados  
**Tempo estimado**: 2-3 dias

- [ ] Algoritmo de previsão baseado em histórico
- [ ] Dashboard com gráficos de tendências
- [ ] Sugestões automáticas de pedidos
- [ ] Análise por evento/sazonalidade

**Componentes a criar**:
- `src/components/dashboard/GraficoPrevisao.tsx`
- `src/lib/algoritmos/previsao.ts`
- `app/previsao/page.tsx`

**Bibliotecas sugeridas**:
- `recharts` ou `chart.js` para gráficos
- `simple-statistics` para cálculos

---

### 5. Log de Operações Críticas (REQ-24)
**Status**: 30% - Estrutura de tipos pronta  
**Tempo estimado**: 1 dia

- [ ] Middleware de logging
- [ ] Registro automático de operações
- [ ] Tela de visualização de logs
- [ ] Filtros por usuário, data, operação
- [ ] Exportação de logs

**Arquivos a criar**:
- `src/lib/middleware/logger.ts`
- `src/hooks/useLogger.ts`
- `app/auditoria/page.tsx`
- `src/components/auditoria/TableLogs.tsx`

---

### 6. Tela de Gerenciamento de Usuários
**Status**: 0% - Autenticação funcional  
**Tempo estimado**: 1 dia

- [ ] CRUD de usuários (admin only)
- [ ] Atribuição de níveis de acesso
- [ ] Ativar/desativar usuários
- [ ] Reset de senha
- [ ] Logs de acesso

**Componentes a criar**:
- `app/usuarios/page.tsx`
- `src/components/usuarios/FormUsuario.tsx`
- `src/components/usuarios/TableUsuarios.tsx`
- `src/hooks/useUsuarios.ts`

---

## 🎨 Prioridade BAIXA (Polish & Optimization)

### 7. Melhorias de UX

#### 7.1 Loading States
- [ ] Skeletons em todas as listagens
- [ ] Loading spinners em ações
- [ ] Progress bars em uploads
- [ ] Shimmer effect

**Componente a criar**:
- `src/components/ui/skeleton.tsx` (Shadcn)
- Usar em todos os componentes de lista

#### 7.2 Error Boundaries
```typescript
// src/components/ErrorBoundary.tsx
export class ErrorBoundary extends React.Component {
  // Capturar erros e exibir fallback UI
}
```

#### 7.3 Melhorias de Performance
- [ ] React.memo em componentes pesados
- [ ] useMemo/useCallback em listas
- [ ] Lazy loading de rotas
- [ ] Image optimization
- [ ] Code splitting

---

### 8. Exportação Avançada de Relatórios

#### 8.1 Excel com formatação
```typescript
// Usar biblioteca xlsx
import * as XLSX from 'xlsx';

const exportarExcel = (dados) => {
  const ws = XLSX.utils.json_to_sheet(dados);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Relatório");
  XLSX.writeFile(wb, `relatorio_${Date.now()}.xlsx`);
};
```

**Biblioteca**: `xlsx` (SheetJS)

#### 8.2 PDF com formatação
```typescript
// Usar jsPDF + autoTable
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const exportarPDF = (dados) => {
  const doc = new jsPDF();
  doc.autoTable({
    head: [headers],
    body: dados,
  });
  doc.save(`relatorio_${Date.now()}.pdf`);
};
```

**Bibliotecas**: `jspdf`, `jspdf-autotable`

---

### 9. PWA (Progressive Web App)

- [ ] Service Worker
- [ ] Manifest.json
- [ ] Offline support
- [ ] Push notifications
- [ ] Install prompt
- [ ] Update notifications

**Arquivos a criar**:
- `public/manifest.json`
- `public/sw.js`
- `src/lib/pwa/registerSW.ts`

---

### 10. Testes

#### 10.1 Testes Unitários (Jest + Testing Library)
```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
```

- [ ] Testes de hooks
- [ ] Testes de componentes
- [ ] Testes de utilitários
- [ ] Coverage > 80%

#### 10.2 Testes E2E (Playwright)
```bash
npm install --save-dev @playwright/test
```

- [ ] Fluxo de login
- [ ] Criação de pedido
- [ ] Execução de produção
- [ ] Relatórios

---

## 📦 Dependências a Instalar

### Para Relatórios Avançados
```bash
pnpm add xlsx jspdf jspdf-autotable
```

### Para Gráficos
```bash
pnpm add recharts
# ou
pnpm add chart.js react-chartjs-2
```

### Para Testes
```bash
pnpm add -D jest @testing-library/react @testing-library/jest-dom @playwright/test
```

### Para PWA
```bash
pnpm add workbox-webpack-plugin workbox-window
```

---

## 🎯 Roadmap

### Semana 1 (ALTA)
- [ ] Cloud Functions essenciais
- [ ] Sistema FIFO automático
- [ ] Controle de validade automático

### Semana 2 (MÉDIA)
- [ ] Previsão de demanda
- [ ] Log de operações
- [ ] Gerenciamento de usuários

### Semana 3 (BAIXA)
- [ ] Exportação avançada (Excel/PDF)
- [ ] Melhorias de UX
- [ ] PWA

### Semana 4 (POLISH)
- [ ] Testes completos
- [ ] Documentação final
- [ ] Deploy em produção

---

## ✅ Critérios de Conclusão

### Para 95%
- [x] Todos os módulos funcionais
- [x] Relatórios básicos
- [ ] Cloud Functions essenciais
- [ ] FIFO automático
- [ ] Validade automática

### Para 100%
- [ ] Previsão de demanda
- [ ] Log completo
- [ ] Testes > 80%
- [ ] PWA
- [ ] Documentação completa

---

**Última atualização**: 09/11/2025  
**Progresso atual**: 92% → Meta: 100%
