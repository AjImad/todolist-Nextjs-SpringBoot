package com.todolist.todolist.auth;

import org.springframework.stereotype.Component;

@Component
public class AuthenticationResponse {
    private String token;

    public AuthenticationResponse() {}

    public AuthenticationResponse(String token){
        this.token = token;
    }

    public String getToken() {
        return token;
    }
}
