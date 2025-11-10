# Sistema RBAC, Auditoria e Políticas de Acesso

Este documento descreve a implementação do sistema de RBAC (Role-Based Access Control), auditoria e políticas de acesso seguindo os princípios de Clean Architecture e Domain-Driven Design (DDD).

## Arquitetura

O sistema está organizado nas seguintes camadas:

### Domain Layer
- **Entidades de Domínio**: `User`, `Role`, `Permission`, `AccessPolicy`, `Audit`
- **Repositórios de Domínio**: Interfaces que definem contratos para persistência
- **Value Objects**: `AuditAction`, `AuditResult`, `PolicyContext`

### Application Layer
- **Use Cases**: `AccessControlService`, `AuditService`
- **DTOs**: Objetos de transferência de dados entre camadas

### Infrastructure Layer
- **Persistência**: Implementações JPA das entidades e repositórios
- **Configuração**: Beans de configuração e segurança
- **Controllers**: Endpoints REST para gerenciar RBAC

## Funcionalidades Implementadas

### 1. RBAC (Role-Based Access Control)
- **Permissões**: Definem ações específicas em recursos (`resource:action`)
- **Roles**: Agrupam múltiplas permissões
- **Usuários**: Podem ter múltiplos roles
- **Verificação de Acesso**: Via anotação `@RequirePermission`

### 2. Sistema de Auditoria
- **Registro Automático**: Todas as ações são auditadas automaticamente
- **Contexto Completo**: Inclui IP, user agent, timestamps, valores antigos/novos
- **Diferentes Tipos**: CREATE, READ, UPDATE, DELETE, LOGIN, LOGOUT, etc.
- **Resultados**: SUCCESS, ERROR, WARNING, ACCESS_DENIED

### 3. Políticas de Acesso
- **Políticas Dinâmicas**: Além do RBAC, permite regras customizadas
- **Contexto de Avaliação**: Considera usuário, IP, horário, etc.
- **Condições Flexíveis**: Interface funcional para regras complexas

## Como Usar

### 1. Protegendo Endpoints

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

### 2. Criando Roles e Permissões

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

### 3. Consultando Auditoria

```java
// Histórico de um usuário
List<Audit> userHistory = auditService.getUserAuditHistory(userId);

// Histórico de uma entidade
List<Audit> entityHistory = auditService.getEntityAuditHistory("User", userId);

// Tentativas de acesso negado
List<Audit> deniedAttempts = auditService.getAccessDeniedAttempts();
```

## Estrutura do Banco de Dados

### Tabelas Principais
- `permissions`: Armazena as permissões do sistema
- `roles`: Armazena os roles/perfis
- `role_permissions`: Relacionamento N:N entre roles e permissões
- `audit_log`: Log completo de auditoria
- `*_aud`: Tabelas de auditoria do Hibernate Envers

## Configuração

### 1. Dependências Maven
- Spring Boot Security
- Spring Boot AOP (AspectJ)
- Hibernate Envers
- JJWT para tokens JWT

### 2. Configuração de Aplicação
- `RbacConfiguration`: Configura os beans necessários
- `AccessControlAspect`: Intercepta métodos anotados
- Repositórios JPA configurados automaticamente

### 3. Inicialização
O script `data.sql` cria:
- Permissões básicas do sistema
- Roles padrão (ADMIN, MANAGER, USER, VIEWER)
- Atribuições de permissões aos roles

## Segurança

### 1. Princípios Aplicados
- **Principle of Least Privilege**: Usuários só têm as permissões mínimas necessárias
- **Separation of Duties**: Diferentes roles para diferentes responsabilidades
- **Auditoria Completa**: Todas as ações são registradas
- **Políticas Flexíveis**: Regras de negócio podem ser implementadas como políticas

### 2. Proteções Implementadas
- Verificação de autenticação antes de autorização
- Registro de tentativas de acesso negado
- Contexto de segurança com IP e user agent
- Transações para operações críticas

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
O `AuditService` pode ser usado diretamente para registrar eventos customizados:

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

O sistema de auditoria permite:
- Relatórios de acesso por usuário
- Análise de tentativas de acesso negado
- Histórico completo de mudanças em entidades
- Rastreamento de atividades suspeitas

## Boas Práticas

1. **Sempre usar anotações**: Proteja todos os endpoints sensíveis
2. **Granularidade adequada**: Crie permissões específicas, não genéricas
3. **Revisar logs regularmente**: Monitore tentativas de acesso negado
4. **Políticas de retenção**: Configure limpeza automática dos logs antigos
5. **Testes de segurança**: Sempre teste os controles de acesso
