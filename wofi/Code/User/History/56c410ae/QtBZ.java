package br.org.cesjo.sgi.domain.rbac;

import java.util.List;
import java.util.Optional;

public interface AccessPolicyRepository {
    AccessPolicy save(AccessPolicy policy);
    Optional<AccessPolicy> findByName(String name);
    List<AccessPolicy> findByResource(String resource);
    List<AccessPolicy> findActiveByResource(String resource);
    List<AccessPolicy> findAll();
    void delete(AccessPolicy policy);
}
