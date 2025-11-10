package br.org.cesjo.sgi.infra.config;

import br.org.cesjo.sgi.domain.rbac.BaseRole;
import br.org.cesjo.sgi.domain.rbac.Role;
import br.org.cesjo.sgi.domain.rbac.RoleRepository;
import br.org.cesjo.sgi.domain.user.UserRepository;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {
    private final RoleRepository roleRepository;
    private final UserRepository userRepository;

    public DataInitializer(RoleRepository roleRepository, UserRepository userRepository) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
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
        
    }
}
