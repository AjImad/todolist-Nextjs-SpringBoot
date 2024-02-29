package com.todolist.todolist.auth;

import com.todolist.todolist.config.JwtService;
import com.todolist.todolist.token.Token;
import com.todolist.todolist.token.TokenRepository;
import com.todolist.todolist.user.User;
import com.todolist.todolist.user.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AuthenticationService {

    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    private final TokenRepository tokenRepository;

    public AuthenticationService(
            PasswordEncoder passwordEncoder,
            UserRepository userRepository,
            JwtService jwtService,
            AuthenticationManager authenticationManager,
            TokenRepository tokenRepository
    ) {
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.tokenRepository = tokenRepository;
    }

    public AuthenticationResponse register(RegisterRequest registerRequest) {
        var user = new User(
                registerRequest.getFirstname(),
                registerRequest.getLastname(),
                registerRequest.getEmail(),
                passwordEncoder.encode(registerRequest.getPassword())
        );
        userRepository.save(user);
        String jwt = jwtService.generateToken(user);
        saveUserToken(jwt, user);
        return new AuthenticationResponse(
                user.getId(),
                user.getFirstname(),
                user.getLastname(),
                user.getEmail(),
                jwt
        );
    }

    private void saveUserToken(String jwt, User user) {
        var token = new Token(
                jwt,
                false,
                false,
                user
        );
        tokenRepository.save(token);
    }

    public AuthenticationResponse authenticate(AuthenticationRequest authRequest) {
        // UsernamePasswordAuthenticationToken represent the authentication request.
        // When you create an instance of UsernamePasswordAuthenticationToken you're essentially packaging
        // the authentication data (user's email and password) that need to be verified.
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                authRequest.getEmail(),
                authRequest.getPassword()
        ));
        var storedUser = userRepository.findUserByEmail(authRequest.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("User with email not found!"));
        revokeAllValidTokens(storedUser);
        String jwt = jwtService.generateToken(storedUser);
        saveUserToken(jwt, storedUser);
        return new AuthenticationResponse(
                storedUser.getId(),
                storedUser.getFirstname(),
                storedUser.getLastname(),
                storedUser.getEmail(),
                jwt
        );
    }

    public void revokeAllValidTokens(User user){
        List<Token> tokens = tokenRepository.findAllValidTokens(user.getId());
        if(tokens.isEmpty()){
            return;
        }
        tokens.forEach(t -> {
            t.setExpired(true);
            t.setRevoked(true);
        });
        tokenRepository.saveAll(tokens);
    }
}
