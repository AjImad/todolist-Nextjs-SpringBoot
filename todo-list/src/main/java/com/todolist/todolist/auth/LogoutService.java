package com.todolist.todolist.auth;

import com.todolist.todolist.token.TokenRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.stereotype.Service;

import java.net.http.HttpHeaders;

@Service
public class LogoutService implements LogoutHandler {

    private final TokenRepository tokenRepository;

    public LogoutService(TokenRepository tokenRepository){
        this.tokenRepository = tokenRepository;
    }

    @Override
    public void logout(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) {
        final String authHeader = request.getHeader("Authorization");
        if(authHeader == null || !authHeader.startsWith("Bearer ")){
            return;
        }
        final String jwt = authHeader.substring(7);
        var storedToken = tokenRepository.findByToken(jwt).orElseThrow(() -> new IllegalStateException("Token not found!"));
        storedToken.setExpired(true);
        storedToken.setRevoked(true);

        tokenRepository.save(storedToken);
    }
}
