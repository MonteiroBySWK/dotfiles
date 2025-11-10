package br.org.cesjo.sgi.infra.security;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import br.org.cesjo.sgi.domain.user.User;
import br.org.cesjo.sgi.domain.user.UserRepository;

@Service
public class AuthorizationService implements UserDetailsService {
    private final UserRepository userRepository;

    public AuthorizationService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
        
        Collection<GrantedAuthority> authorities = user.getRoles().stream()
        .map(role -> {
            String roleName = role.getName();
            // Se já começa com ROLE_, não adicionar novamente
            if (roleName.startsWith("ROLE_")) {
                return new SimpleGrantedAuthority(roleName);
            } else {
                return new SimpleGrantedAuthority("ROLE_" + roleName);
            }
        })
        .collect(Collectors.toList());

        user.getRoles();

        return new AuthorizationDetails(user);
    }
}
