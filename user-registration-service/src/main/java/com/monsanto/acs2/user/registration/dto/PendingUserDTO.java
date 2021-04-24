package com.monsanto.acs2.user.registration.dto;

import com.monsanto.acs2.user.registration.entity.*;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

public class PendingUserDTO {

    private UUID id;

    private String firstName;

    private String lastName;

    private String email;

    private String city;

    private String state;

    private String hqSapId;

    private Brand brand;

    private UserType userType;

    private String address1;

    private String address2;

    private String phone1;

    private String phone2;


    private List<LocationRoleDTO> locationRoles;

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setBrand(Brand brand) {
        this.brand = brand;
    }

    public Brand getBrand() {
        return brand;
    }

    public void setUserType(UserType userType) {
        this.userType = userType;
    }

    public UserType getUserType() {
        return userType;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
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

    public String getPhone1() {
        return phone1;
    }

    public void setPhone1(String phone1) {
        this.phone1 = phone1;
    }

    public String getPhone2() {
        return phone2;
    }

    public void setPhone2(String phone2) {
        this.phone2 = phone2;
    }

    public String getHqSapId() {
        return hqSapId;
    }

    public void setHqSapId(String hqSapId) {
        this.hqSapId = hqSapId;
    }

    public List<LocationRoleDTO> getLocationRoles() {
        return locationRoles;
    }

    public void setLocationRoles(List<LocationRoleDTO> locationRoles) {
        this.locationRoles = locationRoles;
    }

    public UUID getId() { return id; }

    public void setId(UUID id) { this.id = id; }

    public String toString() {
        return this.id + "" + this.userType;
    }

    public PendingUserDTO(User user) {
        UserContact userContact = user.getUserContact();

        if (userContact != null) {
            this.firstName = userContact.getFirstName();
            this.lastName = userContact.getLastName();
            this.email = userContact.getEmail();
            this.city = userContact.getCity();
            this.state = userContact.getState();
            this.address1 = userContact.getAddress1();
            this.address2 = userContact.getAddress2();
            this.phone1 = userContact.getPhone1();
            this.phone2 = userContact.getPhone2();
        }

        this.hqSapId = user.getHqSapId();
        this.brand = user.getBrand();
        this.userType = user.getUserType();
        this.id = user.getId();
        List<UserLocationRole> locationRolesList = new ArrayList<>(user.getUserLocationRoles());

        List<LocationRoleDTO> locationRoleDTO = locationRolesList.stream()
                                                    .map(locationRole -> new LocationRoleDTO(locationRole.getLocation(), locationRole.getRole()))
                                                    .collect(Collectors.toList());

        this.locationRoles = locationRoleDTO;
    }

    public PendingUserDTO() {}
}
