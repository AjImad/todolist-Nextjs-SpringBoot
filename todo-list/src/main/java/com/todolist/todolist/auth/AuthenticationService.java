package com.todolist.todolist.auth;

import com.todolist.todolist.config.JwtService;
import com.todolist.todolist.user.User;
import com.todolist.todolist.user.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationService {

    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthenticationService(
            PasswordEncoder passwordEncoder,
            UserRepository userRepository,
            JwtService jwtService,
            AuthenticationManager authenticationManager
    ) {
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
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
        return new AuthenticationResponse(jwt);
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

        String jwt = jwtService.generateToken(storedUser);

        return new AuthenticationResponse(jwt);
    }
}
