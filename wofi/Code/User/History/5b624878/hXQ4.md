# 📄 Documentação da API - Paginação

## Endpoints de Vendas com Paginação

### 1. GET `/vendas` - Paginação Padrão (Spring Page)

**Parâmetros de Query:**
- `page` (opcional): Número da página (começa em 0) - padrão: 0
- `size` (opcional): Tamanho da página - padrão: 20
- `sort` (opcional): Campo e direção da ordenação - padrão: dataVenda

**Exemplos de Uso:**
```
GET /vendas                           # Primeira página, 20 itens, ordenado por dataVenda
GET /vendas?page=0&size=10           # Primeira página, 10 itens
GET /vendas?page=1&size=10           # Segunda página, 10 itens
GET /vendas?sort=id,desc             # Ordenado por ID decrescente
GET /vendas?sort=valorTotalVenda,asc # Ordenado por valor crescente
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

### 2. GET `/vendas/paginado` - Resposta Customizada

**Parâmetros de Query:** (mesmos do endpoint anterior)

**Resposta Simplificada:**
```json
{
  "content": [...], // Array com as vendas
  "currentPage": 0,
  "totalPages": 5,
  "totalElements": 100,
  "size": 20,
  "first": true,
  "last": false,
  "hasNext": true,
  "hasPrevious": false
}
```

## 📋 Exemplos Práticos

### Frontend JavaScript
```javascript
// Buscar primeira página
const response = await fetch('/vendas?page=0&size=10');
const data = await response.json();

console.log(`Página ${data.number + 1} de ${data.totalPages}`);
console.log(`Total de vendas: ${data.totalElements}`);

// Buscar próxima página se existir
if (!data.last) {
    const nextPage = await fetch(`/vendas?page=${data.number + 1}&size=10`);
}
```

### CURL
```bash
# Primeira página
curl "http://localhost:8080/vendas?page=0&size=5"

# Segunda página ordenada por valor
curl "http://localhost:8080/vendas?page=1&size=5&sort=valorTotalVenda,desc"

# Resposta customizada
curl "http://localhost:8080/vendas/paginado?page=0&size=10"
```

## 🎯 Vantagens da Implementação

✅ **Duas opções de resposta**: Spring Page completa ou customizada simplificada
✅ **Ordenação flexível**: Por qualquer campo da entidade
✅ **Performance**: Evita carregar milhares de registros de uma vez
✅ **Padrão REST**: Segue convenções do Spring Data
✅ **Configurável**: Tamanho de página e ordenação personalizáveis