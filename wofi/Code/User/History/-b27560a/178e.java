package br.org.cesjo.sgi.infra.config;

import br.org.cesjo.sgi.application.usecases.auth.RegistrationService;
import br.org.cesjo.sgi.domain.rbac.BaseRole;
import br.org.cesjo.sgi.domain.rbac.Role;
import br.org.cesjo.sgi.domain.rbac.RoleRepository;
import br.org.cesjo.sgi.domain.user.UserRepository;

import java.util.Set;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {
    private final RoleRepository roleRepository;
    private final RegistrationService registrationService;

    public DataInitializer(RoleRepository roleRepository, RegistrationService registrationService) {
        this.roleRepository = roleRepository;
        this.registrationService = registrationService;
    }

    @Override
    public void run(String... args) throws Exception {
        for (BaseRole baseRole : BaseRole.values()) {
            createRoleIfNotExists("ROLE_" + baseRole.getName(), baseRole.getDescription());
        }
    }

    private void createRoleIfNotExists(String name, String description) {
        if (!roleRepository.existsByName(name)) {
            Role role = new Role(name, description);
            roleRepository.save(role);
        }
    }

    private void createFirstUser() {
        Set<String> roles;
        roles.add("ADMINISTRATIVE");
        registrationService.registerUser("admin", "admin@admin.com", "12345678", roles, null, null); 
    }
}
