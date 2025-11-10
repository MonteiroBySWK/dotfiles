package br.org.cesjo.sgi.domain.rbac;

@FunctionalInterface
public interface PolicyCondition {
    boolean evaluate(PolicyContext context);
}
