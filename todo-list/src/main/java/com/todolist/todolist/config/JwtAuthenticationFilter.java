package com.todolist.todolist.config;

import com.todolist.todolist.token.Token;
import com.todolist.todolist.token.TokenRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.servlet.HandlerExceptionResolver;

import java.io.IOException;
import java.util.Optional;


//@Component
// I've created a bean of JwtAuthenticationFilter in SecurityConfiguration class that why I've removed Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final HandlerExceptionResolver exceptionResolver;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private TokenRepository tokenRepository;

    @Autowired
    public JwtAuthenticationFilter(@Qualifier("handlerExceptionResolver") HandlerExceptionResolver exceptionResolver) {
        this.exceptionResolver = exceptionResolver;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        final String authHeader = request.getHeader(("Authorization"));
        try{
            if(authHeader == null || !authHeader.startsWith("Bearer")){
                filterChain.doFilter(request, response);
                return;
            }
            final String jwt = authHeader.substring(7);
            final String userEmail = jwtService.extractUserName(jwt);
            // check if the userEmail is not null and not authenticated
            if(userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null){
                UserDetails userDetails = userDetailsService.loadUserByUsername(userEmail);

                // Check if the generated user token stored in TOKEN table is valid (true).
                boolean isTokenValid = tokenRepository.findByToken(jwt)
                        .map(t -> !t.isExpired() && !t.isRevoked())
                        .orElse(false);

                if(jwtService.isTokenValid(jwt, userDetails) && isTokenValid){
                    // if the token valid we create the authentication token to represent this authenticated user
                    // within the spring security framework
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );
                    // this line set additional information to authentication token, typically include information such as
                    // user's ip address, session ID and so on.
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    // this line set the authentication token in the security context holder
                    // this is effectively authenticate the user for current session or request.
                    // we're typically telling spring security to let the current user access the protected resources.
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }

            }
            // After checking the JWT validation, we need to pass the hand to the next filers to be executed.
            filterChain.doFilter(request, response);
        } catch (Exception ex){
            exceptionResolver.resolveException(request, response, null, ex);
        }
    }
}
