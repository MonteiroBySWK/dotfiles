package br.org.cesjo.sgi.application.usecases.rbac;

import br.org.cesjo.sgi.domain.audit.AuditRepository;
import br.org.cesjo.sgi.domain.rbac.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

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
        MockitoAnnotations.openMocks(this);
        accessControlService = new AccessControlService(
            roleRepository, permissionRepository, policyRepository, auditRepository
        );
    }

    @Test
    void shouldGrantAccessWhenUserHasPermission() {
        // Arrange
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
        when(policyRepository.findActiveByResource(resource)).thenReturn(java.util.List.of());

        // Act
        boolean hasAccess = accessControlService.hasAccess(userId, username, resource, action, context);

        // Assert
        assertTrue(hasAccess);
        verify(auditRepository).save(any());
    }

    @Test
    void shouldDenyAccessWhenUserLacksPermission() {
        // Arrange
        String userId = "user1";
        String username = "testuser";
        String resource = "admin";
        String action = "write";

        Role role = new Role("USER", "Regular user", Set.of());

        PolicyContext context = new PolicyContext(
            userId, Set.of("USER"), resource, action, "127.0.0.1", null
        );

        when(roleRepository.findByName("USER")).thenReturn(Optional.of(role));

        // Act
        boolean hasAccess = accessControlService.hasAccess(userId, username, resource, action, context);

        // Assert
        assertFalse(hasAccess);
        verify(auditRepository).save(any());
    }

    @Test
    void shouldCreateRoleSuccessfully() {
        // Arrange
        String roleName = "NEW_ROLE";
        String description = "New role description";
        String creatorId = "admin";
        String creatorUsername = "admin";

        Role role = new Role(roleName, description);
        
        when(roleRepository.existsByName(roleName)).thenReturn(false);
        when(roleRepository.save(any(Role.class))).thenReturn(role);

        // Act
        Role createdRole = accessControlService.createRole(roleName, description, creatorId, creatorUsername);

        // Assert
        assertNotNull(createdRole);
        assertEquals(roleName, createdRole.getName());
        assertEquals(description, createdRole.getDescription());
        verify(roleRepository).save(any(Role.class));
        verify(auditRepository).save(any());
    }

    @Test
    void shouldThrowExceptionWhenCreatingExistingRole() {
        // Arrange
        String roleName = "EXISTING_ROLE";
        String description = "Description";
        String creatorId = "admin";
        String creatorUsername = "admin";

        when(roleRepository.existsByName(roleName)).thenReturn(true);

        // Act & Assert
        IllegalArgumentException exception = assertThrows(
            IllegalArgumentException.class,
            () -> accessControlService.createRole(roleName, description, creatorId, creatorUsername)
        );

        assertEquals("Role already exists: " + roleName, exception.getMessage());
        verify(roleRepository, never()).save(any());
    }
}
