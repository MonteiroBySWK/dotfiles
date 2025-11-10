package br.org.cesjo.sgi.infra.persistence.rbac;

import br.org.cesjo.sgi.domain.rbac.Role;
import br.org.cesjo.sgi.domain.rbac.Permission;
import br.org.cesjo.sgi.domain.rbac.RoleRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class RoleRepositoryAdapter implements RoleRepository {
    
    private final RoleEntityRepository repository;

    public RoleRepositoryAdapter(RoleEntityRepository repository) {
        this.repository = repository;
    }

    @Override
    public Role save(Role role) {
        var entity = toEntity(role);
        var savedEntity = repository.save(entity);
        return toDomain(savedEntity);
    }

    @Override
    public Optional<Role> findByName(String name) {
        return repository.findById(name).map(this::toDomain);
    }

    @Override
    public List<Role> findAll() {
        return repository.findAll().stream()
                .map(this::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public void delete(Role role) {
        repository.deleteById(role.getName());
    }

    @Override
    public boolean existsByName(String name) {
        return repository.existsByName(name);
    }

    private RoleEntity toEntity(Role role) {
        var entity = new RoleEntity(role.getName(), role.getDescription());
        
        var permissionEntities = role.getPermissions().stream()
                .map(this::toPermissionEntity)
                .collect(Collectors.toSet());
        
        entity.setPermissions(permissionEntities);
        return entity;
    }

    private Role toDomain(RoleEntity entity) {
        var permissions = entity.getPermissions().stream()
                .map(this::toPermissionDomain)
                .collect(Collectors.toSet());
        
        return new Role(entity.getName(), entity.getDescription(), permissions);
    }

    private PermissionEntity toPermissionEntity(Permission permission) {
        return new PermissionEntity(
            permission.getName(),
            permission.getResource(),
            permission.getAction(),
            permission.getDescription()
        );
    }

    private Permission toPermissionDomain(PermissionEntity entity) {
        return new Permission(
            entity.getName(),
            entity.getResource(),
            entity.getAction(),
            entity.getDescription()
        );
    }
}
