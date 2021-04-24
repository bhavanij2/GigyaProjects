package com.monsanto.acs2.user.registration.dto;
import com.monsanto.acs2.user.registration.entity.Role;

public class RoleDTO {

    private String roleId;

    public String getRoleId() {
        return roleId;
    }

    public void setRoleId(String roleId) {
        this.roleId = roleId;
    }

    public RoleDTO(Role role) {
        this.roleId = role.getRoleId();
    }

    public RoleDTO() {}
}
