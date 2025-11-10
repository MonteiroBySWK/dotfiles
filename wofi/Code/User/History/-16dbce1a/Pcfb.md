# arquitetura do sistema

## 🏗️ visão geral da arquitetura

o **varejo-rapido-api** segue os padrões do spring boot com arquitetura mvc (model-view-controller) e princípios de clean architecture.

## 📦 estrutura do projeto

```
src/
├── main/
│   ├── java/
│   │   └── com/Varejo_Rapido/Varejo/
│   │       ├── Application.java              # classe principal
│   │       ├── controller/                   # camada de apresentação
│   │       │   └── VendaController.java
│   │       ├── model/                        # entidades de domínio
│   │       │   ├── Cliente.java
│   │       │   ├── Produto.java
│   │       │   ├── Venda.java
│   │       │   └── dto/                      # objetos de transferência
│   │       │       ├── ClienteDTO.java
│   │       │       ├── ItemRequestBody.java
│   │       │       ├── ProdutoDTO.java
│   │       │       └── VendaResponse.java
│   │       ├── repository/                   # camada de acesso a dados
│   │       │   ├── ClienteRepository.java
│   │       │   ├── ProdutoRepository.java
│   │       │   └── VendaRepository.java
│   │       └── service/                      # regras de negócio
│   │           └── DatParserService.java
│   └── resources/
│       └── application.properties            # configurações
└── test/                                     # testes automatizados
```

## 🎨 camadas da aplicação

### 📊 model (entidades)

**entidades principais**:

#### venda
```java
@Entity
public class Venda {
    @Id @GeneratedValue
    private Long id;
    private LocalDate dataVenda;
    private int quantidade;
    private double valorUnitario;
    private double valorTotalVenda;
    
    @ManyToOne(cascade = CascadeType.PERSIST)
    private Produto produto;
    
    @ManyToOne(cascade = CascadeType.PERSIST)
    private Cliente cliente;
}
```

#### cliente
```java
@Entity
public class Cliente {
    @Id
    private String id;
    private String nome;
}
```

#### produto
```java
@Entity
public class Produto {
    @Id
    private String id;
    private String nome;
    private double valorUnitario;
}
```

### 🎮 controller (apresentação)

**VendaController**: gerencia todas as operações relacionadas a vendas

**endpoints implementados**:
- `GET /vendas` - listagem simples
- `GET /vendas/paginado` - listagem com paginação
- `GET /vendas/buscar` - pesquisa unificada
- `POST /vendas` - processamento em lote
- `POST /vendas/reload` - recarga de dados

**características**:
- ✅ validação de parâmetros
- ✅ tratamento de erros
- ✅ respostas padronizadas
- ✅ documentação inline

### 💾 repository (acesso a dados)

**spring data jpa** com métodos de consulta personalizados:

#### VendaRepository
```java
public interface VendaRepository extends JpaRepository<Venda, Long> {
    List<Venda> findByCliente(Cliente cliente);
    List<Venda> findByProduto(Produto produto);
}
```

#### ClienteRepository
```java
public interface ClienteRepository extends JpaRepository<Cliente, String> {
    List<Cliente> findByNomeContainingIgnoreCase(String nome);
}
```

#### ProdutoRepository
```java
public interface ProdutoRepository extends JpaRepository<Produto, String> {
    List<Produto> findByNomeContainingIgnoreCase(String nome);
}
```

### 🔧 service (regras de negócio)

**DatParserService**: processa arquivos .dat e converte em entidades

**funcionalidades**:
- ✅ parsing de arquivos de texto estruturado
- ✅ criação automática de clientes e produtos
- ✅ validação de dados
- ✅ tratamento de erros

## 🗄️ banco de dados

### configuração atual
- **tipo**: h2 in-memory
- **url**: `jdbc:h2:mem:testdb`
- **ddl**: `hibernate.ddl-auto=update`
- **ambiente**: desenvolvimento

### modelo de dados

```sql
-- tabela cliente
CREATE TABLE cliente (
    id VARCHAR(255) PRIMARY KEY,
    nome VARCHAR(255)
);

-- tabela produto  
CREATE TABLE produto (
    id VARCHAR(255) PRIMARY KEY,
    nome VARCHAR(255),
    valor_unitario DOUBLE NOT NULL
);

-- tabela venda
CREATE TABLE venda (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    data_venda DATE,
    quantidade INTEGER NOT NULL,
    valor_unitario DOUBLE NOT NULL,
    valor_total_venda DOUBLE NOT NULL,
    cliente_id VARCHAR(255),
    produto_id VARCHAR(255),
    FOREIGN KEY (cliente_id) REFERENCES cliente(id),
    FOREIGN KEY (produto_id) REFERENCES produto(id)
);
```

### relacionamentos
- **venda ←→ cliente**: many-to-one
- **venda ←→ produto**: many-to-one
- **cascade**: persist (cria automaticamente se não existir)

## ⚙️ configurações

### application.properties
```properties
# aplicação
spring.application.name=demo

# banco h2
spring.datasource.url=jdbc:h2:mem:testdb;DB_CLOSE_DELAY=-1
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=

# jpa/hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# arquivo .dat (opcional)
varejo.dat.path=arquivoInexistente.dat
```

## 🚀 fluxo de dados

### 1. processamento de arquivo .dat
```
arquivo.dat → DatParserService → entities → repositories → database
```

### 2. consultas via api
```
frontend → controller → repository → database → response
```

### 3. pesquisa unificada
```
query → busca clientes → busca produtos → unifica resultados → response
```

## 🎯 padrões aplicados

### design patterns
- **repository pattern**: abstração do acesso a dados
- **dto pattern**: transferência de dados entre camadas
- **mvc pattern**: separação de responsabilidades

### princípios solid
- **single responsibility**: cada classe tem uma responsabilidade
- **open/closed**: extensível via interfaces
- **dependency inversion**: injeção de dependências

### boas práticas
- **clean code**: nomes expressivos e código limpo
- **dry principle**: don't repeat yourself
- **kiss principle**: keep it simple, stupid

## 🔍 monitoramento e logs

### logs implementados
- ✅ inicialização da aplicação
- ✅ processamento de arquivos .dat
- ✅ erros de parsing
- ✅ operações de banco

### métricas disponíveis
- ✅ queries executadas (show-sql=true)
- ✅ tempo de inicialização
- ✅ estatísticas de processamento

## 🛡️ segurança e validação

### validações implementadas
- ✅ campos obrigatórios nos dtos
- ✅ validação de tipos de dados
- ✅ proteção contra sql injection (jpa)
- ✅ validação de parâmetros de ordenação

### tratamento de erros
- ✅ continue on error (processamento em lote)
- ✅ logs detalhados de erros
- ✅ responses estruturadas com estatísticas

## 📈 escalabilidade

### preparado para crescimento
- ✅ paginação implementada
- ✅ índices automáticos (jpa)
- ✅ queries otimizadas
- ✅ arquitetura modular

### próximos passos
- 🔄 cache redis
- 🔄 banco de dados postgresql
- 🔄 métricas avançadas
- 🔄 testes automatizados