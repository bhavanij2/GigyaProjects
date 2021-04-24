package com.monsanto.acs2.user.registration.dto;

public class AcceptPolicyResponseDTO {
    private final boolean emailVerificationRequired;

    public AcceptPolicyResponseDTO(boolean emailVerificationRequired) {
        this.emailVerificationRequired = emailVerificationRequired;
    }

    public boolean isEmailVerificationRequired() {
        return emailVerificationRequired;
    }
}
