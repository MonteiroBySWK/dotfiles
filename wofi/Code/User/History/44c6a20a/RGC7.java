package br.org.cesjo.sgi.application.usecases.auth;

import br.org.cesjo.sgi.domain.service.JwtService;
import br.org.cesjo.sgi.domain.user.User;
import br.org.cesjo.sgi.domain.user.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;

public class LoginUserUseCase {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtProvider;

    public LoginUserUseCase(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtProvider = jwtProvider;
    }

    public String execute(String username, String password) throws Exception {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Invalid username or password"));
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new IllegalArgumentException("Invalid username or password");
        }
        return jwtProvider.generateToken(user);
    }

}
