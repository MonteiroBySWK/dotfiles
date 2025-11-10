package br.org.cesjo.sgi.infra.persistence.rbac;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoleEntityRepository extends JpaRepository<RoleEntity, String> {
    boolean existsByName(String name);
}
