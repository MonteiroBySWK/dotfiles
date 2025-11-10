package br.org.cesjo.sgi.domain.audit;

public enum AuditResult {
    SUCCESS("SUCCESS"),
    ERROR("ERROR"),
    WARNING("WARNING"),
    ACCESS_DENIED("ACCESS_DENIED");

    private final String description;

    AuditResult(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
