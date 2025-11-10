package br.org.cesjo.sgi.domain.user;

import java.util.Set;

public class User {
  private String username;
  private String password;

  private Set<UserRole> role;

  public User(String username, String password) {
    this.username = username;
    this.password = password;
  }

  public void setRole(UserRole role) {
    if (this.role.contains(role)) {
      this.role.add(role);
    }
  }

  public String getUsername() {
    return username;
  }

  public void setUsername(String username) {
    this.username = username;
  }

  public String getPassword() {
    return password;
  }

  public void setPassword(String password) {
    this.password = password;
  }

  
}
