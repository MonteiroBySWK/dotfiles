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
}
