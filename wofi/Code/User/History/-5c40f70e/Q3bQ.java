package br.org.cesjo.sgi.domain.user;

public interface UserRepository {
  User createUser();
  User findByUsername();
  void removeRole(UserRole role);
  void addRole(UserRole role);
}
