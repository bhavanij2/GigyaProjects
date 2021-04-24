package com.monsanto.acs2.user.registration.entity;

import javax.persistence.*;
import java.util.Set;

@Entity
@Table(name="user_location_role")
public class UserLocationRole extends AuditEntity {

    @Id
    @GeneratedValue(generator = "userlocationrole_id_sequence", strategy = GenerationType.SEQUENCE)
    @SequenceGenerator(name = "userlocationrole_id_sequence", sequenceName = "userlocationrole_id_sequence")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinColumn(name="user_id")
    User user;

    @ManyToOne(fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinColumn(name="sap_id")
    Location location;

    @ManyToOne(fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinColumn(name = "role_id")
    Role role;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public UserLocationRole(User user, Location location, Role role) {
        this.user = user;
        this.location = location;
        if(location.getSourceSystem() == null) {
            location.setSourceSystem("sap-customer-number");
        }

        this.role = role;
    }


    public UserLocationRole() {
    }
}
