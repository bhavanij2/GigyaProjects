package com.monsanto.acs2.user.registration.bo;


import com.monsanto.acs2.user.registration.entity.*;
import com.monsanto.acs2.user.registration.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class UserLocationRoleBO {
    private final Logger logger = LoggerFactory.getLogger(getClass());
    private final LocationRepository locationRepository;
    private final RoleRepository roleRepository;

    public UserLocationRoleBO(
            LocationRepository locationRepository,
            RoleRepository roleRepository
    ) {
        this.locationRepository = locationRepository;
        this.roleRepository = roleRepository;
    }

    public UserLocationRole getUserLocationRole(Location location, Role role, User user) {
        if (locationRepository.existsBySapId(location.getSapId())) {
            location = locationRepository.findBySapId(location.getSapId());
        }

        if (roleRepository.existsByRoleId(role.getRoleId())) {
            role = roleRepository.findByRoleId(role.getRoleId());
        }
        UserLocationRole userLocationRole = new UserLocationRole(user, location, role);

        return userLocationRole;
    }
}
