package com.todolist.todolist.config;

import com.todolist.todolist.exception.CustomAuthenticationEntryPoint;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.web.servlet.HandlerExceptionResolver;

@Configuration
@EnableWebSecurity // this annotation allowing spring boot to know that this is where we're keeping our security configuration
@EnableMethodSecurity
public class SecurityConfiguration {

    @Autowired
    @Qualifier("handlerExceptionResolver")
    private HandlerExceptionResolver exceptionResolver;

    private final LogoutHandler logoutHandler;

    private final AuthenticationProvider authenticationProvider;

    @Bean
    public JwtAuthenticationFilter jwtAuthFilter(){
        return new JwtAuthenticationFilter(exceptionResolver);
    }

    public SecurityConfiguration (
            AuthenticationProvider authenticationProvider,
            LogoutHandler logoutHandler
    ){
        this.authenticationProvider = authenticationProvider;
        this.logoutHandler = logoutHandler;
    }

    @Bean
    SecurityFilterChain securityFilterChain (HttpSecurity http) throws Exception {
            http
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests((request) -> request
                        .requestMatchers("/api/auth/**").permitAll()
                        .anyRequest().authenticated()
                )
                .sessionManagement((session) -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authenticationProvider(authenticationProvider)
                .exceptionHandling(exception -> exception.authenticationEntryPoint(new CustomAuthenticationEntryPoint()))
                // UsernamePasswordAuthenticationFilter is a standard filter provided by spring security that intercepts
                // login request (Post request, /login) also called the form login filter.
                // By placing jwtAuthFilter before the form login filter we make sure that JWT tokens are checked
                // before the application tries to process any username/password authentication.
                .addFilterBefore(jwtAuthFilter(), UsernamePasswordAuthenticationFilter.class)
                    .logout((logout) -> logout
                            .logoutUrl("/api/auth/logout")
                            .addLogoutHandler(logoutHandler)
                            .logoutSuccessHandler((request, response, authenticate) -> SecurityContextHolder.clearContext())
                    );

            return http.build();
    }
}
