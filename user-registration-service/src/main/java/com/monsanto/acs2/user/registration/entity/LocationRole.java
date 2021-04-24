package com.monsanto.acs2.user.registration.entity;

public class LocationRole {

    Location location;

    Role role;

    public Location getLocation() {
        return location;
    }

    public void setLocation(Location location) {
        this.location = location;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public LocationRole(Location location, Role role) {
        this.location = location;
        this.role = role;
    }

    public LocationRole() {}
}
