package com.monsanto.acs2.user.registration.entity;

import com.monsanto.acs2.user.registration.dto.LocationDTO;
import org.springframework.beans.factory.annotation.Value;

import javax.persistence.*;
import java.util.Set;

@Entity
public class Location extends AuditEntity {

    @Id
    @Column(nullable = false, unique = true)
    private String sapId;

    @Column
    private String hqSapId;

    @Column
    private String sourceSystem;

    @Column
    private String sapLocationName;

    @Column
    private String sapLocationCity;

    @Column
    private String sapLocationState;

    @OneToMany(
            mappedBy = "location",
            cascade = CascadeType.PERSIST,
            orphanRemoval = true
    )
    private Set<UserLocationRole> userLocationRoles;

    public String getSapId() {
        return sapId;
    }

    public void setSapId(String sapId) {
        this.sapId = sapId;
    }

    public String getSourceSystem() {
        return sourceSystem;
    }

    public void setSourceSystem(String sourceSystem) {
        this.sourceSystem = sourceSystem;
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

    public void setSapLocationCity(String sapLocationCity) {
        this.sapLocationCity = sapLocationCity;
    }

    public String getSapLocationState() {
        return sapLocationState;
    }

    public void setSapLocationState(String sapLocationState) {
        this.sapLocationState = sapLocationState;
    }

    public Set<UserLocationRole> getUserLocationRoles() {
        return userLocationRoles;
    }

    public void setUserLocationRoles(Set<UserLocationRole> userLocationRoles) {
        this.userLocationRoles = userLocationRoles;
    }

    public Location(String sapId) {
        this.sapId = sapId;
    }

    public Location(LocationDTO locationDTO) {
        this.sapId = locationDTO.getSapId();
        this.sourceSystem = locationDTO.getSourceSystem();
        this.hqSapId = locationDTO.getHqSapId();
    }

    public Location() {}
}
