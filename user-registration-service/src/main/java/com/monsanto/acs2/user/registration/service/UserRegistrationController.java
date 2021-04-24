package com.monsanto.acs2.user.registration.service;

import com.monsanto.acs2.user.registration.bo.EmailNotificationBO;
import com.monsanto.acs2.user.registration.bo.UserRegistrationBO;
import com.monsanto.acs2.user.registration.bo.UserProfileBO;
import com.monsanto.acs2.user.registration.dto.*;
import com.monsanto.acs2.user.registration.entity.Brand;
import com.monsanto.acs2.user.registration.entity.User;
import com.monsanto.acs2.user.registration.entity.UserType;
import com.monsanto.acs2.user.registration.security.CurrentUsername;
import com.monsanto.acs2.user.registration.validation.RegistrationValidation;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.core.env.Environment;

import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import java.io.IOException;
import java.util.AbstractMap;
import java.util.Map;
import java.util.UUID;

import com.fasterxml.jackson.databind.ObjectMapper;


@RestController
public class UserRegistrationController {
    private final ObjectMapper mapper = new ObjectMapper();
    private final UserRegistrationBO userRegistrationBO;
    private final EmailNotificationBO emailNotificationBO;
    private final Environment environment;
    private final PortalParametersService portalParametersService;

    public UserRegistrationController(UserRegistrationBO userRegistrationBO, EmailNotificationBO emailNotificationBO,
      Environment environment, PortalParametersService portalParametersService) {
        this.userRegistrationBO = userRegistrationBO;
        this.emailNotificationBO = emailNotificationBO;
        this.portalParametersService = portalParametersService;
        this.environment = environment;
    }

    private String getAdminString(String userProfile) {
        try {
            UserProfileBO userProfileObj = mapper.readValue(userProfile, UserProfileBO.class);
            if (userProfileObj.getEmail() == null) {
                return "no admin was supplied";
            }
            return userProfileObj.getAdminId();
        } catch(IOException e) {
            e.printStackTrace();
            throw new RuntimeException();
        }
    }

    @PostMapping("/migrate")
    public AbstractMap.SimpleEntry<String, Object> migrateUser(
            @Valid @RequestBody UserMigrationRequestDTO migrationRequest,
            @CurrentUsername(allowAppClients = true) String securedUsername) {

        User user = userRegistrationBO.saveUser(migrationRequest, securedUsername);

        if (user.isRegistrationCompleted()) {
            return new AbstractMap.SimpleEntry<>("registrationCompleted", true);
        }

        return new AbstractMap.SimpleEntry<>("id", user.getId());
    }

    @PostMapping("/pre-register")
    public UserPreRegistrationResponseDTO preRegisterUser(@Valid @RequestBody UserPreRegistrationRequestDTO
                                                                  preRegistrationRequest,
                                                          @CurrentUsername(allowAppClients = true,
                                                                  requiredEntitlement = "add-user-registration")
                                                                  String securedUsername,
                                                          @RequestParam(defaultValue = "false") boolean sendEmail) {

        User user = userRegistrationBO.preRegisterUser(preRegistrationRequest, securedUsername, sendEmail);

        if (sendEmail) {
            emailNotificationBO.sendPreRegistrationInviteEmail(user, false);
        }

        String url = getUrl(user);

        return new UserPreRegistrationResponseDTO(url + "register/" + user.getId(),
                user.isRegistrationCompleted());
    }

    @PostMapping("/pre-register/uadmin")
    public UserPreRegistrationResponseDTO uAdminPreRegisterUser(@Valid @RequestBody UAdminUserPreRegistrationRequestDTO
                                                                        preRegistrationRequest,
                                                                    String securedUsername,
                                                                @RequestHeader("user-profile") String userProfile,
                                                                @RequestParam(defaultValue = "false") boolean sendEmail) {

        String admin = getAdminString(userProfile);
        User user = userRegistrationBO.uAdminPreRegisterUser(preRegistrationRequest, sendEmail, admin);

        if (sendEmail) {
            emailNotificationBO.sendPreRegistrationInviteEmail(user, false);
        }
        String url = getUrl(user);

        return new UserPreRegistrationResponseDTO(url + "register/" + user.getId(),
                user.isRegistrationCompleted());
    }

    @PostMapping("/pre-register/resend-email")
    public void resendPreRegistrationInviteEmail(@CurrentUsername(allowAppClients = true) String securedUsername,
                                                 @RequestParam String email,
                                                 @RequestParam String sapAccountNumber) {
        User user = userRegistrationBO.getUser(email, sapAccountNumber);
        emailNotificationBO.sendPreRegistrationInviteEmail(user, true);
    }

    @PostMapping("/register/{userId}")
    public void registerUser(@Validated(RegistrationValidation.class) @RequestBody UserRegistrationRequestDTO
                                     registrationRequest, @PathVariable UUID userId) {
        userRegistrationBO.saveContact(registrationRequest, userId);
    }

    @GetMapping("/register/{userId}")
    public UserInformationDTO getUserInformation(@PathVariable UUID userId) {
        System.out.println(" in register method"+userId);
        System.out.println(userRegistrationBO.getUserInformation(userId));
        return userRegistrationBO.getUserInformation(userId);
    }

    @PutMapping("/accept-policy/{userId}")
    public AcceptPolicyResponseDTO acceptPolicy(@PathVariable UUID userId) {
        AcceptPolicyResponseDTO acceptPolicyResponse = userRegistrationBO.acceptPolicy(userId);

        if (acceptPolicyResponse.isEmailVerificationRequired()) {
            emailNotificationBO.sendVerificationEmail(userRegistrationBO.getUser(userId));
        }

        return acceptPolicyResponse;
    }

    @PutMapping("/create-account/{userId}")
    public CreateAccountResponseDTO createAccount(@PathVariable UUID userId, @RequestBody Map<String, String> body) {

        CreateAccountResponseDTO response = userRegistrationBO.createAccount(userId, body.get("password"));

        if (response.isAccountCreated()) {
            userRegistrationBO.configureSecurity(userId);
            emailNotificationBO.sendRegistrationCompleteEmail(userRegistrationBO.getUser(userId));
        }

        return response;
    }

    @PutMapping("/process/{userId}")
    public void process(@PathVariable UUID userId) {
        User user = userRegistrationBO.getUser(userId);

        if (user.getC7RegistrationTimestamp() == null && user.getGigyaUid() != null) {
            userRegistrationBO.configureSecurity(userId);
            emailNotificationBO.sendRegistrationCompleteEmail(user);
        }
    }

    @GetMapping("/email/{userId}/{email}/")
    public AbstractMap.SimpleEntry<String, Boolean> checkAccountAvailability(@PathVariable UUID userId,
                                                                             @PathVariable String email) {

        return new AbstractMap.SimpleEntry<>("valid", userRegistrationBO.isAccountAvailable(userId, email));
    }

    @GetMapping("/check-email/{email}/brand/{brand}/user-type/{userType}")
    public AbstractMap.SimpleEntry<String, Boolean> checkEmailAvaliability(@PathVariable String email,
                                                                           @PathVariable Brand brand,
                                                                           @PathVariable UserType userType) {

        return new AbstractMap.SimpleEntry<>("isAvailable", userRegistrationBO.isEmailAvailable(email, brand, userType));
    }

    @GetMapping("/verify-email/{userId}/{emailVerificationCode}")
    public void verifyEmail(@PathVariable UUID userId, @PathVariable UUID emailVerificationCode,
                            HttpServletResponse response) throws IOException {
        boolean verified = userRegistrationBO.verifyEmail(userId, emailVerificationCode);

        User user = userRegistrationBO.getUser(userId);
        String url = environment.getProperty(user.getUserType() + ".registration.ui.base.url");
        if (verified) {
            String urlSuffix;

            if (user.isRegistrationCompleted()) {
                urlSuffix = "register/" + userId;
            } else if (user.isVerificationCompleted()) {
                urlSuffix = "confirm/" + userId;
            } else {
                urlSuffix = "verify/" + userId + "/" + userRegistrationBO.getUserVerificationMethod(userId);
            }


            response.sendRedirect(url + urlSuffix);
        } else {
            response.sendRedirect(url +
                    "error/Error%20Code:%20400400%20The%20requested%20link%20is%20invalid!");
        }
    }

    @PostMapping("/verify")
    public AbstractMap.SimpleEntry<String, Boolean> verifyCode(@RequestBody Map<String, String> body) {
        boolean result = userRegistrationBO.verifyCode(UUID.fromString(body.get("id")), body.get("code"));

        return new AbstractMap.SimpleEntry<>("result", result);
    }

    private String getUrl(User user){
        if (user.getUserType() != null){
            return environment.getProperty(user.getUserType() + ".registration.ui.base.url");
        } else {
            String portalUrl = portalParametersService.getPortalParameters(user.getPortal()).getPortalUrl();
            return "https://"+portalUrl+"/self-registration/";
        }
    }
}
