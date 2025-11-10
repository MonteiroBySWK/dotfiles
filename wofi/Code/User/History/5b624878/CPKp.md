# 📄 Documentação da API - Vendas

## Endpoints de Vendas

### 1. GET `/vendas` - Lista Simples

**Descrição:** Retorna todas as vendas em uma lista simples. Ideal para poucos dados e desenvolvimento inicial.

**Resposta:**
```json
[
  {
    "id": 1,
    "dataVenda": "2025-10-02",
    "quantidade": 2,
    "valorUnitario": 25.50,
    "valorTotalVenda": 51.00,
    "produto": {
      "id": "1001",
      "nome": "Produto Exemplo",
      "valorUnitario": 25.50
    },
    "cliente": {
      "id": "2001",
      "nome": "João Silva"
    }
  }
]
```

### 2. GET `/vendas/paginado` - Com Paginação

**Descrição:** Endpoint com paginação usando Spring Data. Use quando houver muitos dados (>100 registros).

**Parâmetros de Query:**
- `page` (opcional): Número da página (começa em 0) - padrão: 0
- `size` (opcional): Tamanho da página - padrão: 20
- `sortBy` (opcional): Campo para ordenação - padrão: id
- `sortDir` (opcional): Direção da ordenação (asc/desc) - padrão: asc

**Campos disponíveis para ordenação:**
- `id` - ID da venda
- `dataVenda` - Data da venda
- `quantidade` - Quantidade vendida
- `valorUnitario` - Valor unitário
- `valorTotalVenda` - Valor total da venda

**Exemplos de Uso:**
```
GET /vendas/paginado                                    # Primeira página, 20 itens, ordenado por ID
GET /vendas/paginado?page=1&size=10                     # Segunda página, 10 itens
GET /vendas/paginado?sortBy=id&sortDir=desc             # Ordenado por ID decrescente
GET /vendas/paginado?sortBy=dataVenda&sortDir=asc       # Ordenado por data crescente
GET /vendas/paginado?sortBy=valorTotalVenda&sortDir=desc # Ordenado por valor decrescente
GET /vendas/paginado?page=0&size=5&sortBy=dataVenda     # Personalizado completo
```

**Resposta (Spring Page):**
```json
{
  "content": [
    {
      "id": 1,
      "dataVenda": "2025-10-02",
      "quantidade": 2,
      "valorUnitario": 25.50,
      "valorTotalVenda": 51.00,
      "produto": {
        "id": "1001",
        "nome": "Produto Exemplo",
        "valorUnitario": 25.50
      },
      "cliente": {
        "id": "2001",
        "nome": "João Silva"
      }
    }
  ],
  "pageable": {
    "pageNumber": 0,
    "pageSize": 20,
    "sort": {
      "sorted": true,
      "empty": false
    }
  },
  "totalElements": 100,
  "totalPages": 5,
  "last": false,
  "first": true,
  "numberOfElements": 20
}
```

### 3. POST `/vendas` - Processar Vendas em Lote

**Descrição:** Processa dados vindos do frontend (arquivo .dat parseado).

**Body:** Array de objetos `ItemRequestBody`

**Resposta:** Objeto `VendaResponse` com estatísticas do processamento.

## 📋 Exemplos Práticos

### Frontend JavaScript

**Lista Simples (recomendado para início):**
```javascript
// Buscar todas as vendas
const response = await fetch('/vendas');
const vendas = await response.json();

console.log(`Total de vendas: ${vendas.length}`);
vendas.forEach(venda => {
    console.log(`Venda ${venda.id}: R$ ${venda.valorTotalVenda}`);
});
```

**Com Paginação (quando necessário):**
```javascript
// Buscar primeira página
const response = await fetch('/vendas/paginado?page=0&size=10');
const data = await response.json();

console.log(`Página ${data.number + 1} de ${data.totalPages}`);
console.log(`Total de vendas: ${data.totalElements}`);

// Buscar próxima página se existir
if (!data.last) {
    const nextPage = await fetch(`/vendas/paginado?page=${data.number + 1}&size=10`);
}
```

### CURL

```bash
# Lista simples (para desenvolvimento)
curl "http://localhost:8080/vendas"

# Com paginação (para produção com muitos dados)
curl "http://localhost:8080/vendas/paginado?page=0&size=5"
curl "http://localhost:8080/vendas/paginado?sort=valorTotalVenda,desc"
```

## 🎯 Quando Usar Cada Endpoint

### GET `/vendas` (Lista Simples)
✅ **Use quando:**
- Poucos dados (< 100 registros)
- Desenvolvimento/testes
- Frontend precisa de todos os dados
- Simplicidade é prioridade

### GET `/vendas/paginado` (Com Paginação)
✅ **Use quando:**
- Muitos dados (> 100 registros)
- Performance é crítica
- Frontend tem navegação por páginas
- Produção com grandes volumes

## 🚀 Vantagens da Implementação

✅ **Simplicidade primeiro**: Lista simples para começar
✅ **Escalabilidade**: Paginação quando necessário
✅ **Padrão Spring**: Usa `Page<T>` nativo sem reinventar a roda
✅ **Performance otimizada**: Abordagem pragmática baseada no volume de dados
✅ **Fácil migração**: Simples trocar de endpoint quando crescer