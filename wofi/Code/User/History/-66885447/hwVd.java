package br.org.cesjo.sgi.infra.persistence;

import org.springframework.data.jpa.repository.JpaRepository;

public interface UserEntityRepository extends JpaRepository<UserEntity, Long>{
  
}
