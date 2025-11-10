# varejo-rapido-api 🏪

sistema de gestão de vendas para loja de varejo desenvolvido em **spring boot**.

## 📋 sobre o projeto

api rest completa para gerenciar vendas, produtos e clientes com foco em:
- ✅ processamento de arquivos .dat de vendas  
- ✅ pesquisa unificada por cliente/produto
- ✅ paginação inteligente
- ✅ apis rest bem documentadas

## 🚀 início rápido

```bash
# clonar repositório
git clone https://github.com/MonteiroBySWK/Varejo-Rapido-API.git

# entrar no diretório  
cd Varejo-Rapido-API

# executar aplicação
mvn spring-boot:run
```

**aplicação disponível em**: `http://localhost:8080`

**testar api**:
```bash
curl http://localhost:8080/vendas
```

## 📚 documentação completa

toda a documentação está organizada na pasta [`/docs`](./docs/):

### 📖 documentos principais
- **[resumo.md](./docs/resumo.md)** - visão geral do projeto
- **[como-usar.md](./docs/como-usar.md)** - guia completo de uso  
- **[endpoints.md](./docs/endpoints.md)** - documentação das apis
- **[arquitetura.md](./docs/arquitetura.md)** - detalhes técnicos

### 🎯 acesso rápido
- **primeiro contato?** → leia [resumo.md](./docs/resumo.md)
- **quer usar as apis?** → veja [endpoints.md](./docs/endpoints.md)  
- **configurar ambiente?** → siga [como-usar.md](./docs/como-usar.md)

## 🛠️ tecnologias

- **backend**: spring boot 3.5.6 + java 17
- **banco**: h2 in-memory (desenvolvimento)
- **build**: maven
- **orm**: hibernate/jpa

## 🎯 funcionalidades principais

### 📊 vendas
- processamento em lote de dados
- listagem simples e paginada
- pesquisa unificada (cliente + produto)
- estatísticas de processamento

### 👥 clientes & 📦 produtos  
- cadastro automático via import
- busca case insensitive
- associação com vendas

## 📈 endpoints principais

```bash
# listar vendas
GET /vendas

# pesquisar por cliente ou produto
GET /vendas/buscar?query=termo

# importar dados em lote
POST /vendas

# paginação (para muitos dados)
GET /vendas/paginado?page=0&size=20
```

## 🤝 contribuição

1. fork o projeto
2. crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. commit suas mudanças (`git commit -m 'adiciona nova funcionalidade'`)
4. push para a branch (`git push origin feature/nova-funcionalidade`)
5. abra um pull request

## 📄 licença

este projeto está sob a licença mit - veja o arquivo [license](license) para detalhes.

## 📞 contato

- **projeto**: varejo-rapido-api
- **repositório**: [github.com/MonteiroBySWK/Varejo-Rapido-API](https://github.com/MonteiroBySWK/Varejo-Rapido-API)
- **documentação**: [/docs](./docs/)

---

📝 **desenvolvido com ❤️ usando spring boot**