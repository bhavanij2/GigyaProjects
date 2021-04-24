package com.monsanto.acs2.user.registration.dto;
import com.monsanto.acs2.user.registration.entity.PhoneType;
import org.hibernate.validator.constraints.NotEmpty;

public abstract class RegistrationRequestBaseDTO {

    @NotEmpty(message = "Please provide your email address.")
    private String email;

    private String firstName;

    private String lastName;

    private String phone1;

    private PhoneType phoneType1;

    private String phone2;

    private PhoneType phoneType2;

    private String address1;

    private String address2;

    private String city;

    private String state;
    
    private String country;

    private String zipcode;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

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

    public String getPhone2() {
        return phone2;
    }

    public void setPhone2(String phone2) {
        this.phone2 = phone2;
    }

    public PhoneType getPhoneType2() {
        return phoneType2;
    }

    public void setPhoneType2(PhoneType phoneType2) {
        this.phoneType2 = phoneType2;
    }

    public String getAddress1() {
        return address1;
    }

    public void setAddress1(String address1) {
        this.address1 = address1;
    }

    public String getAddress2() {
        return address2;
    }

    public void setAddress2(String address2) {
        this.address2 = address2;
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

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getZipcode() {
        return zipcode;
    }

    public void setZipcode(String zipcode) {
        this.zipcode = zipcode;
    }
}
