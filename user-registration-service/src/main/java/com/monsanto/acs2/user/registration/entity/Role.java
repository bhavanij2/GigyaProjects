package com.monsanto.acs2.user.registration.entity;

import com.monsanto.acs2.user.registration.dto.RoleDTO;

import javax.persistence.*;
import java.util.Set;

@Entity
public class Role extends AuditEntity {

    @Id
    @Column(nullable = false, unique = true)
    private String roleId;

    @OneToMany(
            mappedBy = "role",
            cascade = CascadeType.PERSIST,
            orphanRemoval = true
    )
    private Set<UserLocationRole> userLocationRoles;

    public String getRoleId() {
        return roleId;
    }

    public void setRoleId(String roleId) {
        this.roleId = roleId;
    }

    public Set<UserLocationRole> getUserLocationRoles() {
        return userLocationRoles;
    }

    public void setUserLocationRoles(Set<UserLocationRole> userLocationRoles) {
        this.userLocationRoles = userLocationRoles;
    }

    public Role(String roleId) {
        this.roleId = roleId;
    }

    public Role(RoleDTO roleDTO) {
        this.roleId = roleDTO.getRoleId();
    }

    public Role() {}
}
