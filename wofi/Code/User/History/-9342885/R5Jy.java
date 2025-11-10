package br.org.cesjo.sgi.infra.tests;

import br.org.cesjo.sgi.application.usecases.auth.AuthenticationService;
import br.org.cesjo.sgi.application.usecases.rbac.AccessControlService;
import br.org.cesjo.sgi.domain.user.UserRepository;
import br.org.cesjo.sgi.domain.rbac.RoleRepository;
import br.org.cesjo.sgi.domain.rbac.PermissionRepository;
import br.org.cesjo.sgi.domain.rbac.AccessPolicyRepository;
import br.org.cesjo.sgi.domain.audit.AuditRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.userdetails.UserDetailsService;

import static org.assertj.core.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@DisplayName("Application Context Integration Tests")
class ApplicationContextTest {

    // Mock repositories to avoid database dependencies in tests
    @MockBean
    private UserRepository userRepository;
    
    @MockBean
    private RoleRepository roleRepository;
    
    @MockBean
    private PermissionRepository permissionRepository;
    
    @MockBean
    private AccessPolicyRepository accessPolicyRepository;
    
    @MockBean
    private AuditRepository auditRepository;
    
    @MockBean
    private AuthenticationManager authenticationManager;
    
    @MockBean
    private UserDetailsService userDetailsService;

    @Test
    @DisplayName("Should load application context successfully")
    void shouldLoadApplicationContextSuccessfully() {
        // This test verifies that the Spring context loads correctly
        // with all beans properly configured
        assertThat(true).isTrue();
    }
}
