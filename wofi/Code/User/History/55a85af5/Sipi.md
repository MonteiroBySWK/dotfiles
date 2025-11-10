# Sistema de Autenticação JWT

Este documento descreve o sistema de autenticação JWT implementado seguindo Clean Architecture e DDD.

## Arquitetura

### Domain Layer
- **User**: Entidade principal com roles e controle de tentativas de login
- **UserRepository**: Interface para persistência de usuários

### Application Layer
- **AuthenticationService**: Gerencia login, logout e refresh tokens
- **RegistrationService**: Gerencia registro de novos usuários
- **DTOs**: `UserLoginDto`, `UserRegisterDto` para transferência de dados

### Infrastructure Layer
- **JwtService**: Geração e validação de tokens JWT
- **CustomUserDetailsService**: Implementação do UserDetailsService do Spring
- **JwtAuthenticationFilter**: Filtro para interceptar e validar tokens
- **SecurityConfig**: Configuração de segurança do Spring

## Funcionalidades

### 1. Registro de Usuários
- Validação de dados de entrada
- Verificação de duplicidade (username/email)
- Criptografia de senhas com BCrypt
- Atribuição automática de role padrão
- Auditoria automática

### 2. Autenticação
- Login com username/password
- Geração de access token e refresh token
- Controle de tentativas de login
- Bloqueio automático após 5 tentativas
- Auditoria de tentativas de login

### 3. Autorização
- Tokens JWT com roles e permissões
- Integração com sistema RBAC
- Filtro automático para validação de tokens
- Refresh de tokens

### 4. Segurança
- Tokens assinados com HMAC-SHA256
- Expiração configurável (24h para access, 7d para refresh)
- Proteção contra CSRF
- CORS configurado
- Headers de segurança

## Endpoints da API

### POST /auth/register
Registra um novo usuário no sistema.

**Request:**
```json
{
    "username": "usuario",
    "email": "usuario@email.com", 
    "password": "senha123",
    "role": ["USER"] // opcional
}
```

**Response (Success):**
```json
{
    "message": "User registered successfully",
    "username": "usuario",
    "email": "usuario@email.com"
}
```

### POST /auth/login
Autentica um usuário e retorna tokens.

**Request:**
```json
{
    "username": "usuario",
    "password": "senha123"
}
```

**Response (Success):**
```json
{
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expires_in": 86400000,
    "token_type": "Bearer"
}
```

### POST /auth/refresh
Renova o access token usando o refresh token.

**Request:**
```json
{
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (Success):**
```json
{
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "Bearer"
}
```

### POST /auth/logout
Efetua logout (stateless - apenas retorna sucesso).

**Response:**
```json
{
    "message": "Logged out successfully"
}
```

## Uso dos Tokens

### Enviando Requisições Autenticadas
Incluir o access token no header Authorization:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Estrutura do Token JWT
```json
{
  "sub": "username",
  "authorities": [
    "ROLE_USER",
    "system:read",
    "user:read"
  ],
  "iat": 1234567890,
  "exp": 1234567890
}
```

## Configuração

### Propriedades de Segurança
```yaml
application:
  security:
    jwt:
      secret-key: "sua-chave-secreta-aqui"
      expiration: 86400000 # 24 horas
      refresh-token:
        expiration: 604800000 # 7 dias
```

### Banco de Dados
As tabelas necessárias são criadas automaticamente:
- `users`: Dados dos usuários
- `user_roles`: Relacionamento usuário-roles
- `users_aud`: Auditoria de usuários (Envers)

## Integração com RBAC

O sistema de autenticação está integrado ao RBAC:

1. **Ao fazer login**: O token inclui todas as roles e permissões do usuário
2. **Nas requisições**: O filtro JWT popula o SecurityContext com as authorities
3. **Na autorização**: O AspectJ intercepta métodos com `@RequirePermission`

### Exemplo de Uso
```java
@RestController
public class ExampleController {
    
    @GetMapping("/admin/users")
    @RequirePermission(resource = "user", action = "read")
    public List<User> getUsers() {
        // Só executará se o usuário tiver a permissão user:read
        return userService.findAll();
    }
}
```

## Auditoria

Todas as ações de autenticação são auditadas automaticamente:

- **Login bem-sucedido**: Registra com resultado SUCCESS
- **Login falha**: Registra com resultado ERROR e motivo
- **Registro de usuário**: Registra criação com resultado SUCCESS
- **Tentativas de acesso negado**: Registra com resultado ACCESS_DENIED

### Consultar Auditoria
```java
// Histórico de login de um usuário
List<Audit> loginHistory = auditService.getUserAuditHistory(userId);

// Tentativas de login falhadas
List<Audit> failedLogins = auditService.getFailedActions();
```

## Tratamento de Erros

### Códigos de Erro Comuns

- **authentication_failed**: Credenciais inválidas
- **registration_failed**: Erro no registro (dados inválidos/duplicados)
- **invalid_token**: Token JWT inválido ou expirado
- **account_locked**: Conta bloqueada por tentativas excessivas
- **account_inactive**: Conta desativada

### Exemplo de Resposta de Erro
```json
{
    "error": "authentication_failed",
    "message": "Invalid credentials"
}
```

## Testes

### Testes de Integração
```bash
./mvnw test -Dtest=AuthControllerIntegrationTest
```

### Testes Manuais com cURL

**Registro:**
```bash
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"teste","email":"teste@email.com","password":"senha123"}'
```

**Login:**
```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"teste","password":"senha123"}'
```

**Requisição autenticada:**
```bash
curl -X GET http://localhost:8080/api/rbac/test \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

## Melhores Práticas

1. **Tokens**: Sempre validar no cliente antes de fazer requisições
2. **Refresh**: Implementar renovação automática de tokens
3. **Logout**: Descartar tokens no cliente (considerear blacklist no servidor)
4. **Senhas**: Enforçar políticas de senha forte
5. **Monitoramento**: Acompanhar tentativas de login falhadas
6. **HTTPS**: Sempre usar em produção

## Troubleshooting

### Token Inválido
- Verificar se não expirou
- Confirmar assinatura do token
- Validar formato do header Authorization

### Login Falhando
- Verificar credenciais
- Confirmar se conta não está bloqueada
- Verificar se conta está ativa

### Permissões Negadas
- Verificar se usuário tem as permissões necessárias
- Confirmar se roles estão atribuídos corretamente
- Validar se políticas de acesso estão ativas
