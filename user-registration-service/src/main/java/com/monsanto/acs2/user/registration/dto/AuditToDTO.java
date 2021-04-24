package com.monsanto.acs2.user.registration.dto;

import java.util.UUID;

public class AuditToDTO {        
        
    private String email;

    public AuditToDTO(){}

    public String getEmail(){
        return email;
    }

    public void setEmail(String email){
        this.email = email;
    }
}