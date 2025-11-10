package br.org.cesjo.sgi.domain.audit;

import java.util.List;
import java.util.Optional;

public interface AuditRepository {
    Audit save(Audit audit);
    Optional<Audit> findById(Long id);
    List<Audit> findByUserId(String userId);
    List<Audit> findByEntityNameAndEntityId(String entityName, String entityId);
    List<Audit> findByAction(AuditAction action);
    List<Audit> findByResult(AuditResult result);
}
