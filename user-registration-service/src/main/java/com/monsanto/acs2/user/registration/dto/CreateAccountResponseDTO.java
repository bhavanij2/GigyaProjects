package com.monsanto.acs2.user.registration.dto;

import com.monsanto.acs2.user.registration.entity.Brand;
import com.monsanto.acs2.user.registration.entity.UserType;

public class CreateAccountResponseDTO {
    private final Brand brand;
    private final UserType userType;
    private final boolean accountCreated;
    private final String portal;

    public CreateAccountResponseDTO(Brand brand, UserType userType, boolean accountCreated, String portal) {
        this.brand = brand;
        this.userType = userType;
        this.accountCreated = accountCreated;
        this.portal = portal;
    }

    public Brand getBrand() {
        return brand;
    }

    public UserType getUserType() {
        return userType;
    }

    public boolean isAccountCreated() {
        return accountCreated;
    }

    public String getPortal() {
        return portal;
    }
}
