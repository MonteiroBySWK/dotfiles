package br.org.cesjo.sgi.domain.user;

import java.util.Optional;
import java.util.UUID;
import java.util.List;

public interface UserRepository {
    User save(User user);
    Optional<User> findById(UUID id);
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    List<User> findAll();
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    void delete(User user);
}
