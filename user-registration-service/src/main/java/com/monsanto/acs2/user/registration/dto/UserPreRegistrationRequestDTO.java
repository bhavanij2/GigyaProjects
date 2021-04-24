package com.monsanto.acs2.user.registration.dto;

import com.monsanto.acs2.user.registration.entity.Brand;
import com.monsanto.acs2.user.registration.entity.UserType;
import org.hibernate.validator.constraints.NotEmpty;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

public class UserPreRegistrationRequestDTO extends UserRegistrationRequestDTO {

    @Pattern(regexp = "([0-9])+", message = "Account number has an invalid character!")
    @Size(min = 7, max = 10, message = "Account number has an invalid length!")
    @NotEmpty(message = "Account number must be provided!")
    private String sapAccountNumber;

    @NotNull(message = "Brand must be provided!")
    private Brand brand;

    @NotNull(message = "User type must be provided!")
    private UserType userType;

    private String portal;

    public String getSapAccountNumber() {
        return sapAccountNumber;
    }

    public void setSapAccountNumber(String sapAccountNumber) {
        this.sapAccountNumber = sapAccountNumber;
    }

    public Brand getBrand() {
        return brand;
    }

    public void setBrand(Brand brand) {
        this.brand = brand;
    }

    public UserType getUserType() {
        return userType;
    }

    public void setUserType(UserType userType) {
        this.userType = userType;
    }

    public String getPortal() {
        return portal;
    }

    public void setUserType(String portal) {
        this.portal = portal;
    }
}
