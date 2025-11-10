---
applyTo: '**'
---
# Sistema REVIS - Guia Copilot

## 🎯 CONTEXTO RÁPIDO
Migrar sistema de planilhas Excel para app web Firebase com esta lógica:
1. **Histórico de Vendas** → Previsão demanda
2. **Montagem Produção** → Planejamento considerando sobras  
3. **Produção (BOM)** → Cálculo consumo insumos
4. **Alertas** → Pedidos automáticos

## 🗃️ MODELO FIREBASE

### `ingredientes`
```javascript
{
  nome: "Vodka", categoria: "Bebida", unidade: "ml",
  estoqueAtual: 5000, estoqueMinimo: 1000,
  historico: [{data, tipo: "entrada|saida|perda", quantidade, origem}]
}
```

### `produtos` 
```javascript
{
  nome: "TROPICANA (270ml)", validade: 21,
  receita: [{ingredienteId, quantidade, unidade}] // BOM
}
```

### `lotesProducao` (REQ-17 + Planilha Montagem)
```javascript
{
  eventoId, dataProducao, status: "planejado|executado",
  // Distribuição automática
  configDistribuicao: {totalDrinks: 150, percentuais: {tropicana: 30, moginto: 25}},
  itensPlanejados: [{produtoId, quantidadeSugerida, quantidadeFinal}], // Editável
  consumoCalculado: {vodka: 4500, xarope: 3600} // Calculado auto (REQ-13)
}
```

### `pedidos`
```javascript
{
  numero: "PED-001", status: "solicitado|separacao|entrega|recebido", // REQ-08
  itens: [{ingredienteId, quantidade, preco}],
  documentos: [{tipo: "nota_fiscal", url}] // REQ-11
}
```

## ⚡ FUNÇÕES CRÍTICAS

### 1. Distribuição Produção (REQ-17)
```javascript
function calcularDistribuicao(totalDrinks, percentuais) {
  const distribuicao = {};
  Object.keys(percentuais).forEach(produtoId => {
    distribuicao[produtoId] = Math.round(totalDrinks * (percentuais[produtoId] / 100));
  });
  return distribuicao; // {tropicana: 45, moginto: 38}
}
```

### 2. Cálculo Consumo (REQ-13 + Planilha BOM)
```javascript
async function calcularConsumoProducao(loteId) {
  const lote = await getLote(loteId);
  const consumo = {};
  
  for (const item of lote.itensPlanejados) {
    const produto = await getProduto(item.produtoId);
    produto.receita.forEach(ing => {
      consumo[ing.ingredienteId] = (consumo[ing.ingredienteId] || 0) + 
                                  (ing.quantidade * item.quantidadeFinal);
    });
  }
  return consumo; // {vodka: 4500, xarope: 3600}
}
```

### 3. Controle Perdas (REQ-06)
```javascript
function registrarAjusteEstoque(ingredienteId, novoValor, motivo) {
  const diferenca = estoqueAnterior - novoValor;
  if (diferenca > 0) {
    // Registrar como perda para relatórios
    registrarPerda(ingredienteId, diferenca, motivo);
  }
  atualizarEstoque(ingredienteId, novoValor);
}
```

### 4. FIFO Automático (REQ-16)
```javascript
function aplicarFIFO(produtoId, quantidade) {
  const lotes = await getLotesOrdenadosPorData(produtoId);
  let restante = quantidade;
  
  for (const lote of lotes) {
    const consumir = Math.min(restante, lote.quantidadeDisponivel);
    consumirDoLote(lote.id, consumir);
    restante -= consumir;
    if (restante <= 0) break;
  }
}
```

## 🔄 CLOUD FUNCTIONS

### Ao Executar Produção
```javascript
exports.executarProducao = functions.firestore
  .document('lotesProducao/{loteId}')
  .onUpdate(async (change, context) => {
    const after = change.after.data();
    
    if (after.status === 'executado') {
      const consumo = after.consumoCalculado;
      
      // Atualizar estoques (transação)
      for (const [ingredienteId, quantidade] of Object.entries(consumo)) {
        await db.collection('ingredientes').doc(ingredienteId).update({
          estoqueAtual: FieldValue.increment(-quantidade)
        });
      }
    }
  });
```

### Alertas Automáticos
```javascript
exports.verificarAlertas = functions.pubsub.schedule('every 24 hours').onRun(async () => {
  // REQ-04: Estoque abaixo do mínimo
  const ingredientes = await db.collection('ingredientes').get();
  ingredientes.forEach(doc => {
    const ing = doc.data();
    if (ing.estoqueAtual < ing.estoqueMinimo) {
      criarAlerta(`Estoque baixo: ${ing.nome}`);
    }
  });
  
  // REQ-15: Produtos perto do vencimento (3 semanas)
  const produtos = await db.collection('produtos').get();
  // ... lógica de validade
});
```

## 🎨 INTERFACE PRINCIPAL

### Telas Baseadas nas Planilhas:
1. **Dashboard Produção** - Substitui "Montagem Produção do dia"
2. **Gestão Insumos** - Substitui "PRODUÇÃO SEGUNDA"  
3. **Histórico Eventos** - Mantém análise de vendas
4. **Pedidos** - Controle completo com status

## 📊 RELATÓRIOS (REQ-18)
- Perdas (REQ-06)
- Produção/Consumo  
- Vendas (Histórico)
- Estoque
- Export: Excel, PDF, CSV

## 🚨 REGRAS DE NEGÓCIO

### Da Planilha PRODUÇÃO:
```javascript
// Estoque Fim do Dia = Estoque Atual - Consumo do Dia
// PEDIDO? = Estoque Fim do Dia < Ponto Ressuprimento
```

### Da Planilha MONTAGEM:
```javascript
// TOTAL = DEMANDA EVENTO - SOBRA EVENTO ANTERIOR
// Distribuição automática por percentuais configuráveis
```

### Validade (REQ-14):
```javascript
// Produtos acabados: 21 dias (3 semanas)
// Alertas a partir de 7 dias para vencimento
```

---

**PRIORIDADES**: 
- ESSENCIAL: Gestão estoque, produção, pedidos
- CONDICIONAL: Relatórios, análises avançadas

**TECNOLOGIA**: Firebase (Firestore, Functions), Web responsivo, Offline support
**STACK**: Firebase (firestote, autenticação), NextJS, TypeScript, TailwindCSS, Shadcn/ui