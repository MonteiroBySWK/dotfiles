# Guia de RBAC (Role-Based Access Control), Auditoria e Políticas de Acesso

Este guia descreve como o sistema de RBAC, auditoria e políticas de acesso está implementado **no código atual** do projeto. Ele reflete o funcionamento presente (não propostas futuras) e mostra como usar `@RequirePermission`, o `AccessControlAspect` e o `AccessControlService`.

## Arquitetura

O sistema está organizado nas seguintes camadas:

### Domain Layer
- Entidades: `User`, `Role`, `Permission`, `AccessPolicy`, `Audit`
- Repositórios (interfaces): `UserRepository`, `RoleRepository`, `PermissionRepository`, `AccessPolicyRepository`, `AuditRepository`
- Objetos de apoio / enums: `AuditAction`, `AuditResult`, `PolicyContext`

### Application Layer
- Serviços de caso de uso: `AccessControlService` (controle de acesso / criação de permissões e roles), `AuditService`
- Concentra regras de orquestração (ex: verificar permissões e políticas, auditar concessão/negação)

### Infrastructure Layer
- Persistência: Adaptadores JPA (`RoleRepositoryAdapter`, `PermissionRepositoryAdapter`, etc.) e entidades (`RoleEntity`, `PermissionEntity`)
- Segurança: Anotação `@RequirePermission`, `AccessControlAspect` para interceptar métodos, configuração via `RbacConfiguration`
- Web/API: Endpoints (ex.: `RbacController` se exposto) usam as serviços da camada de aplicação

## Funcionalidades Implementadas

### 1. RBAC (Role-Based Access Control)
- Permissões: representam ação sobre um recurso (`resource:action`). A entidade `Permission` inclui `name`, `resource`, `action`, `description`.
- Roles: agregam permissões (`Role` mantém um `Set<Permission>`).
- Usuários: possuem múltiplos roles (`User.getRoles()`).
- Verificação de Acesso em runtime: métodos anotados com `@RequirePermission(resource = "x", action = "y")` são interceptados pelo `AccessControlAspect`.

### 2. Sistema de Auditoria
- O `AuditService` registra eventos significativos (criação/atribuição de permissões, concessão/negação de acesso, login, etc.).
- Cada registro (`Audit`) contém: tipo de entidade/área, identificadores de usuário e entidade, ação (`AuditAction`), resultado (`AuditResult`), descrição, e metadados de contexto (ex: IP) quando fornecidos.
- A concessão ou negação de acesso através do `AccessControlService` gera auditoria ( ações `PERMISSION_GRANTED` / `PERMISSION_DENIED`).

### 3. Políticas de Acesso
- `AccessPolicy` complementa permissões: permite restringir acesso com condições adicionais.
- O `AccessPolicyRepository` fornece políticas ativas por recurso.
- `PolicyContext` inclui: `userId`, `userRoles`, `resource`, `action`, `clientIp`, `attributes` (map adicional) — usado para avaliar `policy.evaluate(context)`.
- Se não houver políticas ativas para o recurso, o acesso segue apenas RBAC.

## Como Usar

### 1. Protegendo Endpoints com `@RequirePermission`

```java
@RestController
public class ExampleController {
    
    @GetMapping("/users")
    @RequirePermission(resource = "user", action = "read")
    public List<User> getUsers() {
        // Só executará se o usuário tiver a permissão user:read
        return userService.findAll();
    }
    
    @PostMapping("/users")
    @RequirePermission(resource = "user", action = "create")
    public User createUser(@RequestBody UserDto dto) {
        return userService.create(dto);
    }
}
```

### 2. Criando Roles e Permissões (via `AccessControlService`)

```java
// Criar uma nova permissão
accessControlService.createPermission(
    "document_read", 
    "document", 
    "read", 
    "Read documents", 
    userId, 
    username
);

// Criar um novo role
accessControlService.createRole(
    "DOCUMENT_VIEWER", 
    "Can view documents", 
    userId, 
    username
);

// Atribuir permissão ao role
accessControlService.assignPermissionToRole(
    "DOCUMENT_VIEWER", 
    "document_read", 
    userId, 
    username
);
```

### 3. Auditoria de Acesso

```java
// Histórico de um usuário
List<Audit> userHistory = auditService.getUserAuditHistory(userId);

// Histórico de uma entidade
List<Audit> entityHistory = auditService.getEntityAuditHistory("User", userId);

// Tentativas de acesso negado
List<Audit> deniedAttempts = auditService.getAccessDeniedAttempts();
```

## Estrutura de Persistência (Visão Geral)

Principais tabelas (nomenclatura pode variar conforme mapeamento):
- `permissions`, `roles`, tabela de junção `role_permissions`
- `users`, `user_roles`
- Logs/auditoria: tabela própria (ex: `audit`) + tabelas `*_aud` do Envers onde aplicável
*Observação:* A conversão entre entidades JPA e domínio é feita pelos adapters (ex.: `RoleRepositoryAdapter`, `UserRepositoryAdapter`).

## Configuração

### 1. Dependências (principais)
- Spring Boot (Web, Data JPA, Security)
- AspectJ (AOP) para interceptar permissões
- Hibernate Envers para auditoria histórica
- (Autenticação JWT documentada em outro guia)

### 2. Configuração
- `RbacConfiguration`: expõe beans de `AccessControlService` e `AuditService`
- `AccessControlAspect`: intercepta métodos anotados e delega para `AccessControlService`
- Repositórios JPA: injetados automaticamente via Spring Data

### 3. Inicialização
O arquivo `data.sql` (se presente/configurado) pode inserir permissões e roles padrão. Ajuste conforme necessidades do ambiente.

## Segurança

### 1. Princípios Aplicados
- **Principle of Least Privilege**: Usuários só têm as permissões mínimas necessárias
- **Separation of Duties**: Diferentes roles para diferentes responsabilidades
- **Auditoria Completa**: Todas as ações são registradas
- **Políticas Flexíveis**: Regras de negócio podem ser implementadas como políticas

### 2. Proteções Implementadas
- Autenticação obrigatória antes da autorização de permissões
- Auditoria de permissões concedidas e negadas
- Uso de contexto com IP quando disponível
- Politicas adicionais podem reforçar restrições (ex.: horário, roles específicos)

## Extensibilidade

### 1. Adicionando Novas Permissões
1. Inserir no banco ou criar via API
2. Atribuir aos roles apropriados
3. Usar a anotação `@RequirePermission` nos métodos

### 2. Implementando Políticas Customizadas
```java
PolicyCondition businessHoursOnly = context -> {
    LocalTime now = LocalTime.now();
    return now.isAfter(LocalTime.of(9, 0)) && now.isBefore(LocalTime.of(18, 0));
};

AccessPolicy policy = new AccessPolicy(
    "business_hours_access",
    "sensitive_data",
    "Access only during business hours",
    businessHoursOnly,
    Set.of("MANAGER", "ADMIN"),
    true
);
```

### 3. Auditoria Customizada
O `AuditService` pode ser utilizado diretamente para registrar eventos específicos de negócio:

```java
auditService.auditWithContext(
    "CustomEntity",
    entityId,
    AuditAction.UPDATE,
    userId,
    username,
    "Custom business operation completed",
    clientIp,
    userAgent
);
```

## Monitoramento e Relatórios

Possibilidades a partir dos registros atuais:
- Consultar ações de acesso permitidas X negadas
- Levantar histórico por recurso/ação
- Identificar padrões de negação (possível abuso)

## Boas Práticas

1. **Sempre usar anotações**: Proteja todos os endpoints sensíveis
2. **Granularidade adequada**: Crie permissões específicas, não genéricas
3. **Revisar logs**: Acompanhe padrões de negação para detectar problemas
4. **Retenção**: Planeje política de limpeza/archivamento de auditoria
5. **Testes**: Cubra paths de autorização (permitido/negado) em testes automatizados

---
Para autenticação JWT e detalhes de tokens, consulte o arquivo `authentication-guide.md`.
