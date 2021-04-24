package com.monsanto.acs2.user.registration.dto;
import com.monsanto.acs2.user.registration.entity.Location;
import com.monsanto.acs2.user.registration.entity.Role;

public class LocationRoleDTO {

    private LocationDTO location;

    private RoleDTO role;

    public LocationDTO getLocation() {
        return location;
    }

    public void setLocation(LocationDTO location) {
        this.location = location;
    }

    public RoleDTO getRole() {
        return role;
    }

    public void setRole(RoleDTO role) {
        this.role = role;
    }

    public LocationRoleDTO(Location location, Role role) {
        this.location = new LocationDTO(location);
        this.role = new RoleDTO(role);
    }

    public LocationRoleDTO() {}
}
