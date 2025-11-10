package br.org.cesjo.sgi.domain.audit;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Objects;

public class Audit {
    private Long id;
    private String entityName;
    private String entityId;
    private AuditAction action;
    private String userId;
    private String username;
    private LocalDateTime timestamp;
    private String clientIp;
    private String userAgent;
    private Map<String, Object> oldValues;
    private Map<String, Object> newValues;
    private String description;
    private AuditResult result;
    private String errorMessage;

    public Audit(String entityName, String entityId, AuditAction action, String userId, String username) {
        this.entityName = Objects.requireNonNull(entityName, "Entity name cannot be null");
        this.entityId = entityId;
        this.action = Objects.requireNonNull(action, "Action cannot be null");
        this.userId = userId;
        this.username = username;
        this.timestamp = LocalDateTime.now();
        this.result = AuditResult.SUCCESS;
    }

    public Long getId() {
        return id;
    }

    public String getEntityName() {
        return entityName;
    }

    public String getEntityId() {
        return entityId;
    }

    public AuditAction getAction() {
        return action;
    }

    public String getUserId() {
        return userId;
    }

    public String getUsername() {
        return username;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public String getClientIp() {
        return clientIp;
    }

    public String getUserAgent() {
        return userAgent;
    }

    public Map<String, Object> getOldValues() {
        return oldValues;
    }

    public Map<String, Object> getNewValues() {
        return newValues;
    }

    public String getDescription() {
        return description;
    }

    public AuditResult getResult() {
        return result;
    }

    public String getErrorMessage() {
        return errorMessage;
    }

    // Setters for mutable fields
    public void setClientIp(String clientIp) {
        this.clientIp = clientIp;
    }

    public void setUserAgent(String userAgent) {
        this.userAgent = userAgent;
    }

    public void setOldValues(Map<String, Object> oldValues) {
        this.oldValues = oldValues;
    }

    public void setNewValues(Map<String, Object> newValues) {
        this.newValues = newValues;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setResult(AuditResult result) {
        this.result = result;
    }

    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
        if (errorMessage != null) {
            this.result = AuditResult.ERROR;
        }
    }
}
