package br.org.cesjo.sgi.infra.security;

import br.org.cesjo.sgi.domain.user.User;
import br.org.cesjo.sgi.domain.user.UserRepository;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.stream.Collectors;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        return UserPrincipal.create(user);
    }

    public static class UserPrincipal implements UserDetails {
        private final String id;
        private final String username;
        private final String email;
        private final String password;
        private final boolean active;
        private final boolean locked;
        private final Collection<? extends GrantedAuthority> authorities;

        public UserPrincipal(String id, String username, String email, String password, 
                             boolean active, boolean locked, Collection<? extends GrantedAuthority> authorities) {
            this.id = id;
            this.username = username;
            this.email = email;
            this.password = password;
            this.active = active;
            this.locked = locked;
            this.authorities = authorities;
        }

        public static UserPrincipal create(User user) {
            Collection<GrantedAuthority> authorities = user.getRoles().stream()
                    .flatMap(role -> {
                        var roleAuthority = new SimpleGrantedAuthority("ROLE_" + role.getName());
                        var permissionAuthorities = role.getPermissions().stream()
                                .map(permission -> new SimpleGrantedAuthority(permission.getFullPermission()));
                        return java.util.stream.Stream.concat(
                                java.util.stream.Stream.of(roleAuthority),
                                permissionAuthorities
                        );
                    })
                    .collect(Collectors.toList());

            return new UserPrincipal(
                    user.getId(),
                    user.getUsername(),
                    user.getEmail(),
                    user.getPassword(),
                    user.isActive(),
                    user.isLocked(),
                    authorities
            );
        }

        public String getId() {
            return id;
        }

        public String getEmail() {
            return email;
        }

        @Override
        public String getUsername() {
            return username;
        }

        @Override
        public String getPassword() {
            return password;
        }

        @Override
        public Collection<? extends GrantedAuthority> getAuthorities() {
            return authorities;
        }

        @Override
        public boolean isAccountNonExpired() {
            return true;
        }

        @Override
        public boolean isAccountNonLocked() {
            return !locked;
        }

        @Override
        public boolean isCredentialsNonExpired() {
            return true;
        }

        @Override
        public boolean isEnabled() {
            return active;
        }
    }
}
