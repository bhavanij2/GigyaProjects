package com.monsanto.acs2.user.registration.dto;

import java.util.UUID;

public class AuditFromDTO {  

    String email;      
        
    public AuditFromDTO(){}

    public String getEmail(){
        return "-";
    }

    public void setEmail(String email){
        this.email = email;
    }
}