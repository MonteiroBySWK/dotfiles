package br.org.cesjo.sgi.infra.config;

import br.org.cesjo.sgi.application.usecases.auth.RegistrationService;
import br.org.cesjo.sgi.domain.rbac.BaseRole;
import br.org.cesjo.sgi.domain.rbac.Role;
import br.org.cesjo.sgi.domain.rbac.RoleRepository;
import br.org.cesjo.sgi.domain.user.UserRepository;

import java.util.HashSet;
import java.util.Set;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {
    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final RegistrationService registrationService;

    public DataInitializer(RoleRepository roleRepository, UserRepository userRepository, RegistrationService registrationService) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.registrationService = registrationService;
    }

    @Override
    public void run(String... args) throws Exception {
        // Criar roles baseadas no enum BaseRole
        for (BaseRole baseRole : BaseRole.values()) {
            createRoleIfNotExists(baseRole.getName(), baseRole.getDescription());
        }
        
        createFirstUser();
    }

    private void createRoleIfNotExists(String name, String description) {
        if (!roleRepository.existsByName(name)) {
            Role role = new Role(name, description);
            roleRepository.save(role);
        }
    }

    private void createFirstUser() {
        // Verificar se já existe um usuário admin
        if (userRepository.existsByUsername("admin")) {
            return;
        }
        
        Set<String> roles = new HashSet<>();
        roles.add("ADMINISTRATIVE");
        
        try {
            registrationService.registerUser("admin", "admin@admin.com", "12345678", roles, "system", "system");
            System.out.println("Usuário administrativo criado: admin");
        } catch (Exception e) {
            System.out.println("Erro ao criar usuário admin: " + e.getMessage());
        }
    }
}
