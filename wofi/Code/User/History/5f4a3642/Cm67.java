package br.org.cesjo.sgi.application.usecases.rbac;

import br.org.cesjo.sgi.domain.audit.Audit;
import br.org.cesjo.sgi.domain.audit.AuditAction;
import br.org.cesjo.sgi.domain.audit.AuditRepository;
import br.org.cesjo.sgi.domain.rbac.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("AccessControlService Tests")
class AccessControlServiceTest {

    @Mock
    private RoleRepository roleRepository;
    
    @Mock
    private PermissionRepository permissionRepository;
    
    @Mock
    private AccessPolicyRepository policyRepository;
    
    @Mock
    private AuditRepository auditRepository;

    private AccessControlService accessControlService;

    @BeforeEach
    void setUp() {
        accessControlService = new AccessControlService(
            roleRepository, permissionRepository, policyRepository, auditRepository
        );
    }

    @Nested
    @DisplayName("Access Control")
    class AccessControl {

        @Test
        @DisplayName("Should grant access when user has permission and no policies exist")
        void shouldGrantAccessWhenUserHasPermissionAndNoPolicies() {
            // Given
            String userId = "user1";
            String username = "testuser";
            String resource = "system";
            String action = "read";

            Permission permission = new Permission("system_read", resource, action, "Read system");
            Role role = new Role("USER", "Regular user", Set.of(permission));

            PolicyContext context = new PolicyContext(
                userId, Set.of("USER"), resource, action, "127.0.0.1", null
            );

            when(roleRepository.findByName("USER")).thenReturn(Optional.of(role));
            when(policyRepository.findActiveByResource(resource)).thenReturn(Collections.emptyList());

            // When
            boolean hasAccess = accessControlService.hasAccess(userId, username, resource, action, context);

            // Then
            assertThat(hasAccess).isTrue();
            
            ArgumentCaptor<Audit> auditCaptor = ArgumentCaptor.forClass(Audit.class);
            verify(auditRepository).save(auditCaptor.capture());
            
            Audit audit = auditCaptor.getValue();
            assertThat(audit.getAction()).isEqualTo(AuditAction.PERMISSION_GRANTED);
            assertThat(audit.getDescription()).contains("Acesso concedido para " + resource + ":" + action);
        }

        @Test
        @DisplayName("Should deny access when user lacks permission")
        void shouldDenyAccessWhenUserLacksPermission() {
            // Given
            String userId = "user1";
            String username = "testuser";
            String resource = "admin";
            String action = "write";

            Role role = new Role("USER", "Regular user", Collections.emptySet());

            PolicyContext context = new PolicyContext(
                userId, Set.of("USER"), resource, action, "127.0.0.1", null
            );

            when(roleRepository.findByName("USER")).thenReturn(Optional.of(role));

            // When
            boolean hasAccess = accessControlService.hasAccess(userId, username, resource, action, context);

            // Then
            assertThat(hasAccess).isFalse();
            
            ArgumentCaptor<Audit> auditCaptor = ArgumentCaptor.forClass(Audit.class);
            verify(auditRepository).save(auditCaptor.capture());
            
            Audit audit = auditCaptor.getValue();
            assertThat(audit.getAction()).isEqualTo(AuditAction.PERMISSION_DENIED);
            assertThat(audit.getDescription()).contains("Permissões insuficientes");
        }

        @Test
        @DisplayName("Should deny access when user has permission but violates policy")
        void shouldDenyAccessWhenUserHasPermissionButViolatesPolicy() {
            // Given
            String userId = "user1";
            String username = "testuser";
            String resource = "system";
            String action = "read";

            Permission permission = new Permission("system_read", resource, action, "Read system");
            Role role = new Role("USER", "Regular user", Set.of(permission));
            
            AccessPolicy mockPolicy = mock(AccessPolicy.class);
            when(mockPolicy.evaluate(any(PolicyContext.class))).thenReturn(false);

            PolicyContext context = new PolicyContext(
                userId, Set.of("USER"), resource, action, "127.0.0.1", null
            );

            when(roleRepository.findByName("USER")).thenReturn(Optional.of(role));
            when(policyRepository.findActiveByResource(resource)).thenReturn(List.of(mockPolicy));

            // When
            boolean hasAccess = accessControlService.hasAccess(userId, username, resource, action, context);

            // Then
            assertThat(hasAccess).isFalse();
            
            ArgumentCaptor<Audit> auditCaptor = ArgumentCaptor.forClass(Audit.class);
            verify(auditRepository).save(auditCaptor.capture());
            
            Audit audit = auditCaptor.getValue();
            assertThat(audit.getAction()).isEqualTo(AuditAction.PERMISSION_DENIED);
            assertThat(audit.getDescription()).contains("Violação de política");
        }

        @Test
        @DisplayName("Should grant access when user has permission and passes all policies")
        void shouldGrantAccessWhenUserHasPermissionAndPassesAllPolicies() {
            // Given
            String userId = "user1";
            String username = "testuser";
            String resource = "system";
            String action = "read";

            Permission permission = new Permission("system_read", resource, action, "Read system");
            Role role = new Role("USER", "Regular user", Set.of(permission));
            
            AccessPolicy mockPolicy = mock(AccessPolicy.class);
            when(mockPolicy.evaluate(any(PolicyContext.class))).thenReturn(true);

            PolicyContext context = new PolicyContext(
                userId, Set.of("USER"), resource, action, "127.0.0.1", null
            );

            when(roleRepository.findByName("USER")).thenReturn(Optional.of(role));
            when(policyRepository.findActiveByResource(resource)).thenReturn(List.of(mockPolicy));

            // When
            boolean hasAccess = accessControlService.hasAccess(userId, username, resource, action, context);

            // Then
            assertThat(hasAccess).isTrue();
            
            ArgumentCaptor<Audit> auditCaptor = ArgumentCaptor.forClass(Audit.class);
            verify(auditRepository).save(auditCaptor.capture());
            
            Audit audit = auditCaptor.getValue();
            assertThat(audit.getAction()).isEqualTo(AuditAction.PERMISSION_GRANTED);
        }

        @Test
        @DisplayName("Should handle multiple user roles correctly")
        void shouldHandleMultipleUserRolesCorrectly() {
            // Given
            String userId = "user1";
            String username = "testuser";
            String resource = "system";
            String action = "read";

            Permission permission = new Permission("system_read", resource, action, "Read system");
            Role userRole = new Role("USER", "Regular user", Collections.emptySet());
            Role adminRole = new Role("ADMIN", "Admin user", Set.of(permission));

            PolicyContext context = new PolicyContext(
                userId, Set.of("USER", "ADMIN"), resource, action, "127.0.0.1", null
            );

            when(roleRepository.findByName("USER")).thenReturn(Optional.of(userRole));
            when(roleRepository.findByName("ADMIN")).thenReturn(Optional.of(adminRole));
            when(policyRepository.findActiveByResource(resource)).thenReturn(Collections.emptyList());

            // When
            boolean hasAccess = accessControlService.hasAccess(userId, username, resource, action, context);

            // Then
            assertThat(hasAccess).isTrue();
        }
    }

    @Nested
    @DisplayName("Role Management")
    class RoleManagement {

        @Test
        @DisplayName("Should create role successfully")
        void shouldCreateRoleSuccessfully() {
            // Given
            String roleName = "NEW_ROLE";
            String description = "New role description";
            String creatorId = "admin";
            String creatorUsername = "admin";

            Role role = new Role(roleName, description);
            
            when(roleRepository.existsByName(roleName)).thenReturn(false);
            when(roleRepository.save(any(Role.class))).thenReturn(role);

            // When
            Role createdRole = accessControlService.createRole(roleName, description, creatorId, creatorUsername);

            // Then
            assertThat(createdRole).isNotNull();
            assertThat(createdRole.getName()).isEqualTo(roleName);
            assertThat(createdRole.getDescription()).isEqualTo(description);
            
            verify(roleRepository).save(any(Role.class));
            
            ArgumentCaptor<Audit> auditCaptor = ArgumentCaptor.forClass(Audit.class);
            verify(auditRepository).save(auditCaptor.capture());
            
            Audit audit = auditCaptor.getValue();
            assertThat(audit.getEntityName()).isEqualTo("Role");
            assertThat(audit.getEntityId()).isEqualTo(roleName);
            assertThat(audit.getAction()).isEqualTo(AuditAction.CREATE);
            assertThat(audit.getDescription()).contains("Role criada: " + roleName);
        }

        @Test
        @DisplayName("Should throw exception when creating existing role")
        void shouldThrowExceptionWhenCreatingExistingRole() {
            // Given
            String roleName = "EXISTING_ROLE";
            String description = "Description";
            String creatorId = "admin";
            String creatorUsername = "admin";

            when(roleRepository.existsByName(roleName)).thenReturn(true);

            // When / Then
            assertThatThrownBy(() -> 
                accessControlService.createRole(roleName, description, creatorId, creatorUsername)
            ).isInstanceOf(IllegalArgumentException.class)
             .hasMessage("Role já existe: " + roleName);

            verify(roleRepository, never()).save(any());
            verify(auditRepository, never()).save(any());
        }
    }

    @Nested
    @DisplayName("Permission Management")
    class PermissionManagement {

        @Test
        @DisplayName("Should create permission successfully")
        void shouldCreatePermissionSuccessfully() {
            // Given
            String name = "new_permission";
            String resource = "system";
            String action = "write";
            String description = "New permission";
            String creatorId = "admin";
            String creatorUsername = "admin";

            Permission permission = new Permission(name, resource, action, description);
            
            when(permissionRepository.existsByName(name)).thenReturn(false);
            when(permissionRepository.save(any(Permission.class))).thenReturn(permission);

            // When
            Permission createdPermission = accessControlService.createPermission(
                name, resource, action, description, creatorId, creatorUsername
            );

            // Then
            assertThat(createdPermission).isNotNull();
            assertThat(createdPermission.getName()).isEqualTo(name);
            assertThat(createdPermission.getResource()).isEqualTo(resource);
            assertThat(createdPermission.getAction()).isEqualTo(action);
            
            verify(permissionRepository).save(any(Permission.class));
            
            ArgumentCaptor<Audit> auditCaptor = ArgumentCaptor.forClass(Audit.class);
            verify(auditRepository).save(auditCaptor.capture());
            
            Audit audit = auditCaptor.getValue();
            assertThat(audit.getEntityName()).isEqualTo("Permission");
            assertThat(audit.getAction()).isEqualTo(AuditAction.CREATE);
            assertThat(audit.getDescription()).contains("Permissão criada: " + name + " para " + resource + ":" + action);
        }

        @Test
        @DisplayName("Should throw exception when creating existing permission")
        void shouldThrowExceptionWhenCreatingExistingPermission() {
            // Given
            String name = "existing_permission";
            String resource = "system";
            String action = "write";
            String description = "Existing permission";
            String creatorId = "admin";
            String creatorUsername = "admin";

            when(permissionRepository.existsByName(name)).thenReturn(true);

            // When / Then
            assertThatThrownBy(() -> 
                accessControlService.createPermission(name, resource, action, description, creatorId, creatorUsername)
            ).isInstanceOf(IllegalArgumentException.class)
             .hasMessage("Permissão já existe: " + name);

            verify(permissionRepository, never()).save(any());
            verify(auditRepository, never()).save(any());
        }
    }

    @Nested
    @DisplayName("Role-Permission Assignment")
    class RolePermissionAssignment {

        @Test
        @DisplayName("Should assign permission to role successfully")
        void shouldAssignPermissionToRoleSuccessfully() {
            // Given
            String roleName = "USER";
            String permissionName = "user_read";
            String assignerId = "admin";
            String assignerUsername = "admin";

            Permission permission = new Permission(permissionName, "user", "read", "Read users");
            Role role = spy(new Role(roleName, "User role"));

            when(roleRepository.findByName(roleName)).thenReturn(Optional.of(role));
            when(permissionRepository.findByName(permissionName)).thenReturn(Optional.of(permission));
            when(role.hasPermission(permission)).thenReturn(false);

            // When
            accessControlService.assignPermissionToRole(roleName, permissionName, assignerId, assignerUsername);

            // Then
            verify(role).addPermission(permission);
            verify(roleRepository).save(role);
            
            ArgumentCaptor<Audit> auditCaptor = ArgumentCaptor.forClass(Audit.class);
            verify(auditRepository).save(auditCaptor.capture());
            
            Audit audit = auditCaptor.getValue();
            assertThat(audit.getAction()).isEqualTo(AuditAction.UPDATE);
            assertThat(audit.getDescription()).contains("Permissão " + permissionName + " atribuída à role " + roleName);
        }

        @Test
        @DisplayName("Should throw exception when role not found")
        void shouldThrowExceptionWhenRoleNotFound() {
            // Given
            String roleName = "NONEXISTENT_ROLE";
            String permissionName = "user_read";
            String assignerId = "admin";
            String assignerUsername = "admin";

            when(roleRepository.findByName(roleName)).thenReturn(Optional.empty());

            // When / Then
            assertThatThrownBy(() -> 
                accessControlService.assignPermissionToRole(roleName, permissionName, assignerId, assignerUsername)
            ).isInstanceOf(IllegalArgumentException.class)
             .hasMessage("Role não encontrada: " + roleName);
        }

        @Test
        @DisplayName("Should throw exception when permission not found")
        void shouldThrowExceptionWhenPermissionNotFound() {
            // Given
            String roleName = "USER";
            String permissionName = "NONEXISTENT_PERMISSION";
            String assignerId = "admin";
            String assignerUsername = "admin";

            Role role = new Role(roleName, "User role");

            when(roleRepository.findByName(roleName)).thenReturn(Optional.of(role));
            when(permissionRepository.findByName(permissionName)).thenReturn(Optional.empty());

            // When / Then
            assertThatThrownBy(() -> 
                accessControlService.assignPermissionToRole(roleName, permissionName, assignerId, assignerUsername)
            ).isInstanceOf(IllegalArgumentException.class)
             .hasMessage("Permissão não encontrada: " + permissionName);
        }

        @Test
        @DisplayName("Should throw exception when role already has permission")
        void shouldThrowExceptionWhenRoleAlreadyHasPermission() {
            // Given
            String roleName = "USER";
            String permissionName = "user_read";
            String assignerId = "admin";
            String assignerUsername = "admin";

            Permission permission = new Permission(permissionName, "user", "read", "Read users");
            Role role = spy(new Role(roleName, "User role"));

            when(roleRepository.findByName(roleName)).thenReturn(Optional.of(role));
            when(permissionRepository.findByName(permissionName)).thenReturn(Optional.of(permission));
            when(role.hasPermission(permission)).thenReturn(true);

            // When / Then
            assertThatThrownBy(() -> 
                accessControlService.assignPermissionToRole(roleName, permissionName, assignerId, assignerUsername)
            ).isInstanceOf(IllegalArgumentException.class)
             .hasMessage("Role já possui esta permissão: " + permissionName);

            verify(roleRepository, never()).save(any());
            verify(auditRepository, never()).save(any());
        }

        @Test
        @DisplayName("Should remove permission from role successfully")
        void shouldRemovePermissionFromRoleSuccessfully() {
            // Given
            String roleName = "USER";
            String permissionName = "user_read";
            String removerId = "admin";
            String removerUsername = "admin";

            Permission permission = new Permission(permissionName, "user", "read", "Read users");
            Role role = spy(new Role(roleName, "User role"));

            when(roleRepository.findByName(roleName)).thenReturn(Optional.of(role));
            when(permissionRepository.findByName(permissionName)).thenReturn(Optional.of(permission));
            when(role.hasPermission(permission)).thenReturn(true);

            // When
            accessControlService.removePermissionFromRole(roleName, permissionName, removerId, removerUsername);

            // Then
            verify(role).removePermission(permission);
            verify(roleRepository).save(role);
            
            ArgumentCaptor<Audit> auditCaptor = ArgumentCaptor.forClass(Audit.class);
            verify(auditRepository).save(auditCaptor.capture());
            
            Audit audit = auditCaptor.getValue();
            assertThat(audit.getAction()).isEqualTo(AuditAction.UPDATE);
            assertThat(audit.getDescription()).contains("Permissão " + permissionName + " removida da role " + roleName);
        }

        @Test
        @DisplayName("Should throw exception when removing permission that role doesn't have")
        void shouldThrowExceptionWhenRemovingPermissionThatRoleDoesntHave() {
            // Given
            String roleName = "USER";
            String permissionName = "user_read";
            String removerId = "admin";
            String removerUsername = "admin";

            Permission permission = new Permission(permissionName, "user", "read", "Read users");
            Role role = spy(new Role(roleName, "User role"));

            when(roleRepository.findByName(roleName)).thenReturn(Optional.of(role));
            when(permissionRepository.findByName(permissionName)).thenReturn(Optional.of(permission));
            when(role.hasPermission(permission)).thenReturn(false);

            // When / Then
            assertThatThrownBy(() -> 
                accessControlService.removePermissionFromRole(roleName, permissionName, removerId, removerUsername)
            ).isInstanceOf(IllegalArgumentException.class)
             .hasMessage("Role não possui esta permissão: " + permissionName);

            verify(roleRepository, never()).save(any());
            verify(auditRepository, never()).save(any());
        }
    }

    @Nested
    @DisplayName("Constructor Validation")
    class ConstructorValidation {

        @Test
        @DisplayName("Should throw exception when roleRepository is null")
        void shouldThrowExceptionWhenRoleRepositoryIsNull() {
            assertThatThrownBy(() -> new AccessControlService(
                    null,
                    permissionRepository,
                    policyRepository,
                    auditRepository
            )).isInstanceOf(NullPointerException.class);
        }

        @Test
        @DisplayName("Should throw exception when permissionRepository is null")
        void shouldThrowExceptionWhenPermissionRepositoryIsNull() {
            assertThatThrownBy(() -> new AccessControlService(
                    roleRepository,
                    null,
                    policyRepository,
                    auditRepository
            )).isInstanceOf(NullPointerException.class);
        }

        @Test
        @DisplayName("Should throw exception when policyRepository is null")
        void shouldThrowExceptionWhenPolicyRepositoryIsNull() {
            assertThatThrownBy(() -> new AccessControlService(
                    roleRepository,
                    permissionRepository,
                    null,
                    auditRepository
            )).isInstanceOf(NullPointerException.class);
        }

        @Test
        @DisplayName("Should throw exception when auditRepository is null")
        void shouldThrowExceptionWhenAuditRepositoryIsNull() {
            assertThatThrownBy(() -> new AccessControlService(
                    roleRepository,
                    permissionRepository,
                    policyRepository,
                    null
            )).isInstanceOf(NullPointerException.class);
        }
    }
}
