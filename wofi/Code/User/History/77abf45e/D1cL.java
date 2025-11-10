package br.org.cesjo.sgi.application.usecases.audit;

import br.org.cesjo.sgi.domain.audit.*;
import java.util.List;
import java.util.Objects;

public class AuditService {
    private final AuditRepository auditRepository;

    public AuditService(AuditRepository auditRepository) {
        this.auditRepository = Objects.requireNonNull(auditRepository);
    }

    public void audit(String entityName, String entityId, AuditAction action, 
                     String userId, String username, String description) {
        var audit = new Audit(entityName, entityId, action, userId, username);
        audit.setDescription(description);
        auditRepository.save(audit);
    }

    public void auditWithContext(String entityName, String entityId, AuditAction action,
                               String userId, String username, String description,
                               String clientIp, String userAgent) {
        var audit = new Audit(entityName, entityId, action, userId, username);
        audit.setDescription(description);
        audit.setClientIp(clientIp);
        audit.setUserAgent(userAgent);
        auditRepository.save(audit);
    }

    public List<Audit> getUserAuditHistory(String userId) {
        return auditRepository.findByUserId(userId);
    }

    public List<Audit> getEntityAuditHistory(String entityName, String entityId) {
        return auditRepository.findByEntityNameAndEntityId(entityName, entityId);
    }

    public List<Audit> getActionAuditHistory(AuditAction action) {
        return auditRepository.findByAction(action);
    }

    public List<Audit> getFailedActions() {
        return auditRepository.findByResult(AuditResult.ERROR);
    }

    public List<Audit> getAccessDeniedAttempts() {
        return auditRepository.findByResult(AuditResult.ACCESS_DENIED);
    }
}
