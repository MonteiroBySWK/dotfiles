package br.org.cesjo.sgi.infra.config;

import br.org.cesjo.sgi.application.usecases.audit.AuditService;
import br.org.cesjo.sgi.application.usecases.rbac.AccessControlService;
import br.org.cesjo.sgi.domain.audit.AuditRepository;
import br.org.cesjo.sgi.domain.rbac.AccessPolicyRepository;
import br.org.cesjo.sgi.domain.rbac.PermissionRepository;
import br.org.cesjo.sgi.domain.rbac.RoleRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.EnableAspectJAutoProxy;

@Configuration
@EnableAspectJAutoProxy
public class RbacConfiguration {

    @Bean
    public AccessControlService accessControlService(
            RoleRepository roleRepository,
            PermissionRepository permissionRepository,
            AccessPolicyRepository policyRepository,
            AuditRepository auditRepository) {
        return new AccessControlService(roleRepository, permissionRepository, policyRepository, auditRepository);
    }

    @Bean
    public AuditService auditService(AuditRepository auditRepository) {
        return new AuditService(auditRepository);
    }

    @Bean
    public ObjectMapper objectMapper() {
        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        return mapper;
    }
}
