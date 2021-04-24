package com.monsanto.acs2.user.registration.bo;

import com.monsanto.acs2.user.registration.dto.RegistrationMetricDTO;
import com.monsanto.acs2.user.registration.dto.PendingUserDTO;
import com.monsanto.acs2.user.registration.entity.*;
import com.monsanto.acs2.user.registration.exception.HttpStatusResponseException;
import com.monsanto.acs2.user.registration.repository.UserContactRepository;
import com.monsanto.acs2.user.registration.repository.UserRepository;
import com.monsanto.acs2.user.registration.service.UserRegistrationService;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;
import org.springframework.http.HttpStatus;

import java.math.BigInteger;
import java.util.*;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.failBecauseExceptionWasNotThrown;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;
import static org.mockito.Mockito.*;

@RunWith(MockitoJUnitRunner.class)
public class UserAdminBOTest {
    @Mock
    private UserRepository userRepository;
    @Mock
    private UserContactRepository userContactRepository;
    @Mock
    private UserRegistrationService userRegistrationService;
    @Mock
    private UserLocationRoleBO userLocationRoleBO;

    @InjectMocks
    private UserAdminBO userAdminBO;



    @Test
    public void deleteC7Account_CallsServiceWhenC7RegistrationTimestampIsNotNull() {
        UUID userId = UUID.randomUUID();
        User user = mock(User.class);
        when(userRepository.findOne(userId)).thenReturn(user);
        when(user.getC7RegistrationTimestamp()).thenReturn(12345L);

        userAdminBO.deleteC7Account(userId);

        verify(userRegistrationService).deleteC7Account(user);
        verify(user).getC7RegistrationTimestamp();
        verify(user).setC7RegistrationTimestamp(null);
        verify(userRepository).save(user);
        verify(userRepository).findOne(userId);
        verifyNoMoreInteractions(userRegistrationService, user, userRepository);
    }

    @Test
    public void deleteC7Account_DoesNotCallServiceWhenC7RegistrationTimestampIsNull() {
        UUID userId = UUID.randomUUID();
        User user = mock(User.class);
        when(userRepository.findOne(userId)).thenReturn(user);
        when(user.getC7RegistrationTimestamp()).thenReturn(null);

        userAdminBO.deleteC7Account(userId);

        verify(userRepository).findOne(userId);
        verify(user).getC7RegistrationTimestamp();
        verifyNoMoreInteractions(userRepository, user);
        verifyZeroInteractions(userRegistrationService);
    }

    @Test
    public void deleteGigyaAccount_CallsServiceWhenGigyaUidIsNotNull() {
        UUID userId = UUID.randomUUID();
        User user = mock(User.class);
        when(userRepository.findOne(userId)).thenReturn(user);
        when(user.getGigyaUid()).thenReturn("klfjdslifjklij");

        userAdminBO.deleteGigyaAccount(userId);

        verify(userRegistrationService).deleteGigyaAccount(user);
        verify(user).getGigyaUid();
        verify(user).setGigyaUid(null);
        verify(user).setRegistrationCompletedTimestamp(null);
        verify(userRepository).save(user);
        verify(userRepository).findOne(userId);
        verifyNoMoreInteractions(userRegistrationService, user, userRepository);
    }

    @Test
    public void deleteGigyaAccount_DoesNotCallServiceWhenGigyaUidIsNull() {
        UUID userId = UUID.randomUUID();
        User user = mock(User.class);
        when(userRepository.findOne(userId)).thenReturn(user);
        when(user.getGigyaUid()).thenReturn(null);

        userAdminBO.deleteGigyaAccount(userId);

        verify(userRepository).findOne(userId);
        verify(user).getGigyaUid();
        verifyNoMoreInteractions(userRepository, user);
        verifyZeroInteractions(userRegistrationService);
    }

    @Test
    public void getUser_WhenUserContactIsFound() {
        UserContact userContact = mock(UserContact.class);
        User expectedUser = mock(User.class);
        when(userContact.getUser()).thenReturn(expectedUser);
        when(userContactRepository.findByEmailIgnoreCaseAndUser_BrandAndUser_UserType(
                "user@test.com", Brand.national, UserType.grower)).thenReturn(userContact);

        User user = userAdminBO.getUser("user@test.com", Brand.national, UserType.grower);

        assertThat(user).isEqualTo(expectedUser);
    }

    @Test
    public void getUser_ExceptionThrown_WhenUserContactIsNotFound() {
        when(userContactRepository.findByEmailIgnoreCaseAndUser_BrandAndUser_UserType(
                "user@test.com", Brand.national, UserType.grower)).thenReturn(null);

        try {
            userAdminBO.getUser("user@test.com", Brand.national, UserType.grower);
            failBecauseExceptionWasNotThrown(HttpStatusResponseException.class);
        } catch (HttpStatusResponseException e) {
            assertException(e, "User not found!");
        }
    }

    @Test
    public void updateUser_CallsServiceWhenGigyaUidIsNotNull() {
        UUID userId = UUID.randomUUID();
        User user = mock(User.class);
        when(userRepository.findOne(userId)).thenReturn(user);
        when(user.getGigyaUid()).thenReturn("klfjdslifjklij");

        userAdminBO.updateUser(userId, "7453789");

        verify(user).setSapAccountNumber("7453789");
        verify(user).setC7RegistrationTimestamp(anyLong());
        verify(user).getGigyaUid();
        verify(userRegistrationService).registerAccountWithC7(user);
        verify(userRepository).save(user);
        verify(userRepository).findOne(userId);
        verifyNoMoreInteractions(userRegistrationService, user, userRepository);
    }

    @Test
    public void updateUser_DoesNotCallServiceWhenGigyaUidIsNull() {
        UUID userId = UUID.randomUUID();
        User user = mock(User.class);
        when(userRepository.findOne(userId)).thenReturn(user);
        when(user.getGigyaUid()).thenReturn(null);

        userAdminBO.updateUser(userId, "7453789");

        verify(user).setSapAccountNumber("7453789");
        verify(user).getGigyaUid();
        verify(userRepository).save(user);
        verify(userRepository).findOne(userId);
        verifyNoMoreInteractions(user, userRepository);
        verifyZeroInteractions(userRegistrationService);
    }

    @Test
    public void deleteUser_WhenNoAssociatedAccountsExist() {
        UUID userId = UUID.randomUUID();
        User user = mock(User.class);
        UserContact userContact = mock(UserContact.class);
        when(user.getUserContact()).thenReturn(userContact);
        when(user.getC7RegistrationTimestamp()).thenReturn(null);
        when(user.getGigyaUid()).thenReturn(null);
        when(userRepository.findOne(userId)).thenReturn(user);

        userAdminBO.deleteUser(userId);

        verify(userContactRepository).delete(userContact);
        verify(userRepository).delete(user);
        verify(userRepository).findOne(userId);
        verifyNoMoreInteractions(userRepository, userContactRepository);
    }

    @Test
    public void deleteUser_ThrowsException_WhenC7AccountExists() {
        UUID userId = UUID.randomUUID();
        User user = mock(User.class);
        when(user.getC7RegistrationTimestamp()).thenReturn(12345L);
        when(userRepository.findOne(userId)).thenReturn(user);

        try {
            userAdminBO.deleteUser(userId);
            failBecauseExceptionWasNotThrown(HttpStatusResponseException.class);
        } catch (HttpStatusResponseException e) {
            assertException(e, "User has an associated account!");
        }
    }

    private void assertException(HttpStatusResponseException e, String s) {
        assertThat(e.getStatus()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(e.getMessage()).isEqualTo(s);
        assertThat(e.getUserId()).isNull();
        assertThat(e.getCause()).isNull();
    }

    @Test
    public void deleteUser_ThrowsException_WhenGigyaAccountExists() {
        UUID userId = UUID.randomUUID();
        User user = mock(User.class);
        when(user.getC7RegistrationTimestamp()).thenReturn(null);
        when(user.getGigyaUid()).thenReturn("dkuhsfhjlcshf");
        when(userRepository.findOne(userId)).thenReturn(user);

        try {
            userAdminBO.deleteUser(userId);
            failBecauseExceptionWasNotThrown(HttpStatusResponseException.class);
        } catch (HttpStatusResponseException e) {
            assertException(e, "User has an associated account!");
        }
    }

    @Test
    public void getRegistrationMetrics() {
        when(userRepository.getMetrics("America/Chicago", 123L, 456L))
                .thenReturn(Collections.singletonList(new Object[]{BigInteger.valueOf(543), "2019-03", "Test"}));

        List<RegistrationMetricDTO> registrationMetrics =
                userAdminBO.getRegistrationMetrics("America/Chicago", 123L, 456L);

        assertThat(registrationMetrics).hasSize(1);
        RegistrationMetricDTO registrationMetric = registrationMetrics.get(0);
        assertThat(registrationMetric.getCount()).isEqualTo(BigInteger.valueOf(543));
        assertThat(registrationMetric.getYearMonth()).isEqualTo("2019-03");
        assertThat(registrationMetric.getEntryMethod()).isEqualTo("Test");
    }

    @Test
    public void getPendingUsers() {
        User user1 = mock(User.class);
        User user2 = mock(User.class);
        UUID userId1 = UUID.randomUUID();
        UUID userId2 = UUID.randomUUID();
        UserContact userContact1 = mock(UserContact.class);
        UserContact userContact2 = mock(UserContact.class);
        Set<UserLocationRole> userLocationRoles = new HashSet<UserLocationRole>();
        when(user1.getId()).thenReturn(userId1);
        when(user2.getId()).thenReturn(userId2);
        when(user1.getUserContact()).thenReturn(userContact1);
        when(user2.getUserContact()).thenReturn(userContact2);
        when(user1.getUserLocationRoles()).thenReturn(userLocationRoles);
        when(user2.getUserLocationRoles()).thenReturn(userLocationRoles);

        user1.setId(userId1);
        user2.setId(userId2);

        List<User> users = new ArrayList<User>();
        users.add(user1);
        users.add(user2);

        when(userRepository.findByRegistrationCompletedTimestampIsNull())
                .thenReturn(users);

        List<PendingUserDTO> pendingUsers = userAdminBO.getPendingUsers();
        assertThat(pendingUsers.size()).isEqualTo(users.size());
    }

    @Test
    public void updateUserLocationRole_updatedUserTrue() {
        User user = new User();
        user.setId(UUID.fromString("0095a954-63b0-49c7-bbd5-821344f03d19"));

        UserLocationRole testLocationRole = new UserLocationRole();
        Location location = new Location("12345");
        Role role = new Role("old");
        testLocationRole.setLocation(location);
        testLocationRole.setRole(role);
        testLocationRole.setUser(user);

        Set<UserLocationRole> userLocationRoles = new HashSet<>();
        userLocationRoles.add(testLocationRole);

        user.setUserLocationRoles(userLocationRoles);

        when(userRepository.findOne(UUID.fromString("0095a954-63b0-49c7-bbd5-821344f03d19"))).thenReturn(user);
        when(userLocationRoleBO.getUserLocationRole(any(), any(), any())).thenReturn(testLocationRole);

        boolean output = userAdminBO.updateUserLocationRole(user.getId(), "old", "new");
        verify(userRepository, times(1)).findOne(user.getId());
        verify(userLocationRoleBO, times(1)).getUserLocationRole(any(), any(), any());
        assertTrue(output);
    }

    @Test
    public void updateUserLocationRole_updatedUserFalse() {
        User user = new User();
        user.setId(UUID.fromString("0095a954-63b0-49c7-bbd5-821344f03d19"));

        UserLocationRole userLocationRole = new UserLocationRole();
        Location location = new Location("12345");
        Role role = new Role("old-role");
        userLocationRole.setLocation(location);
        userLocationRole.setRole(role);

        Set<UserLocationRole> userLocationRoles = new HashSet<>();
        userLocationRoles.add(userLocationRole);

        user.setUserLocationRoles(userLocationRoles);

        when(userRepository.findOne(UUID.fromString("0095a954-63b0-49c7-bbd5-821344f03d19"))).thenReturn(user);
        //when(userLocationRoleBO.getUserLocationRole(userLocationRole.getLocation(), userLocationRole.getRole(),user)).thenReturn(userLocationRole);

        boolean output = userAdminBO.updateUserLocationRole(user.getId(), "old", "new");
        verify(userRepository, times(1)).findOne(user.getId());
        //verify(userLocationRoleBO, times(1)).getUserLocationRole(any(), any(), any());

        assertFalse(output);
    }
}
