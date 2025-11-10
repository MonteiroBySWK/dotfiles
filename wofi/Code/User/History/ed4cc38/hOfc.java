package br.org.cesjo.sgi.infra.persistence.rbac;

import br.org.cesjo.sgi.domain.rbac.Permission;
import br.org.cesjo.sgi.domain.rbac.PermissionRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class PermissionRepositoryAdapter implements PermissionRepository {
    
    private final PermissionEntityRepository repository;

    public PermissionRepositoryAdapter(PermissionEntityRepository repository) {
        this.repository = repository;
    }

    @Override
    public Permission save(Permission permission) {
        var entity = toEntity(permission);
        var savedEntity = repository.save(entity);
        return toDomain(savedEntity);
    }

    @Override
    public Optional<Permission> findByName(String name) {
        return repository.findById(name).map(this::toDomain);
    }

    @Override
    public List<Permission> findByResource(String resource) {
        return repository.findByResource(resource).stream()
                .map(this::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public List<Permission> findAll() {
        return repository.findAll().stream()
                .map(this::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public void delete(Permission permission) {
        repository.deleteById(permission.getName());
    }

    @Override
    public boolean existsByName(String name) {
        return repository.existsByName(name);
    }

    private PermissionEntity toEntity(Permission permission) {
        return new PermissionEntity(
            permission.getName(),
            permission.getResource(),
            permission.getAction(),
            permission.getDescription()
        );
    }

    private Permission toDomain(PermissionEntity entity) {
        return new Permission(
            entity.getName(),
            entity.getResource(),
            entity.getAction(),
            entity.getDescription()
        );
    }
}
