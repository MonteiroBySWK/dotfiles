package br.org.cesjo.sgi.domain.rbac;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Set;

public class PolicyContext {
    private final String userId;
    private final Set<String> userRoles;
    private final String resource;
    private final String action;
    private final String clientIp;
    private final LocalDateTime timestamp;
    private final Map<String, Object> attributes;

    public PolicyContext(String userId, Set<String> userRoles, String resource, 
                        String action, String clientIp, Map<String, Object> attributes) {
        this.userId = userId;
        this.userRoles = userRoles;
        this.resource = resource;
        this.action = action;
        this.clientIp = clientIp;
        this.timestamp = LocalDateTime.now();
        this.attributes = attributes;
    }

    public String getUserId() {
        return userId;
    }

    public Set<String> getUserRoles() {
        return userRoles;
    }

    public String getResource() {
        return resource;
    }

    public String getAction() {
        return action;
    }

    public String getClientIp() {
        return clientIp;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public Map<String, Object> getAttributes() {
        return attributes;
    }

    public Object getAttribute(String key) {
        return attributes != null ? attributes.get(key) : null;
    }
}
