package br.org.cesjo.sgi.infra.persistence;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;

@Entity
public class UserEntity {
  @Id
  @GeneratedValue()
  private Long id;
}
