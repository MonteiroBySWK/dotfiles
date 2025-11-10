package br.org.cesjo.sgi.infra.persistence.rbac;

import br.org.cesjo.sgi.domain.rbac.AccessPolicy;
import br.org.cesjo.sgi.domain.rbac.AccessPolicyRepository;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Component
public class InMemoryAccessPolicyRepository implements AccessPolicyRepository {
    
    private final List<AccessPolicy> policies = new ArrayList<>();

    @Override
    public AccessPolicy save(AccessPolicy policy) {
        policies.removeIf(p -> p.getName().equals(policy.getName()));
        policies.add(policy);
        return policy;
    }

    @Override
    public Optional<AccessPolicy> findByName(String name) {
        return policies.stream()
                .filter(p -> p.getName().equals(name))
                .findFirst();
    }

    @Override
    public List<AccessPolicy> findByResource(String resource) {
        return policies.stream()
                .filter(p -> p.getResource().equals(resource))
                .toList();
    }

    @Override
    public List<AccessPolicy> findActiveByResource(String resource) {
        return policies.stream()
                .filter(p -> p.getResource().equals(resource) && p.isActive())
                .toList();
    }

    @Override
    public List<AccessPolicy> findAll() {
        return new ArrayList<>(policies);
    }

    @Override
    public void delete(AccessPolicy policy) {
        policies.removeIf(p -> p.getName().equals(policy.getName()));
    }
}
