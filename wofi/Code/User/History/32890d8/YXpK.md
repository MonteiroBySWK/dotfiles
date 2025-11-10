# varejo-rapido-api

## 📋 descrição geral

sistema de gestão de vendas para loja de varejo desenvolvido em **spring boot**. o projeto permite processar arquivos .dat de vendas, gerenciar produtos, clientes e vendas com apis rest completas.

## 🏗️ arquitetura

- **backend**: spring boot 3.5.6 + java 17
- **banco de dados**: h2 in-memory (desenvolvimento)
- **orm**: hibernate/jpa
- **build**: maven
- **documentação**: markdown

## 🎯 funcionalidades principais

### 📊 gestão de vendas
- ✅ processamento em lote de arquivos .dat
- ✅ crud completo de vendas
- ✅ paginação inteligente
- ✅ pesquisa unificada por cliente/produto

### 👥 gestão de clientes
- ✅ cadastro automático via import
- ✅ busca por nome (case insensitive)
- ✅ associação com vendas

### 📦 gestão de produtos
- ✅ cadastro automático via import
- ✅ controle de preços
- ✅ busca por nome (case insensitive)

### 🔍 sistema de busca
- ✅ pesquisa unificada (clientes + produtos)
- ✅ busca parcial e case insensitive
- ✅ resultados sem duplicatas

## 🚀 endpoints principais

### vendas
- `GET /vendas` - lista simples
- `GET /vendas/paginado` - com paginação
- `GET /vendas/buscar?query=termo` - pesquisa unificada
- `POST /vendas` - processamento em lote

### utilitários
- `POST /vendas/reload` - recarrega arquivo .dat

## 📈 evolução do projeto

### ✅ implementado
1. **estrutura base** - entities, repositories, controllers
2. **processamento de dados** - parser de arquivos .dat
3. **apis rest** - crud completo com validações
4. **sistema de busca** - pesquisa unificada
5. **paginação otimizada** - abordagem pragmática
6. **tratamento de erros** - validações robustas

### 🔄 otimizações aplicadas
- **paginação simplificada**: lista simples → paginação quando necessário
- **busca unificada**: um endpoint para pesquisar clientes e produtos
- **validação de campos**: proteção contra erros de ordenação
- **processamento resiliente**: continua mesmo com itens com erro

## 📚 documentação

- [`endpoints.md`](./endpoints.md) - documentação completa das apis
- [`arquitetura.md`](./arquitetura.md) - detalhes técnicos e estrutura
- [`como-usar.md`](./como-usar.md) - guia de uso e exemplos

## 🎨 filosofia de design

> **"simplicidade primeiro, escalabilidade quando necessário"**

- **kiss principle**: keep it simple, stupid
- **pragmatismo**: soluções baseadas na realidade do projeto
- **escalabilidade**: preparado para crescer quando necessário
- **manutenibilidade**: código limpo e bem documentado

## 🔧 como executar

```bash
# clonar repositório
git clone https://github.com/MonteiroBySWK/Varejo-Rapido-API.git

# entrar no diretório
cd Varejo-Rapido-API

# executar aplicação
mvn spring-boot:run
```

**aplicação disponível em**: `http://localhost:8080`

## 📊 status do projeto

- **versão atual**: 0.0.1-snapshot
- **ambiente**: desenvolvimento
- **cobertura**: funcionalidades principais implementadas
- **próximos passos**: melhorias de performance e features avançadas