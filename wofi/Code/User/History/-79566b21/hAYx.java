package br.org.cesjo.sgi.domain.rbac;

import java.util.Objects;

public class Permission {
    private final String name;
    private final String resource;
    private final String action;
    private final String description;

    public Permission(String name, String resource, String action, String description) {
        this.name = Objects.requireNonNull(name, "Permission name cannot be null");
        this.resource = Objects.requireNonNull(resource, "Resource cannot be null");
        this.action = Objects.requireNonNull(action, "Action cannot be null");
        this.description = description;
    }

    public String getName() {
        return name;
    }

    public String getResource() {
        return resource;
    }

    public String getAction() {
        return action;
    }

    public String getDescription() {
        return description;
    }

    public String getFullPermission() {
        return resource + ":" + action;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Permission that = (Permission) o;
        return Objects.equals(name, that.name) &&
               Objects.equals(resource, that.resource) &&
               Objects.equals(action, that.action);
    }

    @Override
    public int hashCode() {
        return Objects.hash(name, resource, action);
    }

    @Override
    public String toString() {
        return "Permission{" +
                "name='" + name + '\'' +
                ", resource='" + resource + '\'' +
                ", action='" + action + '\'' +
                '}';
    }
}
