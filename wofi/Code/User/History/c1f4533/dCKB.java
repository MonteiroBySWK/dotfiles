package br.org.cesjo.sgi.infra.persistence.audit;

import br.org.cesjo.sgi.domain.audit.Audit;
import br.org.cesjo.sgi.domain.audit.AuditAction;
import br.org.cesjo.sgi.domain.audit.AuditRepository;
import br.org.cesjo.sgi.domain.audit.AuditResult;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class AuditRepositoryAdapter implements AuditRepository {
    
    private final AuditEntityRepository repository;
    private final ObjectMapper objectMapper;

    public AuditRepositoryAdapter(AuditEntityRepository repository, ObjectMapper objectMapper) {
        this.repository = repository;
        this.objectMapper = objectMapper;
    }

    @Override
    public Audit save(Audit audit) {
        var entity = toEntity(audit);
        var savedEntity = repository.save(entity);
        return toDomain(savedEntity);
    }

    @Override
    public Optional<Audit> findById(Long id) {
        return repository.findById(id).map(this::toDomain);
    }

    @Override
    public List<Audit> findByUserId(String userId) {
        return repository.findByUserId(userId).stream()
                .map(this::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public List<Audit> findByEntityNameAndEntityId(String entityName, String entityId) {
        return repository.findByEntityNameAndEntityId(entityName, entityId).stream()
                .map(this::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public List<Audit> findByAction(AuditAction action) {
        return repository.findByAction(action).stream()
                .map(this::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public List<Audit> findByResult(AuditResult result) {
        return repository.findByResult(result).stream()
                .map(this::toDomain)
                .collect(Collectors.toList());
    }

    private AuditEntity toEntity(Audit audit) {
        var entity = new AuditEntity();
        entity.setEntityName(audit.getEntityName());
        entity.setEntityId(audit.getEntityId());
        entity.setAction(audit.getAction());
        entity.setUserId(audit.getUserId());
        entity.setUsername(audit.getUsername());
        entity.setTimestamp(audit.getTimestamp());
        entity.setClientIp(audit.getClientIp());
        entity.setUserAgent(audit.getUserAgent());
        entity.setDescription(audit.getDescription());
        entity.setResult(audit.getResult());
        entity.setErrorMessage(audit.getErrorMessage());
        
        // Convert maps to JSON strings
        if (audit.getOldValues() != null) {
            entity.setOldValues(mapToJson(audit.getOldValues()));
        }
        if (audit.getNewValues() != null) {
            entity.setNewValues(mapToJson(audit.getNewValues()));
        }
        
        return entity;
    }

    private Audit toDomain(AuditEntity entity) {
        var audit = new Audit(
            entity.getEntityName(),
            entity.getEntityId(),
            entity.getAction(),
            entity.getUserId(),
            entity.getUsername()
        );
        
        audit.setClientIp(entity.getClientIp());
        audit.setUserAgent(entity.getUserAgent());
        audit.setDescription(entity.getDescription());
        audit.setResult(entity.getResult());
        audit.setErrorMessage(entity.getErrorMessage());
        
        // Convert JSON strings back to maps
        if (entity.getOldValues() != null) {
            audit.setOldValues(jsonToMap(entity.getOldValues()));
        }
        if (entity.getNewValues() != null) {
            audit.setNewValues(jsonToMap(entity.getNewValues()));
        }
        
        return audit;
    }

    private String mapToJson(Map<String, Object> map) {
        try {
            return objectMapper.writeValueAsString(map);
        } catch (JsonProcessingException e) {
            return "{}";
        }
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> jsonToMap(String json) {
        try {
            return objectMapper.readValue(json, Map.class);
        } catch (JsonProcessingException e) {
            return Map.of();
        }
    }
}
