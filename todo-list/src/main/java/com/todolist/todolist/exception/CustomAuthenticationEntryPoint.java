package com.todolist.todolist.exception;

import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.ServletException;
import java.io.IOException;

public class CustomAuthenticationEntryPoint implements AuthenticationEntryPoint {

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response,
                         AuthenticationException authException) throws IOException, ServletException {
        // Set the response status to 403 Forbidden
        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        // Set the content type to application/json
        response.setContentType("application/json;charset=UTF-8");
        // Write a custom message to the response body
        response.getWriter().write("{\"error\": \"Access denied. Please provide a valid token.\"}");
    }
}
