package br.org.cesjo.sgi.application.usecases.rbac;

import br.org.cesjo.sgi.domain.rbac.*;
import br.org.cesjo.sgi.domain.audit.Audit;
import br.org.cesjo.sgi.domain.audit.AuditAction;
import br.org.cesjo.sgi.domain.audit.AuditRepository;

import java.util.Objects;

public class AccessControlService {
    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;
    private final AccessPolicyRepository policyRepository;
    private final AuditRepository auditRepository;

    public AccessControlService(RoleRepository roleRepository,
                               PermissionRepository permissionRepository,
                               AccessPolicyRepository policyRepository,
                               AuditRepository auditRepository) {
        this.roleRepository = Objects.requireNonNull(roleRepository);
        this.permissionRepository = Objects.requireNonNull(permissionRepository);
        this.policyRepository = Objects.requireNonNull(policyRepository);
        this.auditRepository = Objects.requireNonNull(auditRepository);
    }

    public boolean hasAccess(String userId, String username, String resource, String action, PolicyContext context) {
        // Check role-based permissions
        boolean hasPermission = context.getUserRoles().stream()
                .anyMatch(roleName -> {
                    var role = roleRepository.findByName(roleName);
                    return role.isPresent() && role.get().hasPermission(resource, action);
                });

        if (!hasPermission) {
            auditAccessDenied(userId, username, resource, action, "Insufficient permissions");
            return false;
        }

        // Check access policies
        var policies = policyRepository.findActiveByResource(resource);
        boolean policyAllowed = policies.isEmpty() || policies.stream().anyMatch(policy -> policy.evaluate(context));

        if (!policyAllowed) {
            auditAccessDenied(userId, username, resource, action, "Policy violation");
            return false;
        }

        auditAccessGranted(userId, username, resource, action);
        return true;
    }

    public Role createRole(String name, String description, String creatorId, String creatorUsername) {
        if (roleRepository.existsByName(name)) {
            throw new IllegalArgumentException("Role already exists: " + name);
        }

        var role = new Role(name, description);
        var savedRole = roleRepository.save(role);

        // Audit
        var audit = new Audit("Role", name, AuditAction.CREATE, creatorId, creatorUsername);
        audit.setDescription("Created role: " + name);
        auditRepository.save(audit);

        return savedRole;
    }

    public Permission createPermission(String name, String resource, String action, String description, 
                                     String creatorId, String creatorUsername) {
        if (permissionRepository.existsByName(name)) {
            throw new IllegalArgumentException("Permission already exists: " + name);
        }

        var permission = new Permission(name, resource, action, description);
        var savedPermission = permissionRepository.save(permission);

        // Audit
        var audit = new Audit("Permission", name, AuditAction.CREATE, creatorId, creatorUsername);
        audit.setDescription("Created permission: " + name + " for " + resource + ":" + action);
        auditRepository.save(audit);

        return savedPermission;
    }

    public void assignPermissionToRole(String roleName, String permissionName, String assignerId, String assignerUsername) {
        var role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new IllegalArgumentException("Role not found: " + roleName));
        
        var permission = permissionRepository.findByName(permissionName)
                .orElseThrow(() -> new IllegalArgumentException("Permission not found: " + permissionName));

        role.addPermission(permission);
        roleRepository.save(role);

        // Audit
        var audit = new Audit("Role", roleName, AuditAction.UPDATE, assignerId, assignerUsername);
        audit.setDescription("Assigned permission " + permissionName + " to role " + roleName);
        auditRepository.save(audit);
    }

    private void auditAccessGranted(String userId, String username, String resource, String action) {
        var audit = new Audit("Access", resource + ":" + action, AuditAction.PERMISSION_GRANTED, userId, username);
        audit.setDescription("Access granted to " + resource + ":" + action);
        auditRepository.save(audit);
    }

    private void auditAccessDenied(String userId, String username, String resource, String action, String reason) {
        var audit = new Audit("Access", resource + ":" + action, AuditAction.PERMISSION_DENIED, userId, username);
        audit.setDescription("Access denied to " + resource + ":" + action + " - " + reason);
        auditRepository.save(audit);
    }
}
