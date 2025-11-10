package br.org.cesjo.sgi.domain.audit;

import java.util.Date;

import br.org.cesjo.sgi.domain.user.User;

public class Audit {
  private Long id;
  private String operation;
  private Date dateOperation;
  private User user;

  public Audit(String operation) {
    this.operation = operation;
  }
}
