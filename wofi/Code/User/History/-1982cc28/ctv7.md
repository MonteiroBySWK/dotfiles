# deploy na railway

## 🚀 guia completo de deploy

### 📋 sobre a railway

a [railway](https://railway.app) é uma plataforma de deploy moderna que facilita a implantação de aplicações spring boot com:
- ✅ deploy automático via git
- ✅ banco postgresql gratuito
- ✅ variáveis de ambiente
- ✅ logs em tempo real
- ✅ domínio automático

### 🛠️ pré-requisitos

- conta na [railway.app](https://railway.app)
- projeto commitado no git
- dockerfile criado (✅ já incluído)

### 📦 arquivos de deploy incluídos

o projeto já inclui todos os arquivos necessários:

```
Varejo-Rapido-API/
├── Dockerfile                          # container otimizado
├── .dockerignore                       # ignora arquivos desnecessários  
├── src/main/resources/
│   ├── application.properties          # config desenvolvimento
│   └── application-prod.properties     # config produção
└── docs/deploy-railway.md             # este guia
```

## 🚀 passo a passo - deploy

### 1. preparar repositório

```bash
# certificar que tudo está commitado
git add .
git commit -m "prepara para deploy railway"
git push origin main
```

### 2. criar projeto na railway

1. acesse [railway.app](https://railway.app)
2. faça login com github
3. clique em **"new project"**
4. selecione **"deploy from github repo"**
5. escolha seu repositório `Varejo-Rapido-API`

### 3. configurar variáveis de ambiente

na dashboard da railway, vá em **variables** e adicione:

```bash
# obrigatórias
SPRING_PROFILES_ACTIVE=prod

# opcionais (railway define automaticamente)
PORT=8080
RAILWAY_ENVIRONMENT=production
```

### 4. adicionar banco postgresql (opcional)

1. na dashboard, clique **"+ new"**
2. selecione **"database"** → **"postgresql"**
3. a railway criará automaticamente `DATABASE_URL`

### 5. fazer deploy

1. railway detecta o `Dockerfile` automaticamente
2. inicia build e deploy
3. fornece url pública da aplicação

## 🔧 configurações avançadas

### variáveis de ambiente disponíveis

```bash
# definidas automaticamente pela railway
PORT=8080                              # porta do container
DATABASE_URL=postgres://...            # conexão postgresql (se adicionado)
RAILWAY_ENVIRONMENT=production

# personalizáveis  
SPRING_PROFILES_ACTIVE=prod           # perfil spring
JAVA_OPTS=-Xmx512m -Xms256m          # otimização jvm
DAT_FILE_PATH=/app/data/vendas.dat    # caminho arquivo .dat (opcional)
```

### configuração de banco personalizada

se quiser configurar banco manualmente:

```bash
# postgresql
DB_DRIVER=org.postgresql.Driver
DB_DIALECT=org.hibernate.dialect.PostgreSQLDialect
DB_USERNAME=seu_usuario
DB_PASSWORD=sua_senha
DATABASE_URL=jdbc:postgresql://host:port/database

# ou usar h2 em produção (não recomendado)
DB_DRIVER=org.h2.Driver
DB_DIALECT=org.hibernate.dialect.H2Dialect
```

## 📊 monitoramento

### health check

a aplicação expõe endpoint de saúde:
```bash
curl https://sua-app.railway.app/actuator/health
```

**resposta esperada**:
```json
{
  "status": "UP"
}
```

### logs em tempo real

na dashboard railway:
1. clique no seu serviço
2. vá na aba **"logs"**
3. veja logs em tempo real

### comandos úteis

```bash
# testar aplicação local com perfil produção
mvn spring-boot:run -Dspring.profiles.active=prod

# build local do docker
docker build -t varejo-rapido-api .

# executar container local
docker run -p 8080:8080 -e SPRING_PROFILES_ACTIVE=prod varejo-rapido-api

# testar endpoints
curl https://sua-app.railway.app/vendas
curl https://sua-app.railway.app/vendas/buscar?query=teste
```

## 🛡️ segurança em produção

### configurações aplicadas

✅ **logs otimizados**: sem sql queries no log
✅ **error pages**: sem stack traces expostas  
✅ **usuário não-root**: container roda com usuário `spring`
✅ **jvm otimizada**: `-Xmx512m -Xms256m`
✅ **health check**: `/actuator/health` disponível

### boas práticas

```bash
# usar secrets para dados sensíveis
railway secrets set DB_PASSWORD=senha_segura

# monitorar uso de recursos
railway status

# configurar domínio personalizado (pago)
railway domains add meudominio.com
```

## 🔄 ci/cd automático

### deploy automático

railway detecta pushes no branch `main` e faz deploy automático:

```bash
# workflow típico
git add .
git commit -m "nova funcionalidade"
git push origin main
# → railway faz deploy automaticamente
```

### rollback

se algo der errado:

1. na dashboard railway, vá em **"deployments"**
2. encontre deploy anterior funcionando
3. clique **"redeploy"**

### branches de staging

para ambiente de teste:

```bash
# criar branch de staging
git checkout -b staging
git push origin staging

# na railway, criar novo projeto
# apontar para branch staging
```

## 📈 otimizações de performance

### configurações de produção

o arquivo `application-prod.properties` já inclui:

```properties  
# cache habilitado
spring.thymeleaf.cache=true

# otimizações hibernate
spring.jpa.properties.hibernate.jdbc.batch_size=20
spring.jpa.properties.hibernate.order_inserts=true

# jpa otimizado  
spring.jpa.open-in-view=false
```

### monitoramento de recursos

```bash
# verificar uso da aplicação
railway status

# logs de performance
railway logs --filter="performance"
```

## 🐛 troubleshooting

### problemas comuns

#### aplicação não inicia
```bash
# verificar logs
railway logs

# possíveis causas
- variável PORT não configurada
- dependências faltando
- erro na configuração do banco
```

#### banco não conecta
```bash
# verificar se postgresql foi adicionado
railway status

# verificar DATABASE_URL
railway variables

# testar conexão local
psql $DATABASE_URL
```

#### build falha
```bash
# verificar dockerfile
docker build -t test .

# verificar .dockerignore
# certificar que src/ não está ignorado
```

### comandos de debug

```bash
# conectar no container
railway shell

# verificar variáveis
railway variables list

# reiniciar aplicação
railway restart

# ver métricas
railway metrics
```

## 💰 custos

### plano gratuito railway

- ✅ 500 horas/mês (aplicação)
- ✅ postgresql gratuito (até 1gb)
- ✅ domínio railway gratuito
- ✅ deploy automático

### otimização de custos

```bash
# suspender aplicação quando não usar
railway suspend

# reativar quando precisar  
railway resume

# monitorar uso
railway usage
```

## 🎉 próximos passos

após deploy bem-sucedido:

1. **configurar domínio personalizado**
2. **implementar cache redis** 
3. **adicionar monitoring avançado**
4. **configurar backups automáticos**
5. **implementar rate limiting**

---

📝 **guia atualizado**: outubro 2025  
🚀 **compatível com**: railway.app v2