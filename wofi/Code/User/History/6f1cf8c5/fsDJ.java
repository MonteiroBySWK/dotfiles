package br.org.cesjo.sgi.infra.persistence.user;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JpaUserRepository extends JpaRepository<UserEntity, UUID>{
    UserEntity findByUsername(String username);
}
