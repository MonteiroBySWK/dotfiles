package br.org.cesjo.sgi.domain.rbac;

import java.util.List;
import java.util.Optional;

public interface PermissionRepository {
    Permission save(Permission permission);
    Optional<Permission> findByName(String name);
    List<Permission> findByResource(String resource);
    List<Permission> findAll();
    void delete(Permission permission);
    boolean existsByName(String name);
}
