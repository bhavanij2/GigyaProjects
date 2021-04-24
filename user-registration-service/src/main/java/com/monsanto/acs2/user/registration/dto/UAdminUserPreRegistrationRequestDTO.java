package com.monsanto.acs2.user.registration.dto;

import com.monsanto.acs2.user.registration.entity.Brand;
import com.monsanto.acs2.user.registration.entity.UserType;
import com.monsanto.acs2.user.registration.entity.LocationRole;

import javax.validation.constraints.NotNull;
import org.springframework.beans.factory.annotation.Value;
import java.util.List;

public class UAdminUserPreRegistrationRequestDTO extends RegistrationRequestBaseDTO {

    private Brand brand;

    private UserType userType;
    
    private String portal;

    private String hqSapId;

    private String sapLocationName;

    private String sapLocationCity;

    private String sapLocationState;
    
    private String sourceSystem;

    private List<LocationRole> locationRoles;

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

    public void setPortal(String portal) {
        this.portal = portal;
    }


    public String getHqSapId() {
        return hqSapId;
    }

    public void setHqSapId(String hqSapId) {
        this.hqSapId = hqSapId;
    }

    public String getSapLocationName() {
        return sapLocationName;
    }

    public void setSapLocationName(String sapLocationName) {
        this.sapLocationName = sapLocationName;
    }

    public String getSapLocationCity() {
        return sapLocationCity;
    }

    public void setSourceSystem(String sourceSystem) {
        this.sourceSystem = sourceSystem;
    }

    public String getSourceSystem() {
        return sourceSystem;
    }

    public void setSapLocationCity(String sapLocationCity) {
        this.sapLocationCity = sapLocationCity;
    }

    public String getSapLocationState() {
        return sapLocationState;
    }

    public void setSapLocationState(String sapLocationState) {
        this.sapLocationState = sapLocationState;
    }

    public List<LocationRole> getLocationRoles() {
        return locationRoles;
    }

    public void setLocationRoles(List<LocationRole> locationRoles) {
        this.locationRoles = locationRoles;
    }
}
