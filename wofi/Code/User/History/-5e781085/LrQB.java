package br.org.cesjo.sgi.infra.persistence.audit;

import br.org.cesjo.sgi.domain.audit.AuditAction;
import br.org.cesjo.sgi.domain.audit.AuditResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AuditEntityRepository extends JpaRepository<AuditEntity, Long> {
    List<AuditEntity> findByUserId(String userId);
    List<AuditEntity> findByEntityNameAndEntityId(String entityName, String entityId);
    List<AuditEntity> findByAction(AuditAction action);
    List<AuditEntity> findByResult(AuditResult result);
}
