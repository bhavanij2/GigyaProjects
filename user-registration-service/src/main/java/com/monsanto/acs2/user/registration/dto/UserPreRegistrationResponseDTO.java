package com.monsanto.acs2.user.registration.dto;

public class UserPreRegistrationResponseDTO {
    private final String registrationUrl;
    private final boolean registrationCompleted;

    public UserPreRegistrationResponseDTO(String registrationUrl, boolean registrationCompleted) {
        this.registrationUrl = registrationUrl;
        this.registrationCompleted = registrationCompleted;
    }

    public String getRegistrationUrl() {
        return registrationUrl;
    }

    public boolean isRegistrationCompleted() {
        return registrationCompleted;
    }
}
