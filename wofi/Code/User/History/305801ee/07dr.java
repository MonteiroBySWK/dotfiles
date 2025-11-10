package br.org.cesjo.sgi.domain.rbac;

import java.util.List;
import java.util.Optional;

public interface RoleRepository {
    Role save(Role role);
    Optional<Role> findByName(String name);
    List<Role> findAll();
    void delete(Role role);
    boolean existsByName(String name);
}
