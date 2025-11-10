package br.org.cesjo.sgi.domain.audit;

public enum AuditAction {
    CREATE("CREATE"),
    READ("READ"),
    UPDATE("UPDATE"),
    DELETE("DELETE"),
    LOGIN("LOGIN"),
    LOGOUT("LOGOUT"),
    PERMISSION_GRANTED("PERMISSION_GRANTED"),
    PERMISSION_DENIED("PERMISSION_DENIED"),
    ROLE_ASSIGNED("ROLE_ASSIGNED"),
    ROLE_REMOVED("ROLE_REMOVED");

    private final String description;

    AuditAction(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
