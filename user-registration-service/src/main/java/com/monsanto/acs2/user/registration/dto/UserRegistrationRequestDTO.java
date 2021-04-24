package com.monsanto.acs2.user.registration.dto;

import com.monsanto.acs2.user.registration.entity.PhoneType;
import com.monsanto.acs2.user.registration.validation.RegistrationValidation;
import com.monsanto.acs2.user.registration.validation.ValidUserRegistrationRequest;
import org.hibernate.validator.constraints.NotEmpty;

import javax.validation.constraints.NotNull;

@ValidUserRegistrationRequest
public class UserRegistrationRequestDTO extends RegistrationRequestBaseDTO {

    @NotEmpty(message = "Please provide your first name.", groups = RegistrationValidation.class)
    private String firstName;

    @NotEmpty(message = "Please provide your last name.", groups = RegistrationValidation.class)
    private String lastName;

    @NotEmpty(message = "Please provide your phone number.")
    private String phone1;

    @NotNull(message = "Please provide your phone number type.", groups = RegistrationValidation.class)
    private PhoneType phoneType1;

    @NotEmpty(message = "Please provide your address.")
    private String address1;

    @NotEmpty(message = "Please provide your city.")
    private String city;

    @NotEmpty(message = "Please provide your state.")
    private String state;

    @NotEmpty(message = "Please provide your zip code.")
    private String zipcode;

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getPhone1() {
        return phone1;
    }

    public void setPhone1(String phone1) {
        this.phone1 = phone1;
    }

    public PhoneType getPhoneType1() {
        return phoneType1;
    }

    public void setPhoneType1(PhoneType phoneType1) {
        this.phoneType1 = phoneType1;
    }

    public String getAddress1() {
        return address1;
    }

    public void setAddress1(String address1) {
        this.address1 = address1;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getZipcode() {
        return zipcode;
    }

    public void setZipcode(String zipcode) {
        this.zipcode = zipcode;
    }
}
