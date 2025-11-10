package br.org.cesjo.sgi.domain.rbac;

import java.util.Collections;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

public class Role {
    private final String name;
    private final String description;
    private final Set<Permission> permissions;

    public Role(String name, String description) {
        this.name = Objects.requireNonNull(name, "Role name cannot be null");
        this.description = description;
        this.permissions = new HashSet<>();
    }

    public Role(String name, String description, Set<Permission> permissions) {
        this.name = Objects.requireNonNull(name, "Role name cannot be null");
        this.description = description;
        this.permissions = new HashSet<>(permissions != null ? permissions : Collections.emptySet());
    }

    public void addPermission(Permission permission) {
        Objects.requireNonNull(permission, "Permission cannot be null");
        this.permissions.add(permission);
    }

    public void removePermission(Permission permission) {
        this.permissions.remove(permission);
    }

    public boolean hasPermission(Permission permission) {
        return this.permissions.contains(permission);
    }

    public boolean hasPermission(String resource, String action) {
        return this.permissions.stream()
                .anyMatch(p -> p.getResource().equals(resource) && p.getAction().equals(action));
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public Set<Permission> getPermissions() {
        return Collections.unmodifiableSet(permissions);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Role role = (Role) o;
        return Objects.equals(name, role.name);
    }

    @Override
    public int hashCode() {
        return Objects.hash(name);
    }

    @Override
    public String toString() {
        return "Role{" +
                "name='" + name + '\'' +
                ", description='" + description + '\'' +
                ", permissions=" + permissions.size() +
                '}';
    }
}
