package br.org.cesjo.sgi.infra.persistence.rbac;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PermissionEntityRepository extends JpaRepository<PermissionEntity, String> {
    List<PermissionEntity> findByResource(String resource);
    boolean existsByName(String name);
}
