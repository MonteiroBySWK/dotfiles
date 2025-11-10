package br.org.cesjo.sgi.infra.controllers;

import br.org.cesjo.sgi.application.usecases.rbac.AccessControlService;
import br.org.cesjo.sgi.infra.security.RequirePermission;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/rbac")
public class RbacController {

    private final AccessControlService accessControlService;

    public RbacController(AccessControlService accessControlService) {
        this.accessControlService = accessControlService;
    }

    @PostMapping("/roles")
    @RequirePermission(resource = "role", action = "create", description = "Create new role")
    public ResponseEntity<?> createRole(@RequestParam String name, 
                                       @RequestParam String description,
                                       Authentication authentication) {
        try {
            String creatorId = authentication.getName();
            String creatorUsername = authentication.getName();
            
            var role = accessControlService.createRole(name, description, creatorId, creatorUsername);
            return ResponseEntity.ok(role);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/permissions")
    @RequirePermission(resource = "permission", action = "create", description = "Create new permission")
    public ResponseEntity<?> createPermission(@RequestParam String name,
                                             @RequestParam String resource,
                                             @RequestParam String action,
                                             @RequestParam(required = false) String description,
                                             Authentication authentication) {
        try {
            String creatorId = authentication.getName();
            String creatorUsername = authentication.getName();
            
            var permission = accessControlService.createPermission(name, resource, action, description, creatorId, creatorUsername);
            return ResponseEntity.ok(permission);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/roles/{roleName}/permissions/{permissionName}")
    @RequirePermission(resource = "role", action = "update", description = "Assign permission to role")
    public ResponseEntity<?> assignPermissionToRole(@PathVariable String roleName,
                                                    @PathVariable String permissionName,
                                                    Authentication authentication) {
        try {
            String assignerId = authentication.getName();
            String assignerUsername = authentication.getName();
            
            accessControlService.assignPermissionToRole(roleName, permissionName, assignerId, assignerUsername);
            return ResponseEntity.ok("Permission assigned successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/test")
    @RequirePermission(resource = "system", action = "read", description = "Test endpoint")
    public ResponseEntity<String> testEndpoint() {
        return ResponseEntity.ok("Access granted! RBAC is working.");
    }
    
    @GetMapping("/roles")
    @RequirePermission(resource = "role", action = "read", description = "List all roles")
    public ResponseEntity<?> getAllRoles() {
        try {
            var roles = accessControlService.getAllRoles();
            return ResponseEntity.ok(roles);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/roles/{name}")
    @RequirePermission(resource = "role", action = "read", description = "Get role by name")
    public ResponseEntity<?> getRoleByName(@PathVariable String name) {
        try {
            var role = accessControlService.getRoleByName(name);
            if (role.isPresent()) {
                return ResponseEntity.ok(role.get());
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/permissions")
    @RequirePermission(resource = "permission", action = "read", description = "List all permissions")
    public ResponseEntity<?> getAllPermissions() {
        try {
            var permissions = accessControlService.getAllPermissions();
            return ResponseEntity.ok(permissions);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/permissions/{name}")
    @RequirePermission(resource = "permission", action = "read", description = "Get permission by name")
    public ResponseEntity<?> getPermissionByName(@PathVariable String name) {
        try {
            var permission = accessControlService.getPermissionByName(name);
            if (permission.isPresent()) {
                return ResponseEntity.ok(permission.get());
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/permissions/resource/{resource}")
    @RequirePermission(resource = "permission", action = "read", description = "Get permissions by resource")
    public ResponseEntity<?> getPermissionsByResource(@PathVariable String resource) {
        try {
            var permissions = accessControlService.getPermissionsByResource(resource);
            return ResponseEntity.ok(permissions);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @PutMapping("/roles/{currentName}")
    @RequirePermission(resource = "role", action = "update", description = "Update role")
    public ResponseEntity<?> updateRole(@PathVariable String currentName,
                                       @RequestParam String newName,
                                       @RequestParam String newDescription,
                                       Authentication authentication) {
        try {
            String updaterId = authentication.getName();
            String updaterUsername = authentication.getName();
            
            var updatedRole = accessControlService.updateRole(currentName, newName, newDescription, updaterId, updaterUsername);
            return ResponseEntity.ok(updatedRole);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/permissions/{currentName}")
    @RequirePermission(resource = "permission", action = "update", description = "Update permission")
    public ResponseEntity<?> updatePermission(@PathVariable String currentName,
                                             @RequestParam String newName,
                                             @RequestParam String newResource,
                                             @RequestParam String newAction,
                                             @RequestParam(required = false) String newDescription,
                                             Authentication authentication) {
        try {
            String updaterId = authentication.getName();
            String updaterUsername = authentication.getName();
            
            var updatedPermission = accessControlService.updatePermission(
                currentName, newName, newResource, newAction, newDescription, updaterId, updaterUsername);
            return ResponseEntity.ok(updatedPermission);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @DeleteMapping("/roles/{roleName}/permissions/{permissionName}")
    @RequirePermission(resource = "role", action = "update", description = "Remove permission from role")
    public ResponseEntity<?> removePermissionFromRole(@PathVariable String roleName,
                                                      @PathVariable String permissionName,
                                                      Authentication authentication) {
        try {
            String removerId = authentication.getName();
            String removerUsername = authentication.getName();
            
            accessControlService.removePermissionFromRole(roleName, permissionName, removerId, removerUsername);
            return ResponseEntity.ok("Permission removed successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
