package br.org.cesjo.sgi.infra.persistence.user;

import br.org.cesjo.sgi.domain.rbac.Role;
import br.org.cesjo.sgi.domain.user.User;
import br.org.cesjo.sgi.domain.user.UserRepository;
import br.org.cesjo.sgi.infra.persistence.rbac.RoleEntity;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
public class UserRepositoryAdapter implements UserRepository {
    
    private final UserEntityRepository repository;

    public UserRepositoryAdapter(UserEntityRepository repository) {
        this.repository = repository;
    }

    @Override
    public User save(User user) {
        var entity = toEntity(user);
        var savedEntity = repository.save(entity);
        return toDomain(savedEntity);
    }

    @Override
    public Optional<User> findById(UUID id) {
        return repository.findById(id).map(this::toDomain);
    }

    @Override
    public Optional<User> findByUsername(String username) {
        return repository.findByUsername(username).map(this::toDomain);
    }

    @Override
    public Optional<User> findByEmail(String email) {
        return repository.findByEmail(email).map(this::toDomain);
    }

    @Override
    public List<User> findAll() {
        return repository.findAll().stream()
                .map(this::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public boolean existsByUsername(String username) {
        return repository.existsByUsername(username);
    }

    @Override
    public boolean existsByEmail(String email) {
        return repository.existsByEmail(email);
    }

    @Override
    public void delete(User user) {
        repository.deleteById(user.getId());
    }

    private UserEntity toEntity(User user) {
        var entity = new UserEntity(user.getUsername(), user.getEmail(), user.getPassword());
        entity.setActive(user.isActive());
        entity.setLocked(user.isLocked());
        entity.setCreatedAt(user.getCreatedAt());
        entity.setLastLogin(user.getLastLogin());
        entity.setFailedLoginAttempts(user.getFailedLoginAttempts());
        
        var roleEntities = user.getRoles().stream()
                .map(this::toRoleEntity)
                .collect(Collectors.toSet());
        entity.setRoles(roleEntities);
        
        return entity;
    }

    private User toDomain(UserEntity entity) {
        var user = new User(entity.getUsername(), entity.getEmail(), entity.getPassword());
        user.setId(entity.getId());
        user.setActive(entity.isActive());
        user.setLocked(entity.isLocked());
        
        // Convert entity roles to domain
        entity.getRoles().forEach(roleEntity -> {
            var role = toRoleDomain(roleEntity);
            user.addRole(role);
        });
        
        return user;
    }

    private RoleEntity toRoleEntity(Role role) {
        var entity = new RoleEntity(role.getName(), role.getDescription());
        // Add permissions conversion if needed
        return entity;
    }

    private Role toRoleDomain(RoleEntity entity) {
        // Convert permissions if needed
        return new Role(entity.getName(), entity.getDescription());
    }
}
