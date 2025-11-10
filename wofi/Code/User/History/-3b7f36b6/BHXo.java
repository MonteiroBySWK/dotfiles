package br.org.cesjo.sgi.domain;

public class User {
  private Long id;
  private String username;
  private String email;
  private String password; // Precisa ser um Hash  

  public User() {
  }

  public User(String username, String email, String password) {
    
    
    this.username = username;
    this.email = email;
    this.password = password;
  }

  private boolean validate() throws Exception {
    if (this.username == null) {
        throw new Exception("Username is null");
    }

    return true;
  }

}
