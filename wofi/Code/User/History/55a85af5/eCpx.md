# Guia de Autenticação JWT

Este documento descreve como o sistema de autenticação JWT está **implementado hoje** no projeto. Foca em registro, login, refresh, logout (stateless), integração com RBAC e auditoria. (Refatorações futuras não estão descritas aqui.)

## Arquitetura

### Domain Layer
- **User**: Entidade principal com roles e controle de tentativas de login
- **UserRepository**: Interface para persistência de usuários

### Application Layer
- `AuthenticationService`: login e refresh; valida estado do usuário (ativo/bloqueado), registra sucesso/falha em auditoria e atualiza metadados de login.
- `RegistrationService`: valida dados, aplica roles (default se ausente), registra auditoria de criação.
- DTOs: `UserLoginDto`, `UserRegisterDto`; resposta de login é montada no controller a partir do retorno do serviço.

### Infrastructure Layer
- `JwtService`: gera/valida access e refresh tokens, inclui claim `authorities` (roles + permissões agregadas).
- `AuthorizationService`: carrega usuário (UserRepository) e monta `AuthorizationDetails` para Spring Security.
- `JwtAuthenticationFilter`: extrai token do header Authorization, valida e popula o `SecurityContext`.
- `SecurityConfig`: define endpoints públicos (`/auth/**`, docs), política stateless, registra o filtro JWT antes de `UsernamePasswordAuthenticationFilter`.

## Funcionalidades

### 1. Registro de Usuários
- Validação de dados de entrada
- Verificação de duplicidade (username/email)
- Criptografia de senhas com BCrypt
- Atribuição automática de role padrão
- Auditoria automática

### 2. Autenticação
- Username + password.
- Geração de access token e refresh token (HMAC usando segredo Base64 configurado).
- Incremento de tentativas falhas; bloqueio após 5 falhas (`User.incrementFailedLoginAttempts()`).
- Auditoria de sucesso e falha (falha marca `AuditResult.ERROR`).

### 3. Autorização
- Token inclui `authorities`: ex. `ROLE_ADMIN`, `user:read`.
- Filtro JWT popula o contexto de segurança.
- RBAC fino via `@RequirePermission` e `AccessControlAspect`.
- Refresh gera novo access token mantendo o refresh original válido (sem rotação no estado atual).

### 4. Segurança
- Assinatura HMAC-SHA (JJWT).
- Expiração configurável (ver `spring.security.jwt.expiration`). No `application.yml` atual o valor pode ser menor que 24h (ex.: 360000 ms = 6 min) — ajustar conforme necessidade.
- CSRF desabilitado (API stateless JSON).
- CORS liberal em desenvolvimento (restringir em produção).
- Possível reforço adicional: headers de segurança via reverse proxy / Spring config.

## Endpoints da API (/auth)

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
Autentica e retorna `access_token`, `refresh_token`, `expires_in`, `token_type`.

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
Valida o refresh token e retorna novo access token (refresh não é rotacionado neste estágio).

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
Stateless: apenas resposta de sucesso (não há blacklist/revogação persistida no estado atual).

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

### Estrutura do Access Token (payload exemplo)
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
Localizadas em `application.yml` com prefixo `spring.security.jwt`:
```yaml
spring:
  security:
    jwt:
      secret-key: ${JWT_SECRET_KEY}
      expiration: 360000        # Exemplo atual (ms) – ajustar conforme estratégia
      refresh-token:
        expiration: 604800000   # 7 dias (ms)
```
Observação: garanta que a chave tenha entropia suficiente (>= 256 bits Base64) em produção.

### Banco de Dados
- Tabelas criadas/geridas via JPA (`users`, `user_roles`, etc.).
- Auditoria histórica via Envers (`users_aud`) conforme anotações.

## Integração com RBAC

1. Login: token inclui authorities derivadas de roles e permissões.
2. Requisições: filtro JWT injeta autenticação válida no contexto.
3. Autorização fina: `@RequirePermission` + `AccessControlAspect` avaliam permissões e políticas.

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

Eventos atualmente registrados:
- Login bem-sucedido (`LOGIN`, resultado SUCCESS, descrição "Login successful").
- Falha de login (`LOGIN`, resultado ERROR, descrição com motivo). (Verifique persistência efetiva no serviço.)
- Registro de usuário (`CREATE`).
- Concessão/negação de acesso em RBAC (`PERMISSION_GRANTED` / `PERMISSION_DENIED`).

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

## Testes / Verificação Manual

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

1. Validar expiração do access token no cliente e antecipar refresh.
2. Planejar rotação e revogação de refresh tokens em evolução futura.
3. Descartar tokens no logout (cliente) — considerar token versioning/blacklist posteriormente.
4. Forçar senha forte e, se necessário, expiração de credenciais.
5. Monitorar tentativas de login falhas e bloqueios.
6. Usar sempre HTTPS em produção; proteger a chave JWT em variáveis de ambiente seguras.

## Troubleshooting

### Token Inválido / Expirado
- Verificar expiração (`exp`).
- Confirmar segredo (alterações invalidam tokens antigos).
- Checar formato do header (prefixo `Bearer `).

### Login Falhando
- Credenciais incorretas.
- Conta bloqueada (>=5 tentativas).
- Conta inativa.

### Permissões Negadas
- Verificar se `resource:action` consta nas authorities (token ou contexto).
- Confirmar roles/permissões atribuídas no banco.
- Checar políticas adicionais para o recurso.

---
Para detalhes de RBAC e políticas, veja `rbac-guide.md`.
