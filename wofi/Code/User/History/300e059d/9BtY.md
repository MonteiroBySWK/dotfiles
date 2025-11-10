# endpoints da api

## 📋 documentação completa dos endpoints

### 🏷️ vendas

#### 1. `GET /vendas` - lista simples

**descrição**: retorna todas as vendas em uma lista simples. ideal para poucos dados e desenvolvimento inicial.

**resposta**:
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
      "nome": "produto exemplo",
      "valorUnitario": 25.50
    },
    "cliente": {
      "id": "2001",
      "nome": "joão silva"
    }
  }
]
```

#### 2. `GET /vendas/paginado` - com paginação

**descrição**: endpoint com paginação usando spring data. use quando houver muitos dados (>100 registros).

**parâmetros de query**:
- `page` (opcional): número da página (começa em 0) - padrão: 0
- `size` (opcional): tamanho da página - padrão: 20
- `sortBy` (opcional): campo para ordenação - padrão: id
- `sortDir` (opcional): direção da ordenação (asc/desc) - padrão: asc

**campos disponíveis para ordenação**:
- `id` - id da venda
- `dataVenda` - data da venda
- `quantidade` - quantidade vendida
- `valorUnitario` - valor unitário
- `valorTotalVenda` - valor total da venda

**exemplos de uso**:
```
GET /vendas/paginado                                    # primeira página, 20 itens
GET /vendas/paginado?page=1&size=10                     # segunda página, 10 itens
GET /vendas/paginado?sortBy=dataVenda&sortDir=desc      # ordenado por data decrescente
GET /vendas/paginado?sortBy=valorTotalVenda&sortDir=desc # ordenado por valor decrescente
```

#### 3. `GET /vendas/buscar` - pesquisa unificada

**descrição**: pesquisa vendas por nome de cliente ou nome de produto. busca unificada case insensitive.

**parâmetros de query**:
- `query` (obrigatório): termo de pesquisa

**exemplos de uso**:
```
GET /vendas/buscar?query=joão           # busca clientes com nome "joão"
GET /vendas/buscar?query=notebook       # busca produtos com nome "notebook"  
GET /vendas/buscar?query=silva          # busca tanto clientes quanto produtos
```

**resposta**: lista de vendas que correspondem à pesquisa

#### 4. `POST /vendas` - processamento em lote

**descrição**: processa dados vindos do frontend (arquivo .dat parseado).

**body**: array de objetos `ItemRequestBody`

**exemplo de request**:
```json
[
  {
    "data_venda": "02/10/2025",
    "qtd_vendida": 2,
    "produto": {
      "id": 1001,
      "nome_produto": "produto exemplo",
      "valor_unit": 25.50
    },
    "cliente": {
      "id_cliente": 2001,
      "nome_cliente": "joão silva"
    }
  }
]
```

**resposta**: objeto `VendaResponse` com estatísticas do processamento:
```json
{
  "message": "processamento concluído",
  "totalProcessed": 10,
  "totalSuccess": 9,
  "totalErrors": 1,
  "errors": ["erro ao processar item..."]
}
```

#### 5. `POST /vendas/reload` - recarregar arquivo

**descrição**: força o recarregamento do arquivo .dat configurado.

**resposta**: lista de vendas processadas

## 📋 exemplos práticos

### frontend javascript

**lista simples (recomendado para início)**:
```javascript
// buscar todas as vendas
const response = await fetch('/vendas');
const vendas = await response.json();

console.log(`total de vendas: ${vendas.length}`);
vendas.forEach(venda => {
    console.log(`venda ${venda.id}: r$ ${venda.valorTotalVenda}`);
});
```

**pesquisa unificada**:
```javascript
// pesquisar por termo
const searchTerm = 'joão';
const response = await fetch(`/vendas/buscar?query=${searchTerm}`);
const resultados = await response.json();

console.log(`encontradas ${resultados.length} vendas para: ${searchTerm}`);
```

**com paginação (quando necessário)**:
```javascript
// buscar primeira página
const response = await fetch('/vendas/paginado?page=0&size=10');
const data = await response.json();

console.log(`página ${data.number + 1} de ${data.totalPages}`);
console.log(`total de vendas: ${data.totalElements}`);

// buscar próxima página se existir
if (!data.last) {
    const nextPage = await fetch(`/vendas/paginado?page=${data.number + 1}&size=10`);
}
```

### curl

```bash
# lista simples (para desenvolvimento)
curl "http://localhost:8080/vendas"

# pesquisa unificada
curl "http://localhost:8080/vendas/buscar?query=joão"

# com paginação (para produção com muitos dados)
curl "http://localhost:8080/vendas/paginado?page=0&size=5"
curl "http://localhost:8080/vendas/paginado?sortBy=valorTotalVenda&sortDir=desc"
```

## 🎯 quando usar cada endpoint

### `GET /vendas` (lista simples)
✅ **use quando**:
- poucos dados (< 100 registros)
- desenvolvimento/testes
- frontend precisa de todos os dados
- simplicidade é prioridade

### `GET /vendas/paginado` (com paginação)
✅ **use quando**:
- muitos dados (> 100 registros)
- performance é crítica
- frontend tem navegação por páginas
- produção com grandes volumes

### `GET /vendas/buscar` (pesquisa)
✅ **use quando**:
- usuário precisa encontrar vendas específicas
- busca por cliente ou produto
- filtros dinâmicos no frontend
- funcionalidades de busca/filtro

## 🚀 vantagens da implementação

✅ **simplicidade primeiro**: lista simples para começar
✅ **escalabilidade**: paginação quando necessário
✅ **pesquisa intuitiva**: busca unificada cliente + produto
✅ **padrão spring**: usa apis nativas sem reinventar a roda
✅ **performance otimizada**: abordagem pragmática baseada no volume de dados
✅ **fácil migração**: simples trocar de endpoint quando crescer