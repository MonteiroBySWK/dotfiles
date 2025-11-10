# 🚀 Guia Rápido - Setup do Sistema REVIS

## Pré-requisitos

- Node.js 18+ instalado
- Conta no Firebase (gratuita)
- Editor de código (VS Code recomendado)

---

## 📋 Passo a Passo

### 1. Clone e Instale

```bash
git clone <url-do-repositorio>
cd revis
npm install
```

### 2. Configure o Firebase

#### 2.1 Criar Projeto Firebase

1. Acesse [https://console.firebase.google.com](https://console.firebase.google.com)
2. Clique em "Adicionar projeto"
3. Nomeie seu projeto (ex: "revis-producao")
4. Desabilite Google Analytics (opcional)
5. Clique em "Criar projeto"

#### 2.2 Habilitar Authentication

1. No menu lateral, clique em **Authentication**
2. Clique em "Começar"
3. Ative o provedor **Email/Password**
4. Salve

#### 2.3 Criar Firestore Database

1. No menu lateral, clique em **Firestore Database**
2. Clique em "Criar banco de dados"
3. Escolha **modo de teste** (para desenvolvimento)
4. Escolha a localização (ex: southamerica-east1)
5. Clique em "Ativar"

#### 2.4 Obter Credenciais

1. Clique no ícone ⚙️ (Configurações do projeto)
2. Role até "Seus apps"
3. Clique no ícone **</>** (Web)
4. Registre o app (ex: "REVIS Web")
5. **Copie as credenciais** (você vai precisar delas no próximo passo)

### 3. Configure as Variáveis de Ambiente

```bash
# Copie o arquivo de exemplo
cp .env.example .env.local
```

Edite `.env.local` e cole suas credenciais do Firebase:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu-projeto-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
```

### 4. Popular o Banco de Dados

```bash
npm run seed
```

Isso criará:
- ✅ 10 ingredientes
- ✅ 3 produtos (Tropicana, Mojito, Caipirinha)
- ✅ 3 pedidos
- ✅ 5 eventos
- ✅ 2 lotes de produção
- ✅ 3 pontos de venda
- ✅ 7 vendas históricas
- ✅ 3 usuários (metadados)

### 5. Criar Usuários no Firebase

⚠️ **IMPORTANTE:** O seed cria apenas os metadados dos usuários. Você precisa criar as contas de autenticação manualmente:

1. Volte ao [Firebase Console](https://console.firebase.google.com)
2. Vá em **Authentication > Users**
3. Clique em **Add user** e crie cada um:

| Email | Senha | Nível |
|-------|-------|-------|
| admin@revis.com | admin123 | Administrador |
| producao@revis.com | producao123 | Produção |
| pedidos@revis.com | pedidos123 | Pedidos |

### 6. Iniciar o Servidor

```bash
npm run dev
```

Acesse: [http://localhost:3000](http://localhost:3000)

### 7. Fazer Login

Use qualquer uma das credenciais criadas no passo 5:
- **Admin:** admin@revis.com / admin123
- **Produção:** producao@revis.com / producao123
- **Pedidos:** pedidos@revis.com / pedidos123

---

## ✅ Pronto! Sistema Configurado

Você já pode:
- ✅ Gerenciar estoque de ingredientes
- ✅ Criar e acompanhar pedidos
- ✅ Planejar e executar produção
- ✅ Cadastrar eventos
- ✅ Registrar vendas
- ✅ Monitorar alertas

---

## 🔧 Comandos Úteis

```bash
npm run dev          # Inicia desenvolvimento
npm run build        # Build para produção
npm start            # Inicia produção
npm run seed         # Repovoar banco (cuidado: duplica dados)
npm run lint         # Verificar código
```

---

## 🆘 Problemas Comuns

### "Firebase: Error (auth/invalid-api-key)"

**Solução:** Verifique se as variáveis de ambiente em `.env.local` estão corretas.

### "FirebaseError: Missing or insufficient permissions"

**Solução:** Certifique-se de que o Firestore está em **modo de teste** ou configure as regras de segurança.

### "Cannot find module" no seed

**Solução:** Execute `npm install` novamente.

### Login não funciona

**Solução:** Verifique se você criou os usuários no Firebase Authentication (passo 5).

---

## 📚 Documentação Adicional

- [README.md](../README.md) - Visão geral completa
- [PROXIMOS_PASSOS.md](PROXIMOS_PASSOS.md) - Roadmap e pendências
- [RESUMO_IMPLEMENTACAO.md](RESUMO_IMPLEMENTACAO.md) - Status atual do projeto

---

## 🎉 Parabéns!

Seu sistema REVIS está pronto para uso! 🍹

Para dúvidas ou problemas, consulte a documentação ou abra uma issue.
