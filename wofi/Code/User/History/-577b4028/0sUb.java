package br.org.cesjo.sgi.domain.rbac;

import java.util.Objects;
import java.util.Set;

public class AccessPolicy {
    private final String name;
    private final String resource;
    private final String description;
    private final PolicyCondition condition;
    private final Set<String> allowedRoles;
    private final boolean isActive;

    public AccessPolicy(String name, String resource, String description, 
                       PolicyCondition condition, Set<String> allowedRoles, boolean isActive) {
        this.name = Objects.requireNonNull(name, "Policy name cannot be null");
        this.resource = Objects.requireNonNull(resource, "Resource cannot be null");
        this.description = description;
        this.condition = condition;
        this.allowedRoles = allowedRoles;
        this.isActive = isActive;
    }

    public boolean evaluate(PolicyContext context) {
        if (!isActive) {
            return false;
        }

        // Check if user has required role
        boolean hasRequiredRole = allowedRoles == null || allowedRoles.isEmpty() ||
                context.getUserRoles().stream().anyMatch(allowedRoles::contains);

        if (!hasRequiredRole) {
            return false;
        }

        // Apply custom condition if exists
        return condition == null || condition.evaluate(context);
    }

    public String getName() {
        return name;
    }

    public String getResource() {
        return resource;
    }

    public String getDescription() {
        return description;
    }

    public PolicyCondition getCondition() {
        return condition;
    }

    public Set<String> getAllowedRoles() {
        return allowedRoles;
    }

    public boolean isActive() {
        return isActive;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        AccessPolicy that = (AccessPolicy) o;
        return Objects.equals(name, that.name) && Objects.equals(resource, that.resource);
    }

    @Override
    public int hashCode() {
        return Objects.hash(name, resource);
    }
}
