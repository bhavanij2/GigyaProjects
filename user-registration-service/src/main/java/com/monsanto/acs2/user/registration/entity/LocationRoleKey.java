package com.monsanto.acs2.user.registration.entity;

import javax.persistence.*;
import java.io.Serializable;

@Embeddable
public class LocationRoleKey implements Serializable {
    @Column(name = "sap_id")
    private String sapId;

    @Column(name = "role_id")
    private String roleId;

    public String getSapId() {
        return sapId;
    }

    public void setLocationId(String sapId) {
        this.sapId = sapId;
    }

    public String getRoleId() {
        return roleId;
    }

    public void setRoleId(String roleId) {
        this.roleId = roleId;
    } 

    public LocationRoleKey() {}

    public LocationRoleKey(String sapId, String roleId) {
        this.sapId = sapId;
        this.roleId = roleId;
    }
}
