package br.org.cesjo.sgi.infra.controllers;

import br.org.cesjo.sgi.application.usecases.audit.AuditService;
import br.org.cesjo.sgi.domain.audit.Audit;
import br.org.cesjo.sgi.domain.audit.AuditAction;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/audit")
@PreAuthorize("hasRole('ADMINISTRATIVE')")
public class AuditController {

    private final AuditService auditService;

    public AuditController(AuditService auditService) {
        this.auditService = auditService;
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Audit>> getUserAuditHistory(@PathVariable String userId) {
        return ResponseEntity.ok().body(auditService.getUserAuditHistory(userId));
    }

    @GetMapping("/entity/{entityName}/{entityId}")
    public ResponseEntity<List<Audit>> getEntityAuditHistory(
            @PathVariable String entityName,
            @PathVariable String entityId) {
        return ResponseEntity.ok(auditService.getEntityAuditHistory(entityName, entityId));
    }

    @GetMapping("/action/{action}")
    public ResponseEntity<List<Audit>> getActionAuditHistory(@PathVariable AuditAction action) {
        return ResponseEntity.ok(auditService.getActionAuditHistory(action));
    }
}