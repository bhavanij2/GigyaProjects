package com.monsanto.acs2.user.registration.service;

import com.monsanto.acs2.user.registration.bo.EmailNotificationBO;
import com.monsanto.acs2.user.registration.bo.UserRegistrationBO;
import com.monsanto.acs2.user.registration.bo.UserVerificationMethod;
import com.monsanto.acs2.user.registration.dto.*;
import com.monsanto.acs2.user.registration.entity.User;
import com.monsanto.acs2.user.registration.entity.UserType;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.core.env.Environment;

import javax.servlet.http.HttpServletResponse;
import java.util.AbstractMap;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@RunWith(MockitoJUnitRunner.class)
public class UserRegistrationControllerTest {
    private UserRegistrationController userRegistrationController;

    @Mock
    private UserRegistrationBO userRegistrationBO;
    @Mock
    private EmailNotificationBO emailNotificationBO;
    @Mock
    private Environment environment;
    @Mock
    private PortalParametersService portalParametersService;

    @Before
    public void setUp() throws Exception {
        userRegistrationController = new UserRegistrationController(userRegistrationBO, emailNotificationBO,
         environment, portalParametersService);
    }

    @Test
    public void migrateUser_WhenRegistrationIsNotCompleted() throws Exception {
        UUID userId = UUID.randomUUID();
        User user = mock(User.class);
        when(user.getId()).thenReturn(userId);
        UserMigrationRequestDTO userMigrationRequestDTO = mock(UserMigrationRequestDTO.class);
        when(userRegistrationBO.saveUser(userMigrationRequestDTO, "TEST_USER")).thenReturn(user);

        AbstractMap.SimpleEntry<String, Object> response =
                userRegistrationController.migrateUser(userMigrationRequestDTO, "TEST_USER");

        assertThat(response.getKey()).isEqualTo("id");
        assertThat(response.getValue()).isEqualTo(userId);
    }

    @Test
    public void migrateUser_WhenRegistrationIsCompleted() throws Exception {
        User user = mock(User.class);
        when(user.isRegistrationCompleted()).thenReturn(true);
        UserMigrationRequestDTO userMigrationRequestDTO = mock(UserMigrationRequestDTO.class);
        when(userRegistrationBO.saveUser(userMigrationRequestDTO, "TEST_USER")).thenReturn(user);

        AbstractMap.SimpleEntry<String, Object> response =
                userRegistrationController.migrateUser(userMigrationRequestDTO, "TEST_USER");

        assertThat(response.getKey()).isEqualTo("registrationCompleted");
        assertThat(response.getValue()).isEqualTo(true);
    }

    // @Test
    public void preRegisterUser_WhenSendEmailIsTrue() {
        User user = mock(User.class);
        UUID userId = UUID.randomUUID();
        when(user.getId()).thenReturn(userId);
        when(user.getPortal()).thenReturn("mycrop");
        when(user.isRegistrationCompleted()).thenReturn(false);
        UserPreRegistrationRequestDTO userPreRegistrationRequestDTO = mock(UserPreRegistrationRequestDTO.class);
        PortalParametersDTO portalParametersDTO = mock(PortalParametersDTO.class);
        when(portalParametersDTO.getPortalUrl()).thenReturn("registration.monsanto.com");
        when(userRegistrationBO.preRegisterUser(userPreRegistrationRequestDTO, "TEST_USER", true)).thenReturn(user);
        
        when(userPreRegistrationRequestDTO.getUserType()).thenReturn(UserType.dealer);
        when(portalParametersService.getPortalParameters("mycrop")).thenReturn(portalParametersDTO);
        when(environment.getProperty("dealer.registration.ui.base.url"))
            .thenReturn("https://registration.monsanto.com/");

        UserPreRegistrationResponseDTO response = userRegistrationController.preRegisterUser(userPreRegistrationRequestDTO, "TEST_USER", true);

        assertThat(response.getRegistrationUrl()).isEqualTo("https://registration.monsanto.com/self-registration/register/" + userId);
        assertThat(response.isRegistrationCompleted()).isFalse();
        verify(emailNotificationBO).sendPreRegistrationInviteEmail(user, false);
    }

    // @Test
    public void preRegisterUser_WhenSendEmailIsFalse() {
        UserPreRegistrationRequestDTO userPreRegistrationRequestDTO = mock(UserPreRegistrationRequestDTO.class);
        User user = mock(User.class);
        UUID userId = UUID.randomUUID();
        when(user.getId()).thenReturn(userId);
        when(user.getPortal()).thenReturn("mycrop");
        when(user.isRegistrationCompleted()).thenReturn(true);
        when(userRegistrationBO.preRegisterUser(userPreRegistrationRequestDTO, "TEST_USER",
                false)).thenReturn(user);
        when(userPreRegistrationRequestDTO.getUserType()).thenReturn(UserType.dealer);
        when(environment.getProperty("dealer.registration.ui.base.url"))
            .thenReturn("https://registration.monsanto.com/");

        PortalParametersDTO portalParametersDTO = mock(PortalParametersDTO.class);
        when(portalParametersService.getPortalParameters("mycrop")).thenReturn(portalParametersDTO);
        when(portalParametersDTO.getPortalUrl()).thenReturn("registration.monsanto.com");
        UserPreRegistrationResponseDTO response = userRegistrationController.preRegisterUser(
                userPreRegistrationRequestDTO, "TEST_USER", false);

        assertThat(response.getRegistrationUrl()).isEqualTo("https://registration.monsanto.com/self-registration/register/" + userId);
        assertThat(response.isRegistrationCompleted()).isTrue();
        verify(userRegistrationBO).preRegisterUser(userPreRegistrationRequestDTO, "TEST_USER",
                false);
        verifyZeroInteractions(emailNotificationBO);
    }

    @Test
    public void resendPreRegistrationInviteEmail() {
        User user = mock(User.class);
        when(userRegistrationBO.getUser("test@example.com", "1234567")).thenReturn(user);

        userRegistrationController.resendPreRegistrationInviteEmail("TEST_USER",
                "test@example.com", "1234567");

        verify(emailNotificationBO).sendPreRegistrationInviteEmail(user, true);
    }

    @Test
    public void registerUser() throws Exception {
        UUID userId = UUID.randomUUID();
        UserRegistrationRequestDTO userRegistrationRequestDTO = mock(UserRegistrationRequestDTO.class);

        userRegistrationController.registerUser(userRegistrationRequestDTO, userId);

        verify(userRegistrationBO).saveContact(userRegistrationRequestDTO, userId);
    }

    @Test
    public void getUserInformation() throws Exception {
        UUID userId = UUID.randomUUID();
        UserInformationDTO expectedUserInformationDTO = mock(UserInformationDTO.class);
        when(userRegistrationBO.getUserInformation(userId)).thenReturn(expectedUserInformationDTO);

        UserInformationDTO userInformationDTO = userRegistrationController.getUserInformation(userId);

        assertThat(userInformationDTO).isEqualTo(expectedUserInformationDTO);
    }

    @Test
    public void acceptPolicy_WhenEmailVerificationRequired_IsFalse() throws Exception {
        UUID userId = UUID.randomUUID();
        AcceptPolicyResponseDTO acceptPolicyResponseDTO = mock(AcceptPolicyResponseDTO.class);
        when(acceptPolicyResponseDTO.isEmailVerificationRequired()).thenReturn(false);
        when(userRegistrationBO.acceptPolicy(userId)).thenReturn(acceptPolicyResponseDTO);

        AcceptPolicyResponseDTO response = userRegistrationController.acceptPolicy(userId);

        assertThat(response).isEqualTo(acceptPolicyResponseDTO);
        verifyZeroInteractions(emailNotificationBO);
    }

    @Test
    public void acceptPolicy_WhenEmailVerificationRequired_IsTrue() throws Exception {
        UUID userId = UUID.randomUUID();
        User user = mock(User.class);
        AcceptPolicyResponseDTO acceptPolicyResponseDTO = mock(AcceptPolicyResponseDTO.class);
        when(acceptPolicyResponseDTO.isEmailVerificationRequired()).thenReturn(true);
        when(userRegistrationBO.acceptPolicy(userId)).thenReturn(acceptPolicyResponseDTO);
        when(userRegistrationBO.getUser(userId)).thenReturn(user);

        AcceptPolicyResponseDTO response = userRegistrationController.acceptPolicy(userId);

        assertThat(response).isEqualTo(acceptPolicyResponseDTO);
        verify(emailNotificationBO).sendVerificationEmail(user);
    }

    @Test
    public void createAccount_WhenAccountCreatedIsTrue() throws Exception {
        UUID userId = UUID.randomUUID();
        User user = mock(User.class);
        Map<String, String> body = new HashMap<>();
        body.put("password", "irhtuht438y5438fdnj");
        CreateAccountResponseDTO createAccountResponseDTO = mock(CreateAccountResponseDTO.class);
        when(createAccountResponseDTO.isAccountCreated()).thenReturn(true);
        when(userRegistrationBO.createAccount(userId, "irhtuht438y5438fdnj"))
                .thenReturn(createAccountResponseDTO);
        when(userRegistrationBO.getUser(userId)).thenReturn(user);

        CreateAccountResponseDTO response = userRegistrationController.createAccount(userId, body);

        assertThat(response).isEqualTo(createAccountResponseDTO);
        verify(userRegistrationBO).configureSecurity(userId);
        verify(emailNotificationBO).sendRegistrationCompleteEmail(user);
    }

    @Test
    public void createAccount_WhenAccountCreatedIsFalse() throws Exception {
        UUID userId = UUID.randomUUID();
        Map<String, String> body = new HashMap<>();
        body.put("password", "irhtuht438y5438fdnj");
        CreateAccountResponseDTO createAccountResponseDTO = mock(CreateAccountResponseDTO.class);
        when(createAccountResponseDTO.isAccountCreated()).thenReturn(false);
        when(userRegistrationBO.createAccount(userId, "irhtuht438y5438fdnj"))
                .thenReturn(createAccountResponseDTO);

        CreateAccountResponseDTO response = userRegistrationController.createAccount(userId, body);

        assertThat(response).isEqualTo(createAccountResponseDTO);
        verify(userRegistrationBO, never()).configureSecurity(userId);
        verifyZeroInteractions(emailNotificationBO);
    }

    @Test
    public void process_DoesNothingByDefault() {
        UUID userId = UUID.randomUUID();
        User user = mock(User.class);
        when(userRegistrationBO.getUser(userId)).thenReturn(user);
        when(user.getGigyaUid()).thenReturn(null);
        when(user.getC7RegistrationTimestamp()).thenReturn(null);

        userRegistrationController.process(userId);

        verify(userRegistrationBO).getUser(userId);
        verifyNoMoreInteractions(userRegistrationBO);
        verifyZeroInteractions(emailNotificationBO);
    }

    @Test
    public void process_DoesNothing_WhenTimestampIsNotNull() {
        UUID userId = UUID.randomUUID();
        User user = mock(User.class);
        when(userRegistrationBO.getUser(userId)).thenReturn(user);
        when(user.getC7RegistrationTimestamp()).thenReturn(Long.MIN_VALUE);

        userRegistrationController.process(userId);

        verify(userRegistrationBO).getUser(userId);
        verifyNoMoreInteractions(userRegistrationBO);
        verifyZeroInteractions(emailNotificationBO);
    }

    @Test
    public void process_ConfiguresSecurity_WhenGigyaIdIsNotNullAndTimestampIsNull() {
        UUID userId = UUID.randomUUID();
        User user = mock(User.class);
        when(userRegistrationBO.getUser(userId)).thenReturn(user);
        when(user.getGigyaUid()).thenReturn("sihfsdkuhfwdu");
        when(user.getC7RegistrationTimestamp()).thenReturn(null);

        userRegistrationController.process(userId);

        verify(userRegistrationBO).getUser(userId);
        verify(userRegistrationBO).configureSecurity(userId);
        verifyNoMoreInteractions(userRegistrationBO);
        verify(emailNotificationBO).sendRegistrationCompleteEmail(user);
    }

    @Test
    public void checkAccountAvailability() throws Exception {
        UUID userId = UUID.randomUUID();
        String email = "user@test.com";
        when(userRegistrationBO.isAccountAvailable(userId, email)).thenReturn(true);

        AbstractMap.SimpleEntry<String, Boolean> response =
                userRegistrationController.checkAccountAvailability(userId, email);

        assertThat(response.getKey()).isEqualTo("valid");
        assertThat(response.getValue()).isEqualTo(true);
    }

    @Test
    public void verifyEmail_RedirectsToVerificationPage_WhenTrueIsReturnedAndNotPreviouslyVerified() throws Exception {
        UUID userId = UUID.randomUUID();
        UUID emailVerificationCode = UUID.randomUUID();
        User user = mock(User.class);
        HttpServletResponse response = mock(HttpServletResponse.class);
        when(user.getUserType()).thenReturn(UserType.dealer);
        when(environment.getProperty("dealer.registration.ui.base.url"))
            .thenReturn("https://registration.monsanto.com/");
        when(userRegistrationBO.verifyEmail(userId, emailVerificationCode)).thenReturn(true);
        when(userRegistrationBO.getUserVerificationMethod(userId)).thenReturn(UserVerificationMethod.MY_MON_ID);
        when(userRegistrationBO.getUser(userId)).thenReturn(user);
        when(user.isVerificationCompleted()).thenReturn(false);

        userRegistrationController.verifyEmail(userId, emailVerificationCode, response);

        verify(response).sendRedirect("https://registration.monsanto.com/verify/" + userId + "/MY_MON_ID");
    }

    @Test
    public void verifyEmail_RedirectsToConfirmationPage_WhenTrueIsReturnedAndPreviouslyVerified() throws Exception {
        UUID userId = UUID.randomUUID();
        UUID emailVerificationCode = UUID.randomUUID();
        User user = mock(User.class);
        HttpServletResponse response = mock(HttpServletResponse.class);
        when(user.getUserType()).thenReturn(UserType.dealer);
        when(environment.getProperty("dealer.registration.ui.base.url"))
            .thenReturn("https://registration.monsanto.com/");
        when(userRegistrationBO.verifyEmail(userId, emailVerificationCode)).thenReturn(true);
        when(userRegistrationBO.getUser(userId)).thenReturn(user);
        when(user.isVerificationCompleted()).thenReturn(true);

        userRegistrationController.verifyEmail(userId, emailVerificationCode, response);

        verify(response).sendRedirect("https://registration.monsanto.com/confirm/" + userId);
    }

    @Test
    public void verifyEmail_RedirectsToRegistrationPage_WhenTrueIsReturnedAndRegistrationIsCompleted() throws Exception {
        UUID userId = UUID.randomUUID();
        UUID emailVerificationCode = UUID.randomUUID();
        User user = mock(User.class);
        HttpServletResponse response = mock(HttpServletResponse.class);
        when(user.getUserType()).thenReturn(UserType.dealer);
        when(environment.getProperty("dealer.registration.ui.base.url"))
            .thenReturn("https://registration.monsanto.com/");
        when(userRegistrationBO.verifyEmail(userId, emailVerificationCode)).thenReturn(true);
        when(userRegistrationBO.getUser(userId)).thenReturn(user);
        when(user.isVerificationCompleted()).thenReturn(true);
        when(user.isRegistrationCompleted()).thenReturn(true);

        userRegistrationController.verifyEmail(userId, emailVerificationCode, response);

        verify(response).sendRedirect("https://registration.monsanto.com/register/" + userId);
    }

    @Test
    public void verifyEmail_RedirectsToErrorPage_WhenFalseIsReturned() throws Exception {
        UUID userId = UUID.randomUUID();
        UUID emailVerificationCode = UUID.randomUUID();
        User user = mock(User.class);
        HttpServletResponse response = mock(HttpServletResponse.class);
        when(userRegistrationBO.getUser(userId)).thenReturn(user);
        when(user.getUserType()).thenReturn(UserType.dealer);
        when(environment.getProperty("dealer.registration.ui.base.url"))
            .thenReturn("https://registration.monsanto.com/");
        when(userRegistrationBO.verifyEmail(userId, emailVerificationCode)).thenReturn(false);

        userRegistrationController.verifyEmail(userId, emailVerificationCode, response);

        verify(response).sendRedirect("https://registration.monsanto.com/error/Error%20Code:" +
                "%20400400%20The%20requested%20link%20is%20invalid!");
    }

    @Test
    public void verifyCode() {
        UUID userId = UUID.randomUUID();
        Map<String, String> body = new HashMap<>();
        body.put("id", userId.toString());
        body.put("code", "8754387");
        when(userRegistrationBO.verifyCode(userId, "8754387")).thenReturn(true);

        AbstractMap.SimpleEntry<String, Boolean> response = userRegistrationController.verifyCode(body);

        assertThat(response.getKey()).isEqualTo("result");
        assertThat(response.getValue()).isTrue();
    }
}