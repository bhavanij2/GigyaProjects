package com.monsanto.acs2.user.registration.dto;

public class PortalParametersDTO{
    private final String brand;
    private final String persona;
    private final String brandLogo;
    private final String country;
    private final String gigyaBucket;
    private final String gigyaTCField;
    private final String gigyaVaultPath;
    private final String emailSource;
    private final String portalUrl;
    private final String faviconUrl;
    private final String termsAndConditions;

    public PortalParametersDTO(String brand, String persona, String brandLogo, 
        String country, String gigyaBucket, String gigyaTCField, String gigyaVaultPath, 
        String emailSource, String portalUrl, String faviconUrl, String termsAndConditions) {
        this.brand = brand;
        this.persona = persona;
        this.brandLogo = brandLogo;
        this.country = country;
        this.gigyaBucket = gigyaBucket;
        this.gigyaTCField = gigyaTCField;
        this.gigyaVaultPath = gigyaVaultPath;
        this.emailSource = emailSource;
        this.portalUrl = portalUrl;
        this.faviconUrl = faviconUrl;
        this.termsAndConditions = termsAndConditions;
    }

    public String getBrand(){
        return brand;
    }

    public String getPersona(){
        return persona;
    }

    public String getBrandLogo(){
        return brandLogo;
    }

    public String getCountry(){
        return country;
    }

    public String getGigyaBucket(){
        return gigyaBucket;
    }

    public String getGigyaTCField(){
        return gigyaTCField;
    }

    public String getGigyaVaultPath(){
        return gigyaVaultPath;
    }

    public String getEmailSource(){
        return emailSource;
    }

    public String getPortalUrl(){
        return portalUrl;
    }

    public String getFaviconUrl(){
        return faviconUrl;
    }

    public String getTermsAndConditions() {
        return termsAndConditions;
    }
}