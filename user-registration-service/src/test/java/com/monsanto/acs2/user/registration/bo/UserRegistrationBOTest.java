package com.monsanto.acs2.user.registration.bo;

import com.monsanto.acs2.user.registration.dto.*;
import com.monsanto.acs2.user.registration.entity.*;
import com.monsanto.acs2.user.registration.exception.HttpStatusResponseException;
import com.monsanto.acs2.user.registration.repository.LocationRepository;
import com.monsanto.acs2.user.registration.repository.RoleRepository;
import com.monsanto.acs2.user.registration.repository.UserContactRepository;
import com.monsanto.acs2.user.registration.repository.UserRepository;
import com.monsanto.acs2.user.registration.service.UserRegistrationService;
import com.monsanto.acs2.user.registration.service.PortalParametersService;
import com.monsanto.acs2.user.registration.service.SQSService;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;
import org.springframework.http.HttpStatus;

import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.failBecauseExceptionWasNotThrown;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.*;

@RunWith(MockitoJUnitRunner.class)
public class UserRegistrationBOTest {
    private UserRegistrationBO userRegistrationBO;
    @Mock
    private LocationRepository locationRepository;
//    @Mock
//    private LocationRoleRepository locationRoleRepository;
    @Mock
    private RoleRepository roleRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private UserContactRepository userContactRepository;
    @Mock
    private UserRegistrationService userRegistrationService;
    @Mock
    private PortalParametersService portalParametersService;
    @Mock
    private SQSService sqsService;
    @Mock
    private UserLocationRoleBO userLocationRoleBO;

    @Before
    public void setUp() throws Exception {
        userRegistrationBO = new UserRegistrationBO(locationRepository, roleRepository, userRepository, 
            userContactRepository, userRegistrationService, sqsService, userLocationRoleBO, portalParametersService);
    }

    @Test
    public void saveUser() throws Exception {
        User expectedUser = mock(User.class);
        UserMigrationRequestDTO userMigrationRequestDTO = mock(UserMigrationRequestDTO.class);
        when(userMigrationRequestDTO.getMyMonUserId()).thenReturn("test_account");
        when(userMigrationRequestDTO.getEmail()).thenReturn("user@test.com");
        when(userMigrationRequestDTO.getSapAccountNumber()).thenReturn("0001234567");
        when(userMigrationRequestDTO.getBrand()).thenReturn(Brand.national);
        when(userMigrationRequestDTO.getUserType()).thenReturn(UserType.grower);
        when(userRepository.save(any(User.class))).thenReturn(expectedUser);

        User user = userRegistrationBO.saveUser(userMigrationRequestDTO, "TEST_USER");

        assertThat(user).isEqualTo(expectedUser);
        ArgumentCaptor<User> userArgumentCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(userArgumentCaptor.capture());
        User actualUser = userArgumentCaptor.getValue();
        assertThat(actualUser.getMyMonUserId()).isEqualTo("test_account");
        assertThat(actualUser.getEmail()).isEqualTo("user@test.com");
        assertThat(actualUser.getSapAccountNumber()).isEqualTo("0001234567");
        assertThat(actualUser.getBrand()).isEqualTo(Brand.national);
        assertThat(actualUser.getUserType()).isEqualTo(UserType.grower);
        assertThat(actualUser.isRegistrationCompleted()).isFalse();
        assertThat(actualUser.getCreatedBy()).isEqualTo("TEST_USER");
    }

    @Test
    public void saveUser_ReturnsExistingUserId_WhenMyMonUserIdAlreadyInitiatedMigration() throws Exception {
        User expectedUser = mock(User.class);
        UserMigrationRequestDTO userMigrationRequestDTO = mock(UserMigrationRequestDTO.class);
        when(userMigrationRequestDTO.getMyMonUserId()).thenReturn("test_account");
        when(userMigrationRequestDTO.getBrand()).thenReturn(Brand.national);
        when(userMigrationRequestDTO.getUserType()).thenReturn(UserType.grower);
        when(userRepository.findByMyMonUserIdIgnoreCaseAndBrandAndUserType("test_account", Brand.national,
                UserType.grower)).thenReturn(expectedUser);

        User user = userRegistrationBO.saveUser(userMigrationRequestDTO, null);

        assertThat(user).isEqualTo(expectedUser);
        verify(userRepository).findByMyMonUserIdIgnoreCaseAndBrandAndUserType("test_account",
                Brand.national, UserType.grower);
        verifyNoMoreInteractions(userRepository);
    }

    @Test
    public void saveUser_ReturnsExistingUserId_WhenEmailAlreadyInitiatedMigration() throws Exception {
        User expectedUser = mock(User.class);
        UserMigrationRequestDTO userMigrationRequestDTO = mock(UserMigrationRequestDTO.class);
        when(userMigrationRequestDTO.getEmail()).thenReturn("user@test.com");
        when(userMigrationRequestDTO.getBrand()).thenReturn(Brand.national);
        when(userMigrationRequestDTO.getUserType()).thenReturn(UserType.grower);
        when(userRepository.findByEmailIgnoreCaseAndBrandAndUserType("user@test.com", Brand.national,
                UserType.grower)).thenReturn(expectedUser);

        User user = userRegistrationBO.saveUser(userMigrationRequestDTO, null);

        assertThat(user).isEqualTo(expectedUser);
        verify(userRepository).findByEmailIgnoreCaseAndBrandAndUserType("user@test.com",
                Brand.national, UserType.grower);
        verifyNoMoreInteractions(userRepository);
    }

    @Test
    public void saveContact_SavesNewContact() throws Exception {
        UUID userId = UUID.randomUUID();
        User expectedUser = mock(User.class);
        UserRegistrationRequestDTO userRegistrationRequestDTO = mock(UserRegistrationRequestDTO.class);
        when(userRegistrationRequestDTO.getEmail()).thenReturn("user@test.com");
        when(userRegistrationRequestDTO.getFirstName()).thenReturn("john");
        when(userRegistrationRequestDTO.getLastName()).thenReturn("doe");
        when(userRegistrationRequestDTO.getPhone1()).thenReturn("555-555-5555");
        when(userRegistrationRequestDTO.getPhoneType1()).thenReturn(PhoneType.MOBILE);
        when(userRegistrationRequestDTO.getPhone2()).thenReturn("999-999-9999");
        when(userRegistrationRequestDTO.getPhoneType2()).thenReturn(PhoneType.LANDLINE);
        when(userRegistrationRequestDTO.getAddress1()).thenReturn("street address1");
        when(userRegistrationRequestDTO.getAddress2()).thenReturn("street address2");
        when(userRegistrationRequestDTO.getCity()).thenReturn("some city");
        when(userRegistrationRequestDTO.getState()).thenReturn("MO");
        when(userRegistrationRequestDTO.getZipcode()).thenReturn("63167");
        when(expectedUser.getUserContact()).thenReturn(null);
        when(userRepository.findOne(userId)).thenReturn(expectedUser);

        userRegistrationBO.saveContact(userRegistrationRequestDTO, userId);

        ArgumentCaptor<UserContact> userContactArgumentCaptor = ArgumentCaptor.forClass(UserContact.class);
        verify(userContactRepository).save(userContactArgumentCaptor.capture());
        UserContact userContact = userContactArgumentCaptor.getValue();
        assertThat(userContact.getEmail()).isEqualTo("user@test.com");
        assertThat(userContact.getFirstName()).isEqualTo("john");
        assertThat(userContact.getLastName()).isEqualTo("doe");
        assertThat(userContact.getPhone1()).isEqualTo("555-555-5555");
        assertThat(userContact.getPhoneType1()).isEqualTo(PhoneType.MOBILE);
        assertThat(userContact.getPhone2()).isEqualTo("999-999-9999");
        assertThat(userContact.getPhoneType2()).isEqualTo(PhoneType.LANDLINE);
        assertThat(userContact.getAddress1()).isEqualTo("street address1");
        assertThat(userContact.getAddress2()).isEqualTo("street address2");
        assertThat(userContact.getCity()).isEqualTo("some city");
        assertThat(userContact.getState()).isEqualTo("MO");
        assertThat(userContact.getZipcode()).isEqualTo("63167");
        assertThat(userContact.getUser()).isEqualTo(expectedUser);
        verify(expectedUser).setUserContact(userContact);
        verify(expectedUser).setVerificationCompletedTimestamp(null);
        verify(expectedUser).setPolicyAcceptedTimestamp(null);
        verify(expectedUser).getUserContact();
        verify(expectedUser).isRegistrationCompleted();
        verify(expectedUser).getEmail();
        verifyNoMoreInteractions(expectedUser);
        verify(userRepository).save(expectedUser);
    }

    @Test
    public void saveContact_UpdatesExistingContact() throws Exception {
        UUID userId = UUID.randomUUID();
        User expectedUser = mock(User.class);
        UserContact userContact = mock(UserContact.class);
        UserRegistrationRequestDTO userRegistrationRequestDTO = mock(UserRegistrationRequestDTO.class);
        when(userRegistrationRequestDTO.getEmail()).thenReturn("user@test.com");
        when(userRegistrationRequestDTO.getFirstName()).thenReturn("john");
        when(userRegistrationRequestDTO.getLastName()).thenReturn("doe");
        when(userRegistrationRequestDTO.getPhone1()).thenReturn("555-555-5555");
        when(userRegistrationRequestDTO.getPhoneType1()).thenReturn(PhoneType.MOBILE);
        when(userRegistrationRequestDTO.getPhone2()).thenReturn("999-999-9999");
        when(userRegistrationRequestDTO.getPhoneType2()).thenReturn(PhoneType.LANDLINE);
        when(userRegistrationRequestDTO.getAddress1()).thenReturn("street address1");
        when(userRegistrationRequestDTO.getAddress2()).thenReturn("street address2");
        when(userRegistrationRequestDTO.getCity()).thenReturn("some city");
        when(userRegistrationRequestDTO.getState()).thenReturn("MO");
        when(userRegistrationRequestDTO.getCountry()).thenReturn("US");
        when(userRegistrationRequestDTO.getZipcode()).thenReturn("63167");
        when(expectedUser.getUserContact()).thenReturn(userContact);
        when(userContact.getEmail()).thenReturn("user@test.com");
        when(expectedUser.getEmail()).thenReturn("user@test.com");
        when(userRepository.findOne(userId)).thenReturn(expectedUser);

        userRegistrationBO.saveContact(userRegistrationRequestDTO, userId);

        verify(userContactRepository).save(userContact);
        verify(userContact).setEmail("user@test.com");
        verify(userContact).setFirstName("john");
        verify(userContact).setLastName("doe");
        verify(userContact).setPhone1("555-555-5555");
        verify(userContact).setPhoneType1(PhoneType.MOBILE);
        verify(userContact).setPhone2("999-999-9999");
        verify(userContact).setPhoneType2(PhoneType.LANDLINE);
        verify(userContact).setAddress1("street address1");
        verify(userContact).setAddress2("street address2");
        verify(userContact).setCity("some city");
        verify(userContact).setState("MO");
        verify(userContact).setZipcode("63167");
        verify(userContact).setCountry("US");
        verify(userContact).getEmail();
        verify(expectedUser).setVerificationCompletedTimestamp(anyLong());
        verify(expectedUser).setPolicyAcceptedTimestamp(null);
        verify(expectedUser).getUserContact();
        verify(expectedUser).isRegistrationCompleted();
        verify(expectedUser).getEmail();
        verifyNoMoreInteractions(userContact, expectedUser);
        verify(userRepository).save(expectedUser);
    }

    @Test
    public void saveContact_ThrowsHttpStatusResponseException_WhenUserHasCompletedRegistration() throws Exception {
        UUID userId = UUID.randomUUID();
        User user = mock(User.class);
        when(user.getId()).thenReturn(userId);
        when(user.isRegistrationCompleted()).thenReturn(true);
        when(userRepository.findOne(userId)).thenReturn(user);

        try {
            userRegistrationBO.saveContact(null, userId);
            failBecauseExceptionWasNotThrown(HttpStatusResponseException.class);
        } catch (HttpStatusResponseException e) {
            assertThat(e.getStatus()).isEqualTo(HttpStatus.BAD_REQUEST);
            assertThat(e.getMessage()).isEqualTo("The requested action cannot be performed!");
            assertThat(e.getUserId()).isEqualTo(userId);
            assertThat(e.getCause()).isNull();
            verify(user).isRegistrationCompleted();
            verify(user).getId();
            verify(userContactRepository, never()).save(any(UserContact.class));
            verifyNoMoreInteractions(user);
        }
    }

    @Test
    public void preRegisterUser_SuccessfullyCompletes() {
        UserPreRegistrationRequestDTO userPreRegistrationRequestDTO = mock(UserPreRegistrationRequestDTO.class);
        when(userPreRegistrationRequestDTO.getEmail()).thenReturn("user@test.com");
        when(userPreRegistrationRequestDTO.getSapAccountNumber()).thenReturn("0001234567");
        when(userPreRegistrationRequestDTO.getBrand()).thenReturn(Brand.national);
        when(userPreRegistrationRequestDTO.getUserType()).thenReturn(UserType.grower);
        when(userPreRegistrationRequestDTO.getEmail()).thenReturn("user@test.com");
        when(userPreRegistrationRequestDTO.getFirstName()).thenReturn("john");
        when(userPreRegistrationRequestDTO.getLastName()).thenReturn("doe");
        when(userPreRegistrationRequestDTO.getPhone1()).thenReturn("555-555-5555");
        when(userPreRegistrationRequestDTO.getPhoneType1()).thenReturn(PhoneType.MOBILE);
        when(userPreRegistrationRequestDTO.getPhone2()).thenReturn("999-999-9999");
        when(userPreRegistrationRequestDTO.getPhoneType2()).thenReturn(PhoneType.LANDLINE);
        when(userPreRegistrationRequestDTO.getAddress1()).thenReturn("street address1");
        when(userPreRegistrationRequestDTO.getAddress2()).thenReturn("street address2");
        when(userPreRegistrationRequestDTO.getCity()).thenReturn("some city");
        when(userPreRegistrationRequestDTO.getState()).thenReturn("MO");
        when(userPreRegistrationRequestDTO.getZipcode()).thenReturn("63167");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArguments()[0]);

        User user = userRegistrationBO.preRegisterUser(userPreRegistrationRequestDTO, "TEST_USER",
                true);

        assertThat(user.getMyMonUserId()).isNull();
        assertThat(user.getEmail()).isEqualTo("user@test.com");
        assertThat(user.getSapAccountNumber()).isEqualTo("0001234567");
        assertThat(user.getBrand()).isEqualTo(Brand.national);
        assertThat(user.getUserType()).isEqualTo(UserType.grower);
        assertThat(user.getCreatedBy()).isEqualTo("TEST_USER");
        assertThat(user.isVerificationCompleted()).isTrue();
        verify(userRepository, times(2)).save(user);
        ArgumentCaptor<UserContact> userContactArgumentCaptor = ArgumentCaptor.forClass(UserContact.class);
        verify(userContactRepository).save(userContactArgumentCaptor.capture());
        UserContact userContact = userContactArgumentCaptor.getValue();
        assertThat(userContact.getEmail()).isEqualTo("user@test.com");
        assertThat(userContact.getFirstName()).isEqualTo("john");
        assertThat(userContact.getLastName()).isEqualTo("doe");
        assertThat(userContact.getPhone1()).isEqualTo("555-555-5555");
        assertThat(userContact.getPhoneType1()).isEqualTo(PhoneType.MOBILE);
        assertThat(userContact.getPhone2()).isEqualTo("999-999-9999");
        assertThat(userContact.getPhoneType2()).isEqualTo(PhoneType.LANDLINE);
        assertThat(userContact.getAddress1()).isEqualTo("street address1");
        assertThat(userContact.getAddress2()).isEqualTo("street address2");
        assertThat(userContact.getCity()).isEqualTo("some city");
        assertThat(userContact.getState()).isEqualTo("MO");
        assertThat(userContact.getZipcode()).isEqualTo("63167");
        assertThat(userContact.getUser()).isEqualTo(user);
    }

    @Test
    public void preRegisterUser_ReturnsExistingUser_AndDoesNotSave_WhenErrorIfUserExistsIsFalse() {
        UUID userId = UUID.randomUUID();
        User user = mock(User.class);
        UserContact userContact = mock(UserContact.class);
        when(user.getId()).thenReturn(userId);
        when(user.getSapAccountNumber()).thenReturn("0003482775");
        when(userContact.getUser()).thenReturn(user);
        UserPreRegistrationRequestDTO request = mock(UserPreRegistrationRequestDTO.class);
        when(request.getEmail()).thenReturn("user@test.com");
        when(request.getBrand()).thenReturn(Brand.national);
        when(request.getUserType()).thenReturn(UserType.grower);
        when(request.getSapAccountNumber()).thenReturn("3482775");
        when(userContactRepository.findByEmailIgnoreCaseAndUser_BrandAndUser_UserType(
                "user@test.com", Brand.national, UserType.grower)).thenReturn(userContact);

        User existingUser = userRegistrationBO.preRegisterUser(request, "test", false);

        assertThat(existingUser).isEqualTo(user);
        verify(userRepository)
                .findByEmailIgnoreCaseAndBrandAndUserType("user@test.com", Brand.national, UserType.grower);
        verify(userContactRepository).findByEmailIgnoreCaseAndUser_BrandAndUser_UserType(
                "user@test.com", Brand.national, UserType.grower);
        verifyNoMoreInteractions(userRepository, userContactRepository);
    }

    @Test
    public void preRegisterUser_ThrowsHttpStatusResponseException_WhenErrorIfUserExistsIsFalse_AndEmailRegisteredWithDifferentSapAccount() {
        UUID userId = UUID.randomUUID();
        User user = mock(User.class);
        when(user.getId()).thenReturn(userId);
        when(user.getSapAccountNumber()).thenReturn("0003482775");
        UserPreRegistrationRequestDTO request = mock(UserPreRegistrationRequestDTO.class);
        when(request.getEmail()).thenReturn("user@test.com");
        when(request.getBrand()).thenReturn(Brand.national);
        when(request.getUserType()).thenReturn(UserType.grower);
        when(request.getSapAccountNumber()).thenReturn("987435");
        when(userRepository.findByEmailIgnoreCaseAndBrandAndUserType(
                "user@test.com", Brand.national, UserType.grower)).thenReturn(user);

        try {
            userRegistrationBO.preRegisterUser(request, "test", false);
            failBecauseExceptionWasNotThrown(HttpStatusResponseException.class);
        } catch (HttpStatusResponseException e) {
            assertPreRegisterException(userId, e, "Email already used with a different account!");
        }
    }

    private void assertPreRegisterException(UUID userId, HttpStatusResponseException e, String message) {
        assertThat(e.getStatus()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(e.getMessage()).isEqualTo(message);
        assertThat(e.getUserId()).isEqualTo(userId);
        assertThat(e.getCause()).isNull();
        verify(userRepository, never()).save(any(User.class));
        verifyZeroInteractions(userContactRepository);
    }

    @Test
    public void preRegisterUser_ThrowsHttpStatusResponseException_WhenUserRecordWithEmailAndAccountExists() {
        UUID userId = UUID.randomUUID();
        User user = mock(User.class);
        when(user.getId()).thenReturn(userId);
        when(user.getSapAccountNumber()).thenReturn("0003482775");
        UserPreRegistrationRequestDTO request = mock(UserPreRegistrationRequestDTO.class);
        when(request.getEmail()).thenReturn("user@test.com");
        when(request.getBrand()).thenReturn(Brand.national);
        when(request.getUserType()).thenReturn(UserType.grower);
        when(request.getSapAccountNumber()).thenReturn("3482775");
        when(userRepository
                .findByEmailIgnoreCaseAndBrandAndUserType("user@test.com", Brand.national, UserType.grower))
                .thenReturn(user);

        try {
            userRegistrationBO.preRegisterUser(request, "test", true);
            failBecauseExceptionWasNotThrown(HttpStatusResponseException.class);
        } catch (HttpStatusResponseException e) {
            assertPreRegisterException(userId, e, "Email and account already used!");
        }
    }

    @Test
    public void preRegisterUser_ThrowsHttpStatusResponseException_WhenUserRecordWithEmailAndDifferentAccountExists() {
        UUID userId = UUID.randomUUID();
        User user = mock(User.class);
        when(user.getId()).thenReturn(userId);
        when(user.getSapAccountNumber()).thenReturn("0003482775");
        UserPreRegistrationRequestDTO request = mock(UserPreRegistrationRequestDTO.class);
        when(request.getEmail()).thenReturn("user@test.com");
        when(request.getBrand()).thenReturn(Brand.national);
        when(request.getUserType()).thenReturn(UserType.grower);
        when(request.getSapAccountNumber()).thenReturn("3481775");
        when(userRepository
                .findByEmailIgnoreCaseAndBrandAndUserType("user@test.com", Brand.national, UserType.grower))
                .thenReturn(user);

        try {
            userRegistrationBO.preRegisterUser(request, "test", true);
            failBecauseExceptionWasNotThrown(HttpStatusResponseException.class);
        } catch (HttpStatusResponseException e) {
            assertPreRegisterException(userId, e, "Email already used with a different account!");
        }
    }

    @Test
    public void preRegisterUser_ThrowsHttpStatusResponseException_WhenUserContactRecordWithEmailAndAccountExists() {
        UUID userId = UUID.randomUUID();
        User user = mock(User.class);
        UserContact userContact = mock(UserContact.class);
        when(user.getId()).thenReturn(userId);
        when(user.getSapAccountNumber()).thenReturn("0003482775");
        when(userContact.getUser()).thenReturn(user);
        UserPreRegistrationRequestDTO request = mock(UserPreRegistrationRequestDTO.class);
        when(request.getEmail()).thenReturn("user@test.com");
        when(request.getBrand()).thenReturn(Brand.national);
        when(request.getUserType()).thenReturn(UserType.grower);
        when(request.getSapAccountNumber()).thenReturn("3482775");
        when(userContactRepository.findByEmailIgnoreCaseAndUser_BrandAndUser_UserType(
                "user@test.com", Brand.national, UserType.grower)).thenReturn(userContact);

        try {
            userRegistrationBO.preRegisterUser(request, "test", true);
            failBecauseExceptionWasNotThrown(HttpStatusResponseException.class);
        } catch (HttpStatusResponseException e) {
            assertThat(e.getStatus()).isEqualTo(HttpStatus.BAD_REQUEST);
            assertThat(e.getMessage()).isEqualTo("Email and account already used!");
            assertThat(e.getUserId()).isEqualTo(userId);
            assertThat(e.getCause()).isNull();
            verify(userRepository, never()).save(any(User.class));
            verify(userContactRepository, never()).save(any(UserContact.class));
        }
    }

    @Test
    public void uAdminPreRegisterUser_SuccessfullyCompletes() {
        UAdminUserPreRegistrationRequestDTO userPreRegistrationRequestDTO = mock(UAdminUserPreRegistrationRequestDTO.class);
        when(userPreRegistrationRequestDTO.getEmail()).thenReturn("user@test.com");
        when(userPreRegistrationRequestDTO.getBrand()).thenReturn(Brand.national);
        when(userPreRegistrationRequestDTO.getUserType()).thenReturn(UserType.grower);
        when(userPreRegistrationRequestDTO.getFirstName()).thenReturn("john");
        when(userPreRegistrationRequestDTO.getLastName()).thenReturn("doe");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArguments()[0]);

        User user = userRegistrationBO.uAdminPreRegisterUser(userPreRegistrationRequestDTO, true, "adminId");

        verify(userRepository, times(2)).save(user);
        ArgumentCaptor<UserContact> userContactArgumentCaptor = ArgumentCaptor.forClass(UserContact.class);
        verify(userContactRepository).save(userContactArgumentCaptor.capture());
        UserContact userContact = userContactArgumentCaptor.getValue();
        assertThat(userContact.getEmail()).isEqualTo("user@test.com");
        assertThat(userContact.getFirstName()).isEqualTo("john");
        assertThat(userContact.getLastName()).isEqualTo("doe");
        assertThat(userContact.getUser()).isEqualTo(user);
    }

    @Test
    public void uAdminPreRegisterUser_ReturnsExistingUser_AndDoesNotSave_WhenErrorIfUserExistsIsFalse() {
        UUID userId = UUID.randomUUID();
        User user = mock(User.class);
        UserContact userContact = mock(UserContact.class);
        when(user.getId()).thenReturn(userId);
        when(userContact.getUser()).thenReturn(user);
        UAdminUserPreRegistrationRequestDTO request = mock(UAdminUserPreRegistrationRequestDTO.class);
        when(request.getEmail()).thenReturn("user@test.com");
        when(request.getBrand()).thenReturn(Brand.national);
        when(request.getUserType()).thenReturn(UserType.grower);
        when(userContactRepository.findByEmailIgnoreCaseAndUser_BrandAndUser_UserType(
                "user@test.com", Brand.national, UserType.grower)).thenReturn(userContact);

        User existingUser = userRegistrationBO.uAdminPreRegisterUser(request, false, "adminId");

        assertThat(existingUser).isEqualTo(user);
        verify(userRepository)
                .findByEmailIgnoreCaseAndBrandAndUserType("user@test.com", Brand.national, UserType.grower);
        verify(userContactRepository).findByEmailIgnoreCaseAndUser_BrandAndUser_UserType(
                "user@test.com", Brand.national, UserType.grower);
        verifyNoMoreInteractions(userRepository, userContactRepository);
    }

    @Test
    public void uAdminPreRegisterUser_ThrowsHttpStatusResponseException_WhenUserRecordWithEmailExists() {
        UUID userId = UUID.randomUUID();
        User user = mock(User.class);
        when(user.getId()).thenReturn(userId);
        UAdminUserPreRegistrationRequestDTO request = mock(UAdminUserPreRegistrationRequestDTO.class);
        when(request.getEmail()).thenReturn("user@test.com");
        when(request.getBrand()).thenReturn(Brand.national);
        when(request.getUserType()).thenReturn(UserType.grower);
        when(userRepository
                .findByEmailIgnoreCaseAndBrandAndUserType("user@test.com", Brand.national, UserType.grower))
                .thenReturn(user);

        try {
            userRegistrationBO.uAdminPreRegisterUser(request, true, "adminId");
            failBecauseExceptionWasNotThrown(HttpStatusResponseException.class);
        } catch (HttpStatusResponseException e) {
            assertPreRegisterException(userId, e, "Email already used with a different account!");
        }
    }

    @Test
    public void uAdminPreRegisterUser_ThrowsHttpStatusResponseException_WhenUserContactRecordWithEmailAndAccountExists() {
        UUID userId = UUID.randomUUID();
        User user = mock(User.class);
        UserContact userContact = mock(UserContact.class);
        when(user.getId()).thenReturn(userId);
        when(userContact.getUser()).thenReturn(user);
        UAdminUserPreRegistrationRequestDTO request = mock(UAdminUserPreRegistrationRequestDTO.class);
        when(request.getEmail()).thenReturn("user@test.com");
        when(request.getBrand()).thenReturn(Brand.national);
        when(request.getUserType()).thenReturn(UserType.grower);
        when(userContactRepository.findByEmailIgnoreCaseAndUser_BrandAndUser_UserType(
                "user@test.com", Brand.national, UserType.grower)).thenReturn(userContact);

        try {
            userRegistrationBO.uAdminPreRegisterUser(request, true, "adminId");
            failBecauseExceptionWasNotThrown(HttpStatusResponseException.class);
        } catch (HttpStatusResponseException e) {
            assertThat(e.getStatus()).isEqualTo(HttpStatus.BAD_REQUEST);
            assertThat(e.getMessage()).isEqualTo("Email already used with a different account!");
            assertThat(e.getUserId()).isEqualTo(userId);
            assertThat(e.getCause()).isNull();
            verify(userRepository, never()).save(any(User.class));
            verify(userContactRepository, never()).save(any(UserContact.class));
        }
    }

    @Test
    public void getUserInformation_WhenUserContactIsNull() throws Exception {
        UUID userId = UUID.randomUUID();
        User user = mock(User.class);
        when(userRepository.findOne(userId)).thenReturn(user);
        when(user.getSapAccountNumber()).thenReturn("0001234567");
        when(user.getEmail()).thenReturn("migration_email@test.com");
        when(user.getBrand()).thenReturn(Brand.national);
        when(user.getUserType()).thenReturn(UserType.grower);

        UserInformationDTO userInformation = userRegistrationBO.getUserInformation(userId);

        assertThat(userInformation.isPolicyAccepted()).isFalse();
        assertThat(userInformation.isEmailVerified()).isFalse();
        assertThat(userInformation.isRegistrationCompleted()).isFalse();
        assertThat(userInformation.getBrand()).isEqualTo(Brand.national);
        assertThat(userInformation.getUserType()).isEqualTo(UserType.grower);
        UserInformationDTO.UserInformationForm form = userInformation.getForm();
        assertThat(form.getSapAccountNumber()).isEqualTo("0001234567");
        assertThat(form.getEmail()).isEqualTo("migration_email@test.com");
        assertThat(form.getFirstName()).isNull();
        assertThat(form.getLastName()).isNull();
        assertThat(form.getPhone1()).isNull();
        assertThat(form.getPhoneType1()).isNull();
        assertThat(form.getPhone2()).isNull();
        assertThat(form.getPhoneType2()).isNull();
        assertThat(form.getAddress1()).isNull();
        assertThat(form.getAddress2()).isNull();
        assertThat(form.getCity()).isNull();
        assertThat(form.getState()).isNull();
        assertThat(form.getZipcode()).isNull();
    }

    @Test
    public void getUserInformation_WhenUserContactIsNotNull() throws Exception {
        UUID userId = UUID.randomUUID();
        User user = mock(User.class);
        UserContact userContact = mock(UserContact.class);
        when(userRepository.findOne(userId)).thenReturn(user);
        when(user.getUserContact()).thenReturn(userContact);
        when(user.getEmail()).thenReturn("migration_email@test.com");
        when(user.getSapAccountNumber()).thenReturn("0001234567");
        when(user.isPolicyAccepted()).thenReturn(true);
        when(user.getBrand()).thenReturn(Brand.national);
        when(user.getUserType()).thenReturn(UserType.grower);
        when(userContact.getEmail()).thenReturn("user@test.com");
        when(userContact.getFirstName()).thenReturn("john");
        when(userContact.getLastName()).thenReturn("doe");
        when(userContact.getPhone1()).thenReturn("555-555-5555");
        when(userContact.getPhoneType1()).thenReturn(PhoneType.MOBILE);
        when(userContact.getPhone2()).thenReturn("999-999-9999");
        when(userContact.getPhoneType2()).thenReturn(PhoneType.LANDLINE);
        when(userContact.getAddress1()).thenReturn("street address1");
        when(userContact.getAddress2()).thenReturn("street address2");
        when(userContact.getCity()).thenReturn("some city");
        when(userContact.getState()).thenReturn("MO");
        when(userContact.getZipcode()).thenReturn("63167");
        when(userContact.getCountry()).thenReturn("US");

        UserInformationDTO userInformation = userRegistrationBO.getUserInformation(userId);

        assertThat(userInformation.isPolicyAccepted()).isTrue();
        assertThat(userInformation.isEmailVerified()).isFalse();
        assertThat(userInformation.isRegistrationCompleted()).isFalse();
        assertThat(userInformation.getBrand()).isEqualTo(Brand.national);
        assertThat(userInformation.getUserType()).isEqualTo(UserType.grower);
        UserInformationDTO.UserInformationForm form = userInformation.getForm();
        assertThat(form.getSapAccountNumber()).isEqualTo("0001234567");
        assertThat(form.getEmail()).isEqualTo("user@test.com");
        assertThat(form.getFirstName()).isEqualTo("john");
        assertThat(form.getLastName()).isEqualTo("doe");
        assertThat(form.getPhone1()).isEqualTo("555-555-5555");
        assertThat(form.getPhoneType1()).isEqualTo(PhoneType.MOBILE);
        assertThat(form.getPhone2()).isEqualTo("999-999-9999");
        assertThat(form.getPhoneType2()).isEqualTo(PhoneType.LANDLINE);
        assertThat(form.getAddress1()).isEqualTo("street address1");
        assertThat(form.getAddress2()).isEqualTo("street address2");
        assertThat(form.getCity()).isEqualTo("some city");
        assertThat(form.getState()).isEqualTo("MO");
        assertThat(form.getZipcode()).isEqualTo("63167");
        assertThat(form.getCountry()).isEqualTo("US");
    }

    @Test
    public void getUserInformation_EmailVerifiedIsTrue_WhenVerificationIsComplete() throws Exception {
        UUID userId = UUID.randomUUID();
        User user = mock(User.class);
        when(user.isVerificationCompleted()).thenReturn(true);
        when(user.isPolicyAccepted()).thenReturn(true);
        when(userRepository.findOne(userId)).thenReturn(user);

        UserInformationDTO userInformation = userRegistrationBO.getUserInformation(userId);

        assertThat(userInformation.isPolicyAccepted()).isTrue();
        assertThat(userInformation.isEmailVerified()).isTrue();
    }

    @Test
    public void getUserInformation_ThrowsHttpStatusResponseException_WhenUserEntityIsNotFound() throws Exception {
        UUID userId = UUID.randomUUID();

        try {
            userRegistrationBO.getUserInformation(userId);
            failBecauseExceptionWasNotThrown(HttpStatusResponseException.class);
        } catch (HttpStatusResponseException e) {
            assertThat(e.getStatus()).isEqualTo(HttpStatus.BAD_REQUEST);
            assertThat(e.getMessage()).isEqualTo("The requested link is invalid!");
            assertThat(e.getUserId()).isEqualTo(userId);
            assertThat(e.getCause()).isNull();
            verify(userRepository).findOne(userId);
        }
    }

    @Test
    public void getUserInformation_WhenUserHasCompletedRegistration() throws Exception {
        UUID userId = UUID.randomUUID();
        User user = mock(User.class);
        when(user.isRegistrationCompleted()).thenReturn(true);
        when(userRepository.findOne(userId)).thenReturn(user);

        UserInformationDTO userInformation = userRegistrationBO.getUserInformation(userId);

        assertThat(userInformation.isRegistrationCompleted()).isTrue();
        assertThat(userInformation.getForm()).isNull();
    }

    @Test
    public void acceptPolicy_WhenEmailVerificationRequiredIsTrue() throws Exception {
        UUID userId = UUID.randomUUID();
        User user = mock(User.class);
        when(userRepository.findOne(userId)).thenReturn(user);

        AcceptPolicyResponseDTO response = userRegistrationBO.acceptPolicy(userId);

        verify(user).setPolicyAcceptedTimestamp(anyLong());
        verify(user).setEmailVerificationCode(any(UUID.class));
        verify(user).isRegistrationCompleted();
        verify(user, times(2)).isVerificationCompleted();
        verify(userRepository).save(user);
        verifyNoMoreInteractions(user);
        assertThat(response.isEmailVerificationRequired()).isTrue();
    }

    @Test
    public void acceptPolicy_WhenEmailVerificationRequiredIsFalse() throws Exception {
        UUID userId = UUID.randomUUID();
        User user = mock(User.class);
        when(userRepository.findOne(userId)).thenReturn(user);
        when(user.isVerificationCompleted()).thenReturn(true);

        AcceptPolicyResponseDTO response = userRegistrationBO.acceptPolicy(userId);

        verify(user).setPolicyAcceptedTimestamp(anyLong());
        verify(user).isRegistrationCompleted();
        verify(user, times(2)).isVerificationCompleted();
        verify(userRepository).save(user);
        verifyNoMoreInteractions(user);
        assertThat(response.isEmailVerificationRequired()).isFalse();
    }

    @Test
    public void acceptPolicy_ThrowsHttpStatusResponseException_WhenUserHasCompletedRegistration() throws Exception {
        UUID userId = UUID.randomUUID();
        User user = mock(User.class);
        when(user.getId()).thenReturn(userId);
        when(user.isRegistrationCompleted()).thenReturn(true);
        when(userRepository.findOne(userId)).thenReturn(user);

        try {
            userRegistrationBO.acceptPolicy(userId);
            failBecauseExceptionWasNotThrown(HttpStatusResponseException.class);
        } catch (HttpStatusResponseException e) {
            assertThat(e.getStatus()).isEqualTo(HttpStatus.BAD_REQUEST);
            assertThat(e.getMessage()).isEqualTo("The requested action cannot be performed!");
            assertThat(e.getUserId()).isEqualTo(userId);
            assertThat(e.getCause()).isNull();
            verify(user).isRegistrationCompleted();
            verify(user).getId();
            verify(userRepository, never()).save(any(User.class));
            verifyNoMoreInteractions(user);
        }
    }

    // @Test
    public void createAccount_WhenGigyaAccountIsAvailable() throws Exception {
        UUID userId = UUID.randomUUID();
        User user = mock(User.class);
        UserContact userContact = mock(UserContact.class);
        when(user.isPolicyAccepted()).thenReturn(true);
        when(user.isVerificationCompleted()).thenReturn(true);
        when(user.getBrand()).thenReturn(Brand.channel);
        when(user.getUserType()).thenReturn(UserType.dealer);
        when(user.getUserContact()).thenReturn(userContact);
        when(userContact.getEmail()).thenReturn("user@test.com");
        when(userRepository.findOne(userId)).thenReturn(user);
        when(userRegistrationService.isGigyaAccountAvailable(user, "user@test.com")).thenReturn(true);
        when(userRegistrationService.createGigyaAccount(user, "fdskuhf8327dfshj"))
                .thenReturn("kjhdsf8475359874dshj");

        CreateAccountResponseDTO response = userRegistrationBO.createAccount(userId, "fdskuhf8327dfshj");

        verify(user).setRegistrationCompletedTimestamp(anyLong());
        verify(user).setGigyaUid("kjhdsf8475359874dshj");
        verify(user).isPolicyAccepted();
        verify(user).isRegistrationCompleted();
        verify(user).isVerificationCompleted();
        verify(user).getBrand();
        verify(user).getUserType();
        verify(user).getUserContact();
        verify(user).getPortal();
        verify(userRepository).save(user);
        verifyNoMoreInteractions(user);
        assertThat(response.getBrand()).isEqualTo(Brand.channel);
        assertThat(response.getUserType()).isEqualTo(UserType.dealer);
        assertThat(response.isAccountCreated()).isTrue();
    }

    @Test
    public void createAccount_WhenGigyaAccountIsNotAvailable() throws Exception {
        UUID userId = UUID.randomUUID();
        User user = mock(User.class);
        UserContact userContact = mock(UserContact.class);
        when(user.isPolicyAccepted()).thenReturn(true);
        when(user.isVerificationCompleted()).thenReturn(true);
        when(user.getUserContact()).thenReturn(userContact);
        when(userContact.getEmail()).thenReturn("user@test.com");
        when(userRepository.findOne(userId)).thenReturn(user);
        when(userRegistrationService.isGigyaAccountAvailable(user, "user@test.com")).thenReturn(false);

        CreateAccountResponseDTO response = userRegistrationBO.createAccount(userId, "fdskuhf8327dfshj");

        verify(user).setPolicyAcceptedTimestamp(null);
        verify(user).isPolicyAccepted();
        verify(user).isRegistrationCompleted();
        verify(user).isVerificationCompleted();
        verify(user).getUserContact();
        verify(userRepository).save(user);
        verify(userRegistrationService).isGigyaAccountAvailable(user, "user@test.com");
        verifyNoMoreInteractions(user, userRegistrationService);
        assertThat(response.getBrand()).isNull();
        assertThat(response.getUserType()).isNull();
        assertThat(response.isAccountCreated()).isFalse();
    }

    @Test
    public void createAccount_ThrowsHttpStatusResponseException_WhenUserHasNotAcceptedPolicy() throws Exception {
        UUID userId = UUID.randomUUID();
        User user = mock(User.class);
        when(userRepository.findOne(userId)).thenReturn(user);

        try {
            userRegistrationBO.createAccount(userId, null);
            failBecauseExceptionWasNotThrown(HttpStatusResponseException.class);
        } catch (HttpStatusResponseException e) {
            assertThat(e.getStatus()).isEqualTo(HttpStatus.BAD_REQUEST);
            assertThat(e.getMessage()).isEqualTo("The requested action cannot be performed!");
            assertThat(e.getUserId()).isEqualTo(userId);
            assertThat(e.getCause()).isNull();
            verify(user).isPolicyAccepted();
            verify(userRepository, never()).save(any(User.class));
            verifyNoMoreInteractions(user);
        }
    }

    @Test
    public void createAccount_ThrowsHttpStatusResponseException_WhenUserHasCompletedRegistration() throws Exception {
        UUID userId = UUID.randomUUID();
        User user = mock(User.class);
        when(user.isPolicyAccepted()).thenReturn(true);
        when(user.isRegistrationCompleted()).thenReturn(true);
        when(userRepository.findOne(userId)).thenReturn(user);

        try {
            userRegistrationBO.createAccount(userId, null);
            failBecauseExceptionWasNotThrown(HttpStatusResponseException.class);
        } catch (HttpStatusResponseException e) {
            assertThat(e.getStatus()).isEqualTo(HttpStatus.BAD_REQUEST);
            assertThat(e.getMessage()).isEqualTo("The requested action cannot be performed!");
            assertThat(e.getUserId()).isEqualTo(userId);
            assertThat(e.getCause()).isNull();
            verify(user).isPolicyAccepted();
            verify(user).isRegistrationCompleted();
            verify(userRepository, never()).save(any(User.class));
            verifyNoMoreInteractions(user);
        }
    }

    @Test
    public void createAccount_ThrowsHttpStatusResponseException_WhenUserVerificationIsNotCompleted() throws Exception {
        UUID userId = UUID.randomUUID();
        User user = mock(User.class);
        when(user.isPolicyAccepted()).thenReturn(true);
        when(user.isRegistrationCompleted()).thenReturn(false);
        when(user.isVerificationCompleted()).thenReturn(false);
        when(userRepository.findOne(userId)).thenReturn(user);

        try {
            userRegistrationBO.createAccount(userId, null);
            failBecauseExceptionWasNotThrown(HttpStatusResponseException.class);
        } catch (HttpStatusResponseException e) {
            assertThat(e.getStatus()).isEqualTo(HttpStatus.BAD_REQUEST);
            assertThat(e.getMessage()).isEqualTo("The requested action cannot be performed!");
            assertThat(e.getUserId()).isEqualTo(userId);
            assertThat(e.getCause()).isNull();
            verify(user).isPolicyAccepted();
            verify(user).isRegistrationCompleted();
            verify(user).isVerificationCompleted();
            verify(userRepository, never()).save(any(User.class));
            verifyNoMoreInteractions(user);
        }
    }

    @Test
    public void configureSecurity() {
        UUID userId = UUID.randomUUID();
        User user = mock(User.class);
        when(userRepository.findOne(userId)).thenReturn(user);

        userRegistrationBO.configureSecurity(userId);

        verify(userRegistrationService).registerAccountWithC7(user);
        verify(user).setC7RegistrationTimestamp(anyLong());
        verify(userRepository).save(user);
        verifyNoMoreInteractions(user);
    }

    @Test
    public void isAccountAvailable() throws Exception {
        String email = "user@test.com";
        UUID userId = UUID.randomUUID();
        User user = mock(User.class);
        when(userRepository.findOne(userId)).thenReturn(user);
        when(userRegistrationService.isGigyaAccountAvailable(user, email)).thenReturn(true);

        boolean available = userRegistrationBO.isAccountAvailable(userId, email);

        assertThat(available).isTrue();
    }

    @Test
    public void isAccountAvailable_ThrowsHttpStatusResponseException_WhenUserHasCompletedRegistration() throws Exception {
        UUID userId = UUID.randomUUID();
        User user = mock(User.class);
        when(user.getId()).thenReturn(userId);
        when(user.isRegistrationCompleted()).thenReturn(true);
        when(userRepository.findOne(userId)).thenReturn(user);

        try {
            userRegistrationBO.isAccountAvailable(userId, null);
            failBecauseExceptionWasNotThrown(HttpStatusResponseException.class);
        } catch (HttpStatusResponseException e) {
            assertThat(e.getStatus()).isEqualTo(HttpStatus.BAD_REQUEST);
            assertThat(e.getMessage()).isEqualTo("The requested action cannot be performed!");
            assertThat(e.getUserId()).isEqualTo(userId);
            assertThat(e.getCause()).isNull();
            verify(user).isRegistrationCompleted();
            verify(user).getId();
            verifyNoMoreInteractions(user);
            verifyZeroInteractions(userRegistrationService);
        }
    }

    @Test
    public void verifyEmail_ReturnsFalse_WhenCodesAreNotEqual() {
        UUID userId = UUID.randomUUID();
        User user = mock(User.class);
        when(userRepository.findOne(userId)).thenReturn(user);

        boolean result = userRegistrationBO.verifyEmail(userId, UUID.randomUUID());

        assertThat(result).isFalse();
        verify(user).getEmailVerificationCode();
        verifyNoMoreInteractions(user);
    }

    @Test
    public void verifyEmail_ReturnsTrue() {
        UUID userId = UUID.randomUUID();
        User user = mock(User.class);
        UUID emailVerificationCode = UUID.randomUUID();
        when(user.getEmailVerificationCode()).thenReturn(emailVerificationCode);
        when(user.isRegistrationCompleted()).thenReturn(false);
        when(userRepository.findOne(userId)).thenReturn(user);

        boolean result = userRegistrationBO.verifyEmail(userId, emailVerificationCode);

        assertThat(result).isTrue();
        verify(user).getEmailVerificationCode();
        verifyNoMoreInteractions(user);
    }

    @Test
    public void getUserVerificationMethod_WhenMyMonUserId_IsNotNull() {
        UUID userId = UUID.randomUUID();
        User user = mock(User.class);
        when(userRepository.findOne(userId)).thenReturn(user);
        when(user.getMyMonUserId()).thenReturn("5439898");

        UserVerificationMethod verificationMethod = userRegistrationBO.getUserVerificationMethod(userId);

        assertThat(verificationMethod).isEqualTo(UserVerificationMethod.MY_MON_ID);
    }

    @Test
    public void getUserVerificationMethod_WhenMyMonUserId_IsNull() {
        UUID userId = UUID.randomUUID();
        User user = mock(User.class);
        when(userRepository.findOne(userId)).thenReturn(user);
        when(user.getMyMonUserId()).thenReturn(null);

        UserVerificationMethod verificationMethod = userRegistrationBO.getUserVerificationMethod(userId);

        assertThat(verificationMethod).isEqualTo(UserVerificationMethod.ACCOUNT_NUMBER);
    }

    @Test
    public void verifyCode_ReturnsFalse_WhenVerificationMethodIsMyMonId() {
        UUID userId = UUID.randomUUID();
        User user = mock(User.class);
        when(userRepository.findOne(userId)).thenReturn(user);
        when(user.getMyMonUserId()).thenReturn("8743587");

        boolean result = userRegistrationBO.verifyCode(userId, "2354873587");

        assertThat(result).isFalse();
        verify(user, never()).setVerificationCompletedTimestamp(anyLong());
        verify(userRepository, never()).save(user);
    }

    @Test
    public void verifyCode_ReturnsTrue_WhenVerificationMethodIsMyMonId() {
        UUID userId = UUID.randomUUID();
        User user = mock(User.class);
        when(userRepository.findOne(userId)).thenReturn(user);
        when(user.getMyMonUserId()).thenReturn("847358");

        boolean result = userRegistrationBO.verifyCode(userId, "847358");

        assertThat(result).isTrue();
        verify(user).setVerificationCompletedTimestamp(anyLong());
        verify(userRepository).save(user);
    }

    @Test
    public void verifyCode_ReturnsFalse_WhenVerificationMethodIsAccountNumber() {
        UUID userId = UUID.randomUUID();
        User user = mock(User.class);
        when(userRepository.findOne(userId)).thenReturn(user);
        when(user.getMyMonUserId()).thenReturn(null);
        when(user.getSapAccountNumber()).thenReturn("85473587");

        boolean result = userRegistrationBO.verifyCode(userId, "854573587");

        assertThat(result).isFalse();
        verify(user, never()).setVerificationCompletedTimestamp(anyLong());
        verify(userRepository, never()).save(user);
    }

    @Test
    public void verifyCode_ReturnsFalse_WhenVerificationMethodIsAccountNumber_AndCodeIsNotNumeric() {
        UUID userId = UUID.randomUUID();
        User user = mock(User.class);
        when(userRepository.findOne(userId)).thenReturn(user);
        when(user.getMyMonUserId()).thenReturn(null);
        when(user.getSapAccountNumber()).thenReturn("85473587");

        boolean result = userRegistrationBO.verifyCode(userId, "854f73587");

        assertThat(result).isFalse();
        verify(user, never()).setVerificationCompletedTimestamp(anyLong());
        verify(userRepository, never()).save(user);
    }

    @Test
    public void verifyCode_ReturnsTrue_WhenVerificationMethodIsAccountNumber() {
        UUID userId = UUID.randomUUID();
        User user = mock(User.class);
        when(userRepository.findOne(userId)).thenReturn(user);
        when(user.getMyMonUserId()).thenReturn(null);
        when(user.getSapAccountNumber()).thenReturn("58437587");

        boolean result = userRegistrationBO.verifyCode(userId, "58437587");

        assertThat(result).isTrue();
        verify(user).setVerificationCompletedTimestamp(anyLong());
        verify(userRepository).save(user);
    }

    @Test
    public void getUser_WithEmailAndSapAccountNumber() {
        User expectedUser = mock(User.class);
        when(userRepository.findByEmailAndSapAccountNumber("user@test.com", "1234567"))
                .thenReturn(expectedUser);

        User user = userRegistrationBO.getUser("user@test.com", "1234567");

        assertThat(user).isEqualTo(expectedUser);
    }
}
