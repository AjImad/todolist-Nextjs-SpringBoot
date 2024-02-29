package com.todolist.todolist.auth;

import org.springframework.stereotype.Component;

@Component
public class AuthenticationResponse {
    private Integer id;
    private String firstname;
    private String lastname;
    private String email;
    private String token;

    public AuthenticationResponse(){}

    public AuthenticationResponse(Integer id, String firstname, String lastname, String email, String token) {
        this.id = id;
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.token = token;
    }

    public String getFirstname() {
        return firstname;
    }

    public Integer getId() {
        return id;
    }

    public String getLastname() {
        return lastname;
    }

    public String getEmail() {
        return email;
    }

    public String getToken() {
        return token;
    }
}
