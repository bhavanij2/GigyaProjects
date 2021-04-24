package com.monsanto.acs2.user.registration.bo;

import com.monsanto.acs2.user.registration.entity.*;
import com.monsanto.acs2.user.registration.repository.LocationRepository;
import com.monsanto.acs2.user.registration.repository.RoleRepository;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

import java.util.UUID;

import static org.mockito.Mockito.*;

@RunWith(MockitoJUnitRunner.class)
public class UserLocationRoleBOTest {
    @Mock
    private LocationRepository locationRepository;

    @Mock
    private RoleRepository roleRepository;

    @InjectMocks
    private UserLocationRoleBO userUserLocationRoleBO;

    @Test
    public void getUserLocationRole_locationAndRoleDoesNotExist() {
        User user = new User();
        user.setId(UUID.fromString("0095a954-63b0-49c7-bbd5-821344f03d19"));

        UserLocationRole userUserLocationRole = new UserLocationRole();
        Location location = new Location("12345");
        Role role = new Role("test-role");
        userUserLocationRole.setLocation(location);
        userUserLocationRole.setRole(role);

        when(locationRepository.existsBySapId(userUserLocationRole.getLocation().getSapId())).thenReturn(false);
        when(roleRepository.existsByRoleId(userUserLocationRole.getRole().getRoleId())).thenReturn(false);

        UserLocationRole output = userUserLocationRoleBO.getUserLocationRole(userUserLocationRole.getLocation(), userUserLocationRole.getRole(), user);

        verify(locationRepository, times(1)).existsBySapId(userUserLocationRole.getLocation().getSapId());
        verify(roleRepository, times(1)).existsByRoleId(userUserLocationRole.getRole().getRoleId());
    }

    @Test
    public void getUserLocationRole_locationExistsAndRoleDoesNotExist() {
        User user = new User();
        user.setId(UUID.fromString("0095a954-63b0-49c7-bbd5-821344f03d19"));

        UserLocationRole userLocationRole = new UserLocationRole();
        Location location = new Location("12345");
        Role role = new Role("test-role");
        userLocationRole.setLocation(location);
        userLocationRole.setRole(role);

        when(locationRepository.existsBySapId(userLocationRole.getLocation().getSapId())).thenReturn(true);
        when(roleRepository.existsByRoleId(userLocationRole.getRole().getRoleId())).thenReturn(false);
        when(locationRepository.findBySapId(location.getSapId())).thenReturn(location);

        UserLocationRole output = userUserLocationRoleBO.getUserLocationRole(userLocationRole.getLocation(), userLocationRole.getRole(), user);

        verify(locationRepository, times(1)).existsBySapId(userLocationRole.getLocation().getSapId());
        verify(locationRepository, times(1)).findBySapId(location.getSapId());
        verify(roleRepository, times(1)).existsByRoleId(userLocationRole.getRole().getRoleId());
    }

    @Test
    public void getUserLocationRole_locationDoesNotExistsAndRoleExists() {
        User user = new User();
        user.setId(UUID.fromString("0095a954-63b0-49c7-bbd5-821344f03d19"));

        UserLocationRole userLocationRole = new UserLocationRole();
        Location location = new Location("12345");
        Role role = new Role("test-role");
        userLocationRole.setLocation(location);
        userLocationRole.setRole(role);

        when(locationRepository.existsBySapId(userLocationRole.getLocation().getSapId())).thenReturn(false);
        when(roleRepository.existsByRoleId(userLocationRole.getRole().getRoleId())).thenReturn(true);
        when(roleRepository.findByRoleId(role.getRoleId())).thenReturn(role);

        UserLocationRole output = userUserLocationRoleBO.getUserLocationRole(userLocationRole.getLocation(), userLocationRole.getRole(), user);

        verify(locationRepository, times(1)).existsBySapId(userLocationRole.getLocation().getSapId());
        verify(roleRepository, times(1)).existsByRoleId(userLocationRole.getRole().getRoleId());
        verify(roleRepository, times(1)).findByRoleId(role.getRoleId());
        verify(roleRepository, times(0)).save(role);
    }

    @Test
    public void getUserLocationRole_locationAndRoleBothExist() {
        User user = new User();
        user.setId(UUID.fromString("0095a954-63b0-49c7-bbd5-821344f03d19"));

        UserLocationRole userLocationRole = new UserLocationRole();
        Location location = new Location("12345");
        Role role = new Role("test-role");
        userLocationRole.setLocation(location);
        userLocationRole.setRole(role);

        when(locationRepository.existsBySapId(userLocationRole.getLocation().getSapId())).thenReturn(true);
        when(roleRepository.existsByRoleId(userLocationRole.getRole().getRoleId())).thenReturn(true);
        when(locationRepository.findBySapId(location.getSapId())).thenReturn(location);
        when(roleRepository.findByRoleId(role.getRoleId())).thenReturn(role);

        UserLocationRole output = userUserLocationRoleBO.getUserLocationRole(userLocationRole.getLocation(), userLocationRole.getRole(), user);

        verify(locationRepository, times(1)).existsBySapId(userLocationRole.getLocation().getSapId());
        verify(locationRepository, times(1)).findBySapId(location.getSapId());
        verify(roleRepository, times(1)).existsByRoleId(userLocationRole.getRole().getRoleId());
        verify(roleRepository, times(1)).findByRoleId(role.getRoleId());
        verify(locationRepository, times(0)).save(location);
        verify(roleRepository, times(0)).save(role);
    }

    @Test
    public void getUserLocationRole_userLocationRoleAndUserLocationRoleAllExist() {
        User user = new User();
        user.setId(UUID.fromString("0095a954-63b0-49c7-bbd5-821344f03d19"));

        UserLocationRole userLocationRole = new UserLocationRole();
        Location location = new Location("12345");
        Role role = new Role("test-role");
        userLocationRole.setLocation(location);
        userLocationRole.setRole(role);

        when(locationRepository.existsBySapId(userLocationRole.getLocation().getSapId())).thenReturn(true);
        when(roleRepository.existsByRoleId(userLocationRole.getRole().getRoleId())).thenReturn(true);
        when(locationRepository.findBySapId(location.getSapId())).thenReturn(location);
        when(roleRepository.findByRoleId(role.getRoleId())).thenReturn(role);
        UserLocationRole output = userUserLocationRoleBO.getUserLocationRole(userLocationRole.getLocation(), userLocationRole.getRole(), user);

        verify(locationRepository, times(1)).existsBySapId(userLocationRole.getLocation().getSapId());
        verify(locationRepository, times(1)).findBySapId(location.getSapId());
        verify(roleRepository, times(1)).existsByRoleId(userLocationRole.getRole().getRoleId());
        verify(roleRepository, times(1)).findByRoleId(role.getRoleId());

    }

    @Test(expected=Exception.class)
    public void getUserLocationRole_throwsException() {
        User user = new User();
        user.setId(UUID.fromString("0095a954-63b0-49c7-bbd5-821344f03d19"));

        UserLocationRole userLocationRole = new UserLocationRole();
        Location location = new Location("12345");
        Role role = new Role("test-role");
        userLocationRole.setLocation(location);
        userLocationRole.setRole(role);

        when(locationRepository.existsBySapId(userLocationRole.getLocation().getSapId())).thenThrow(new Exception("Test Exception"));
        when(roleRepository.existsByRoleId(userLocationRole.getRole().getRoleId())).thenReturn(true);
        when(locationRepository.findBySapId(location.getSapId())).thenReturn(location);
        when(roleRepository.findByRoleId(role.getRoleId())).thenReturn(role);
        UserLocationRole output = userUserLocationRoleBO.getUserLocationRole(userLocationRole.getLocation(), userLocationRole.getRole(), user);
    }
}
