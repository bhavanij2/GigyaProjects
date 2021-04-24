package com.monsanto.acs2.user.registration.entity;

public class PortalKey {
    String brand;
    String persona;
    String country;

    public PortalKey(String brand, String persona, String country) {
        this.brand = brand;
        this.persona = persona;
        this.country = country;
    }

    public String getBrand(){
        return brand;
    }

    public String getPersona(){
        return persona;
    }

    public String getCountry(){
        return country;
    }
}