package com.monsanto.acs2.user.registration.service;

import com.monsanto.acs2.user.registration.bo.UserAdminBO;
import com.monsanto.acs2.user.registration.dto.*;
import com.monsanto.acs2.user.registration.entity.*;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InOrder;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.runners.MockitoJUnitRunner;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.mockito.Mockito.*;

@RunWith(MockitoJUnitRunner.class)
public class UserAdminControllerTest {
    @Mock
    private UserAdminBO userAdminBO;

    @InjectMocks
    private UserAdminController userAdminController;

    @Test
    public void deleteUser() {
        UUID userId = UUID.randomUUID();
        User user = mock(User.class);
        when(user.getId()).thenReturn(userId);
        when(userAdminBO.getUser("user@test.com", Brand.national, UserType.grower)).thenReturn(user);

        userAdminController.deleteUser("user@test.com", Brand.national, UserType.grower, null);

        InOrder inOrder = Mockito.inOrder(userAdminBO);
        inOrder.verify(userAdminBO).getUser("user@test.com", Brand.national, UserType.grower);
        inOrder.verify(userAdminBO).deleteC7Account(userId);
        inOrder.verify(userAdminBO).deleteGigyaAccount(userId);
        inOrder.verify(userAdminBO).deleteUser(userId);
        verifyNoMoreInteractions(userAdminBO);
    }

    @Test
    public void updateUser() {
        UUID userId = UUID.randomUUID();
        User user = mock(User.class);
        when(user.getId()).thenReturn(userId);
        when(userAdminBO.getUser("user@test.com", Brand.national, UserType.grower)).thenReturn(user);

        userAdminController.updateUser("user@test.com", Brand.national, UserType.grower,
                "1498573", null);

        InOrder inOrder = Mockito.inOrder(userAdminBO);
        inOrder.verify(userAdminBO).getUser("user@test.com", Brand.national, UserType.grower);
        inOrder.verify(userAdminBO).deleteC7Account(userId);
        inOrder.verify(userAdminBO).updateUser(userId, "1498573");
        verifyNoMoreInteractions(userAdminBO);
    }

    @Test
    public void getRegistrationMetrics() {
        List<RegistrationMetricDTO> expectedRegistrationMetrics =
                Collections.singletonList(mock(RegistrationMetricDTO.class));
        when(userAdminBO.getRegistrationMetrics("America/Chicago", 432L, 934875L))
                .thenReturn(expectedRegistrationMetrics);

        List<RegistrationMetricDTO> registrationMetrics = userAdminController
                .getRegistrationMetrics("America/Chicago", 432L, 934875L,
                        "TEST_USER");

        assertThat(registrationMetrics).isEqualTo(expectedRegistrationMetrics);
    }

    @Test
    public void getPendingUsers() {
        List<PendingUserDTO> expectedPendingUsers = new ArrayList<PendingUserDTO>();
        when(userAdminBO.getPendingUsers()).thenReturn(expectedPendingUsers);
        List<PendingUserDTO> pendingUsers = userAdminController.getPendingUsers("123", "abc@g.com", "tester", "jim", "12345678", "testown", "MO", "national", "dealer", "US");
        assertThat(pendingUsers.size()).isEqualTo(expectedPendingUsers.size());
    }

    @Test
    public void updateUserLocationRole() {
        List<PendingUserDTO> pendingUsers = new ArrayList<PendingUserDTO>();
        PendingUserDTO pendingUserDTO1 = new PendingUserDTO();
        pendingUserDTO1.setId(UUID.fromString("0095a954-63b0-49c7-bbd5-821344f03d18"));
        pendingUserDTO1.setUserType(UserType.dealer);
        LocationRoleDTO locationRoleDTO1 = new LocationRoleDTO();
        locationRoleDTO1.setLocation(new LocationDTO(new Location("sap123")));
        locationRoleDTO1.setRole(new RoleDTO(new Role("old")));
        List<LocationRoleDTO> locationRoles1 = new ArrayList<LocationRoleDTO>();
        locationRoles1.add(locationRoleDTO1);
        pendingUserDTO1.setLocationRoles(locationRoles1);

        PendingUserDTO pendingUserDTO2 = new PendingUserDTO();
        pendingUserDTO2.setId(UUID.fromString("0095a954-63b0-49c7-bbd5-821344f03d19"));
        pendingUserDTO2.setUserType(UserType.grower);
        LocationRoleDTO locationRoleDTO2 = new LocationRoleDTO();
        locationRoleDTO2.setLocation(new LocationDTO(new Location("sap123")));
        locationRoleDTO2.setRole(new RoleDTO(new Role("old-old")));
        List<LocationRoleDTO> locationRoles2 = new ArrayList<LocationRoleDTO>();
        locationRoles2.add(locationRoleDTO2);
        pendingUserDTO2.setLocationRoles(locationRoles2);

        pendingUsers.add(pendingUserDTO1);
        pendingUsers.add(pendingUserDTO2);

        when(userAdminBO.getPendingUsers()).thenReturn(pendingUsers);
        when(userAdminBO.updateUserLocationRole(pendingUserDTO1.getId(), "old", "new")).thenReturn(true);
        when(userAdminBO.updateUserLocationRole(pendingUserDTO2.getId(), "old", "new")).thenReturn(false);
        String output = userAdminController.updateUserLocationRole("old", "new", "johndoe");
        assertEquals(output, "Number of users updated: 1");
        verify(userAdminBO, times(1)).updateUserLocationRole(any(), anyString(), anyString());
    }
}
