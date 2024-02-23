package com.todolist.todolist.config;

import com.todolist.todolist.user.UserRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class ApplicationConfig {
    private final UserRepository userRepository;

    public ApplicationConfig(UserRepository userRepository){
        this.userRepository = userRepository;
    }

    @Bean
    public UserDetailsService userDetailsService() {
        // userDetailsService fetch current-user data that interact with the application using
        // loadUserByUsername of UserDetailsService interface
        return username -> userRepository.findUserByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("Email with " + username + " not found!"));
    }

    @Bean
    public AuthenticationProvider authenticationProvider () {
        // Dao: Data access object
        // DaoAuthenticationProvider is a provider that uses data access object to retrieve user information form DB.
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        // userDetailsService is an interface that loads the user-specific data (UserDetail object), it used
        // by the DaoAuthenticationProvider to fetch user's details (such as username, password and authorities)
        // during the authentication process.
        authProvider.setUserDetailsService(userDetailsService());
        // this set the passwordEncoder that DaoAuthenticationProvider use to match the stored password with the password
        // provided during the login process, it ensures that the passwords are stored and compared in secure manner.
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

}
