package com.todolist.todolist.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.security.SignatureException;

@RestControllerAdvice
public class CustomHandlerException {

    @ExceptionHandler(Exception.class)
    public ProblemDetail handleSecurityException(Exception ex){
        ProblemDetail errorDetail = null;
        if(ex instanceof BadCredentialsException){
            errorDetail = ProblemDetail.forStatusAndDetail(HttpStatus.valueOf(401), ex.getMessage());
            errorDetail.setProperty("access_denied_reason", "Bad credentials!");
        }
        if(ex instanceof UsernameNotFoundException){
            System.out.println("message: " + ex.getMessage());
            errorDetail = ProblemDetail.forStatusAndDetail(HttpStatus.valueOf(403), ex.getMessage());
            errorDetail.setProperty("access_denied_reason", "User not found!");
        }
        if(ex instanceof io.jsonwebtoken.security.SignatureException){
            errorDetail = ProblemDetail.forStatusAndDetail(HttpStatus.valueOf(403), ex.getMessage());
            errorDetail.setProperty("access_denied_reason", "JWT token not valid!");
        }
        return errorDetail;
    }

}
