# como usar o sistema

## 🚀 guia completo de uso

### 📋 pré-requisitos

- **java 17+** instalado
- **maven 3.6+** instalado
- **git** para clonar o repositório

### 🔧 instalação e execução

#### 1. clonar o repositório
```bash
git clone https://github.com/MonteiroBySWK/Varejo-Rapido-API.git
cd Varejo-Rapido-API
```

#### 2. compilar o projeto
```bash
mvn clean compile
```

#### 3. executar a aplicação
```bash
mvn spring-boot:run
```

#### 4. verificar se está funcionando
```bash
curl http://localhost:8080/vendas
```

**resposta esperada**: `[]` (lista vazia inicialmente)

## 📊 casos de uso práticos

### 1. 📤 importar dados de vendas

**cenário**: você tem dados de venda em formato json vindos do frontend

**exemplo de dados**:
```json
[
  {
    "data_venda": "03/10/2025",
    "qtd_vendida": 2,
    "produto": {
      "id": 1001,
      "nome_produto": "notebook dell",
      "valor_unit": 2500.00
    },
    "cliente": {
      "id_cliente": 2001,
      "nome_cliente": "joão silva"
    }
  },
  {
    "data_venda": "03/10/2025",
    "qtd_vendida": 1,
    "produto": {
      "id": 1002,
      "nome_produto": "mouse logitech",
      "valor_unit": 150.00
    },
    "cliente": {
      "id_cliente": 2002,
      "nome_cliente": "maria santos"
    }
  }
]
```

**comando**:
```bash
curl -X POST http://localhost:8080/vendas \
  -H "Content-Type: application/json" \
  -d '[
    {
      "data_venda": "03/10/2025",
      "qtd_vendida": 2,
      "produto": {
        "id": 1001,
        "nome_produto": "notebook dell",
        "valor_unit": 2500.00
      },
      "cliente": {
        "id_cliente": 2001,
        "nome_cliente": "joão silva"
      }
    }
  ]'
```

**resposta**:
```json
{
  "message": "processamento concluído",
  "totalProcessed": 1,
  "totalSuccess": 1,
  "totalErrors": 0,
  "errors": []
}
```

### 2. 📋 listar vendas

**comando**:
```bash
curl http://localhost:8080/vendas
```

**resposta**:
```json
[
  {
    "id": 1,
    "dataVenda": "2025-10-03",
    "quantidade": 2,
    "valorUnitario": 2500.0,
    "valorTotalVenda": 5000.0,
    "produto": {
      "id": "1001",
      "nome": "notebook dell",
      "valorUnitario": 2500.0
    },
    "cliente": {
      "id": "2001",
      "nome": "joão silva"
    }
  }
]
```

### 3. 🔍 pesquisar vendas

**por nome do cliente**:
```bash
curl "http://localhost:8080/vendas/buscar?query=joão"
```

**por nome do produto**:
```bash
curl "http://localhost:8080/vendas/buscar?query=notebook"
```

**busca parcial**:
```bash
curl "http://localhost:8080/vendas/buscar?query=silva"
```

### 4. 📄 usar paginação

**primeira página**:
```bash
curl "http://localhost:8080/vendas/paginado?page=0&size=5"
```

**ordenar por valor (maior para menor)**:
```bash
curl "http://localhost:8080/vendas/paginado?sortBy=valorTotalVenda&sortDir=desc"
```

**ordenar por data (mais recente primeiro)**:
```bash
curl "http://localhost:8080/vendas/paginado?sortBy=dataVenda&sortDir=desc"
```

## 🎯 integração frontend

### exemplo com javascript/fetch

#### importar dados do arquivo .dat processado
```javascript
async function importarVendas(dadosProcessados) {
  try {
    const response = await fetch('/vendas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dadosProcessados)
    });
    
    const resultado = await response.json();
    
    console.log(`importação concluída:`);
    console.log(`- processados: ${resultado.totalProcessed}`);
    console.log(`- sucessos: ${resultado.totalSuccess}`);
    console.log(`- erros: ${resultado.totalErrors}`);
    
    if (resultado.errors.length > 0) {
      console.log('erros encontrados:', resultado.errors);
    }
    
    return resultado;
  } catch (error) {
    console.error('erro na importação:', error);
  }
}
```

#### buscar vendas com paginação
```javascript
async function buscarVendas(page = 0, size = 20, sortBy = 'dataVenda', sortDir = 'desc') {
  try {
    const url = `/vendas/paginado?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`;
    const response = await fetch(url);
    const data = await response.json();
    
    return {
      vendas: data.content,
      totalPages: data.totalPages,
      totalElements: data.totalElements,
      currentPage: data.number,
      hasNext: !data.last,
      hasPrevious: !data.first
    };
  } catch (error) {
    console.error('erro ao buscar vendas:', error);
    return null;
  }
}
```

#### implementar barra de pesquisa
```javascript
async function pesquisarVendas(termo) {
  if (!termo || termo.trim().length < 2) {
    return [];
  }
  
  try {
    const response = await fetch(`/vendas/buscar?query=${encodeURIComponent(termo)}`);
    const vendas = await response.json();
    
    return vendas;
  } catch (error) {
    console.error('erro na pesquisa:', error);
    return [];
  }
}

// exemplo de uso em um input
document.getElementById('searchInput').addEventListener('input', async (e) => {
  const termo = e.target.value;
  const resultados = await pesquisarVendas(termo);
  
  // atualizar ui com resultados
  exibirResultados(resultados);
});
```

### exemplo com react

```jsx
import { useState, useEffect } from 'react';

function VendasList() {
  const [vendas, setVendas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // buscar todas as vendas
  useEffect(() => {
    fetchVendas();
  }, []);

  const fetchVendas = async () => {
    setLoading(true);
    try {
      const response = await fetch('/vendas');
      const data = await response.json();
      setVendas(data);
    } catch (error) {
      console.error('erro ao carregar vendas:', error);
    } finally {
      setLoading(false);
    }
  };

  // pesquisar vendas
  const handleSearch = async (termo) => {
    if (!termo.trim()) {
      fetchVendas();
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/vendas/buscar?query=${encodeURIComponent(termo)}`);
      const data = await response.json();
      setVendas(data);
    } catch (error) {
      console.error('erro na pesquisa:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="pesquisar por cliente ou produto..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          handleSearch(e.target.value);
        }}
      />
      
      {loading ? (
        <p>carregando...</p>
      ) : (
        <ul>
          {vendas.map(venda => (
            <li key={venda.id}>
              {venda.cliente.nome} - {venda.produto.nome} - r$ {venda.valorTotalVenda}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

## 🛠️ desenvolvimento

### estrutura recomendada para desenvolvimento

```bash
# terminal 1: executar aplicação
mvn spring-boot:run

# terminal 2: testes manuais
curl http://localhost:8080/vendas

# terminal 3: logs em tempo real
tail -f logs/application.log
```

### testando mudanças

#### 1. fazer alterações no código
#### 2. parar aplicação (ctrl+c)
#### 3. recompilar e executar
```bash
mvn clean compile
mvn spring-boot:run
```

### debuging comum

#### problema: aplicação não inicia
**solução**: verificar se java 17+ está instalado
```bash
java --version
```

#### problema: erro 404 nos endpoints
**solução**: verificar se aplicação está rodando na porta 8080
```bash
curl http://localhost:8080/vendas
```

#### problema: dados não são salvos
**causa**: banco h2 é in-memory, dados são perdidos ao reiniciar
**solução**: isso é normal em desenvolvimento

## 📝 boas práticas de uso

### ✅ recomendações

1. **comece simples**: use `GET /vendas` para desenvolvimento
2. **use paginação**: quando tiver mais de 100 vendas
3. **implemente pesquisa**: para melhor ux no frontend
4. **valide dados**: antes de enviar para api
5. **trate erros**: sempre verifique responses da api

### ❌ evite

1. **não ignore erros**: sempre verifique `totalErrors` na response
2. **não sobrecarregue**: evite requests muito grandes (>1000 itens)
3. **não assuma dados**: sempre valide responses
4. **não hardcode urls**: use variáveis de ambiente

## 🎉 próximos passos

depois de dominar o básico, você pode:

1. **implementar cache** no frontend
2. **adicionar filtros avançados** (por data, valor, etc)
3. **implementar paginação infinita**
4. **adicionar dashboard com estatísticas**
5. **integrar com outros sistemas**

## 💡 dicas finais

- **consulte logs**: sempre verifique logs em caso de erro
- **use postman**: para testes mais complexos
- **documente mudanças**: mantenha docs atualizadas
- **teste cenários edge**: dados inválidos, redes instáveis, etc