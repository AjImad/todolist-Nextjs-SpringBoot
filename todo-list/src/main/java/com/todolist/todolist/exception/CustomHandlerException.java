package com.todolist.todolist.exception;

import io.jsonwebtoken.ExpiredJwtException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.ServletWebRequest;
import org.springframework.web.context.request.WebRequest;

import java.security.SignatureException;

@RestControllerAdvice
public class CustomHandlerException {

    @ExceptionHandler(value = {UsernameNotFoundException.class})
    public ResponseEntity<Object> handleUsernameNotFoundException(UsernameNotFoundException ex, WebRequest request){
        String requestUri = ((ServletWebRequest)request).getRequest().getRequestURI().toString();
        ExceptionMessage exceptionMessage = new ExceptionMessage(ex.getMessage(), requestUri);
        return new ResponseEntity<>(exceptionMessage, new HttpHeaders(), HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(value = {ExpiredJwtException.class})
    public ResponseEntity<Object> handleExpiredJwtException(ExpiredJwtException ex, WebRequest request) {
        String requestUri = ((ServletWebRequest)request).getRequest().getRequestURI().toString();
        ExceptionMessage exceptionMessage = new ExceptionMessage(
                ex.getMessage().substring(0, ex.getMessage().indexOf(". Current time")),
                requestUri);
        return new ResponseEntity<>(exceptionMessage, new HttpHeaders(), HttpStatus.FORBIDDEN);
    }

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
