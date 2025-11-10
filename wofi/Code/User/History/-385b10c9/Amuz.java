package br.org.cesjo.sgi.application.usecases.auth;

import br.org.cesjo.sgi.domain.rbac.RoleRepository;
import br.org.cesjo.sgi.domain.user.User;
import br.org.cesjo.sgi.domain.user.UserRepository;
import br.org.cesjo.sgi.application.usecases.audit.AuditService;
import br.org.cesjo.sgi.domain.audit.AuditAction;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Objects;
import java.util.Set;

@Service
public class RegistrationService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuditService auditService;

    public RegistrationService(
            UserRepository userRepository,
            RoleRepository roleRepository,
            PasswordEncoder passwordEncoder,
            AuditService auditService
    ) {
        this.userRepository = Objects.requireNonNull(userRepository);
        this.roleRepository = Objects.requireNonNull(roleRepository);
        this.passwordEncoder = Objects.requireNonNull(passwordEncoder);
        this.auditService = Objects.requireNonNull(auditService);
    }

    public User registerUser(String username, String email, String password, Set<String> roleNames, String creatorId, String creatorUsername) {
        // Validate input
        if (username == null || username.trim().isEmpty()) {
            throw new IllegalArgumentException("Username cannot be empty");
        }
        if (email == null || email.trim().isEmpty()) {
            throw new IllegalArgumentException("Email cannot be empty");
        }
        if (password == null || password.trim().isEmpty()) {
            throw new IllegalArgumentException("Password cannot be empty");
        }

        // Check if user already exists
        if (userRepository.existsByUsername(username)) {
            throw new IllegalArgumentException("Username already exists: " + username);
        }
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email already exists: " + email);
        }

        // Create user
        String encodedPassword = passwordEncoder.encode(password);
        User user = new User(username, email, encodedPassword);

        // Assign roles
        if (roleNames != null && !roleNames.isEmpty()) {
            roleNames.forEach(roleName -> {
                var role = roleRepository.findByName(roleName)
                        .orElseThrow(() -> new IllegalArgumentException("Role not found: " + roleName));
                user.addRole(role);
            });
        } else {
            // Assign default role if none specified
            var defaultRole = roleRepository.findByName("USER")
                    .orElseThrow(() -> new IllegalStateException("Default role 'USER' not found"));
            user.addRole(defaultRole);
        }

        // Save user
        User savedUser = userRepository.save(user);

        // Audit
        auditService.audit(
                "User",
                savedUser.getId(),
                AuditAction.CREATE,
                creatorId,
                creatorUsername,
                "User registered: " + username
        );

        return savedUser;
    }

    public User registerUser(String username, String email, String password) {
        return registerUser(username, email, password, null, "system", "system");
    }
}
