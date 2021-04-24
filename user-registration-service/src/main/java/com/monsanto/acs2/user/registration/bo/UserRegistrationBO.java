package com.monsanto.acs2.user.registration.bo;

import com.monsanto.acs2.user.registration.dto.*;
import com.monsanto.acs2.user.registration.entity.*;
import com.monsanto.acs2.user.registration.exception.HttpStatusResponseException;
import com.monsanto.acs2.user.registration.repository.LocationRepository;
//import com.monsanto.acs2.user.registration.repository.LocationRoleRepository;
import com.monsanto.acs2.user.registration.repository.RoleRepository;
import com.monsanto.acs2.user.registration.repository.UserContactRepository;
import com.monsanto.acs2.user.registration.repository.UserRepository;
import com.monsanto.acs2.user.registration.service.UserRegistrationService;
import com.monsanto.acs2.user.registration.service.PortalParametersService;
import com.monsanto.acs2.user.registration.service.SQSService;
import org.apache.commons.lang3.math.NumberUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import javax.transaction.Transactional;
import java.time.Instant;
import java.util.HashSet;
import java.util.UUID;
import java.util.List;
import java.util.ArrayList;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.core.JsonProcessingException;

@Component
public class UserRegistrationBO {
    private final Logger logger = LoggerFactory.getLogger(getClass());
    private final UserRepository userRepository;
    private final UserContactRepository userContactRepository;
    private final UserRegistrationService userRegistrationService;
    private final PortalParametersService portalParametersService;
    private final SQSService sqsService;
    private final UserLocationRoleBO userLocationRoleBO;


    public UserRegistrationBO(
            LocationRepository locationRepository,
            RoleRepository roleRepository,
            UserRepository userRepository,
            UserContactRepository userContactRepository,
            UserRegistrationService userRegistrationService,
            SQSService sqsService,
            UserLocationRoleBO userLocationRoleBO,
            PortalParametersService portalParametersService) {
        this.userRepository = userRepository;
        this.userContactRepository = userContactRepository;
        this.userRegistrationService = userRegistrationService;
        this.sqsService = sqsService;
        this.userLocationRoleBO = userLocationRoleBO;
        this.portalParametersService = portalParametersService;
    }

    @Transactional
    public User saveUser(UserMigrationRequestDTO migrationRequest, String createdByUsername) {
        String myMonUserId = migrationRequest.getMyMonUserId();
        Brand brand = migrationRequest.getBrand();
        String portal = "";
        UserType userType = migrationRequest.getUserType();
        String email = migrationRequest.getEmail();

        if (StringUtils.hasText(myMonUserId)) {
            User existingUser = userRepository
                    .findByMyMonUserIdIgnoreCaseAndBrandAndUserType(myMonUserId, brand, userType);

            if (existingUser != null) {
                return existingUser;
            }
        }

        if (StringUtils.hasText(email)) {
            User existingUser = userRepository.findByEmailIgnoreCaseAndBrandAndUserType(email, brand, userType);

            if (existingUser != null) {
                return existingUser;
            }
        }

        User user = createUser(migrationRequest.getSapAccountNumber(), createdByUsername, myMonUserId, brand, userType,
                portal, email);

        return userRepository.save(user);
    }

    private User createUser(String sapAccountNumber, String createdByUsername, String myMonUserId, Brand brand,
                            UserType userType, String portal, String email) {
        User user = new User();

        user.setMyMonUserId(myMonUserId);
        user.setEmail(email);
        user.setSapAccountNumber(sapAccountNumber);
        user.setBrand(brand);
        user.setUserType(userType);
        user.setCreatedBy(createdByUsername);
        user.setPortal(portal);

        return user;
    }

    @Transactional
    public void saveContact(RegistrationRequestBaseDTO registrationRequest, UUID userId) {
        saveContact(registrationRequest, getUser(userId));
    }

    private User saveContact(RegistrationRequestBaseDTO registrationRequest, User user) {
        if (user.isRegistrationCompleted()) {
            throw new HttpStatusResponseException(HttpStatus.BAD_REQUEST, "The requested action cannot be performed!",
                    user.getId());
        }


        UserContact userContact = user.getUserContact();

        if (userContact == null) {
            userContact = new UserContact();
            userContact.setUser(user);
            user.setUserContact(userContact);
        }

        userContact.setEmail(registrationRequest.getEmail());
        userContact.setFirstName(registrationRequest.getFirstName());
        userContact.setLastName(registrationRequest.getLastName());
        userContact.setPhone1(registrationRequest.getPhone1());
        userContact.setPhoneType1(registrationRequest.getPhoneType1());
        userContact.setPhone2(registrationRequest.getPhone2());
        userContact.setPhoneType2(registrationRequest.getPhoneType2());
        userContact.setAddress1(registrationRequest.getAddress1());
        userContact.setAddress2(registrationRequest.getAddress2());
        userContact.setCity(registrationRequest.getCity());
        userContact.setState(registrationRequest.getState());
        userContact.setZipcode(registrationRequest.getZipcode());
        String country = (registrationRequest.getCountry() != null && !registrationRequest.getCountry().isEmpty()) ? registrationRequest.getCountry() : "US";
        userContact.setCountry(country);

        userContactRepository.save(userContact);

        Long verificationCompletedTimestamp = userContact.getEmail().equalsIgnoreCase(user.getEmail()) ?
                Instant.now().getEpochSecond() : null;

        user.setVerificationCompletedTimestamp(verificationCompletedTimestamp);
        user.setPolicyAcceptedTimestamp(null);

        return userRepository.save(user);
    }

    @Transactional
    public User preRegisterUser(UserPreRegistrationRequestDTO preRegistrationRequest, String createdByUsername,
                                boolean errorIfUserExists) {

        String email = preRegistrationRequest.getEmail();
        Brand brand = preRegistrationRequest.getBrand();
        UserType userType = preRegistrationRequest.getUserType();
        String sapAccountNumber = preRegistrationRequest.getSapAccountNumber();
        String portal = preRegistrationRequest.getPortal();

        User existingUser = validateUserDoesNotExist(email, brand, userType, portal, sapAccountNumber, errorIfUserExists);

        if (existingUser == null) {
            User user = userRepository.save(createUser(sapAccountNumber, createdByUsername, null, brand, userType, portal, email));
            return saveContact(preRegistrationRequest, user);
        } else {
            return existingUser;
        }
    }

    @Transactional
    public User uAdminPreRegisterUser(UAdminUserPreRegistrationRequestDTO preRegistrationRequest, boolean errorIfUserExists
    , String adminId) {

        try {
            String email = preRegistrationRequest.getEmail();
            Brand brand = preRegistrationRequest.getBrand();
            String portal = preRegistrationRequest.getPortal();
            UserType userType = preRegistrationRequest.getUserType();
            String hqSapID = preRegistrationRequest.getHqSapId();

            List<LocationRole> locationRoles = preRegistrationRequest.getLocationRoles() != null
                ? preRegistrationRequest.getLocationRoles()
                : new ArrayList<LocationRole>();

            User existingUser = validateUserDoesNotExist(email, brand, userType, portal, null, errorIfUserExists);

            AuditDTO auditDTO = new AuditDTO();
            AuditToDTO to = new AuditToDTO();
            AuditFromDTO from = new AuditFromDTO();
            auditDTO.setApplication("USER_REGISTRATION");
            auditDTO.setTransactionId(UUID.randomUUID());
            auditDTO.setField("USER");
            auditDTO.setAction("PREREGISTER_USER");
            auditDTO.setUpdatedBy(adminId);

            to.setEmail(email);
            auditDTO.setAuditToDTO(to);
            ObjectMapper mapper = new ObjectMapper();
            mapper.enable(SerializationFeature.INDENT_OUTPUT);
            String json = mapper.writeValueAsString(auditDTO);

            sqsService.sendSQS(json);

            if (existingUser == null) {
                User user = createUser(null, "uadmin", null, brand, userType, portal, email);
                HashSet<UserLocationRole> userLocationRoles = new HashSet<UserLocationRole>();
                for (LocationRole locationRole: locationRoles) {
                    userLocationRoles.add(userLocationRoleBO.getUserLocationRole(locationRole.getLocation(), locationRole.getRole(), user));
                }
                user.setUserLocationRoles(new HashSet<UserLocationRole>(userLocationRoles));
                user.setHqSapId(hqSapID);
                user = userRepository.save(user);
                return saveContact(preRegistrationRequest, user);
            } else {
                return existingUser;
            }
        } catch(JsonProcessingException e) {
            throw new RuntimeException("Error creating audit json object ");
        }

    }

    private User validateUserDoesNotExist(String email, Brand brand, UserType userType, String portal,
                                          String sapAccountNumber, boolean errorIfUserExists) {
        User user = null;
        if(portal == null) {
            user = userRepository.findByEmailIgnoreCaseAndBrandAndUserType(email, brand, userType);
        } else {
            user = userRepository.findByEmailIgnoreCaseAndPortalIgnoreCase(email, portal);
        }

        if (user == null) {
            UserContact userContact = null;
            if(portal == null) {
                userContact = userContactRepository.findByEmailIgnoreCaseAndUser_BrandAndUser_UserType(email, brand, userType);
            } else {
                userContact = userContactRepository.findByEmailIgnoreCaseAndUser_PortalIgnoreCase(email, portal);
            }


            if (userContact != null) {
                user = userContact.getUser();
            }
        }

        if (user == null) {
            return null;
        }

        if ((sapAccountNumber == null) && (!errorIfUserExists)) {
            return user;
        }

        if ((sapAccountNumber != null) && (Integer.valueOf(user.getSapAccountNumber()).equals(Integer.valueOf(sapAccountNumber)))) {
            if (!errorIfUserExists) {
                return user;
            } else {
                throw new HttpStatusResponseException(HttpStatus.BAD_REQUEST, "Email and account already used!",
                        user.getId());
            }
        }
        throw new HttpStatusResponseException(HttpStatus.BAD_REQUEST, "Email already used with a different account!", user.getId());
    }

    public UserInformationDTO getUserInformation(UUID userId) {
        PortalParametersDTO portalParametersDTO = null;
        User user = getUser(userId);

        if (user == null) {
            throw new HttpStatusResponseException(HttpStatus.BAD_REQUEST, "The requested link is invalid!", userId);
        }

        String portal = user.getPortal();

        ArrayList<StateOption> states = userRegistrationService.getUserStateOptions(user);
        if (portal != null) {
            portalParametersDTO = portalParametersService.getPortalParameters(portal);
        }

        return new UserInformationDTO(user, states, portalParametersDTO);
    }

    @Transactional
    public AcceptPolicyResponseDTO acceptPolicy(UUID userId) {
        User user = getUser(userId);

        if (user.isRegistrationCompleted()) {
            throw new HttpStatusResponseException(HttpStatus.BAD_REQUEST, "The requested action cannot be performed!",
                    user.getId());
        }

        user.setPolicyAcceptedTimestamp(Instant.now().getEpochSecond());

        if (!user.isVerificationCompleted()) {
            user.setEmailVerificationCode(UUID.randomUUID());
        }

        userRepository.save(user);

        return new AcceptPolicyResponseDTO(!user.isVerificationCompleted());
    }

    @Transactional
    public CreateAccountResponseDTO createAccount(UUID userId, String password) {
        User user = getUser(userId);

        if (!user.isPolicyAccepted() || user.isRegistrationCompleted() || !user.isVerificationCompleted()) {
            throw new HttpStatusResponseException(HttpStatus.BAD_REQUEST, "The requested action cannot be performed!",
                    userId);
        }

        if (!userRegistrationService.isGigyaAccountAvailable(user, user.getUserContact().getEmail())) {
            user.setPolicyAcceptedTimestamp(null);
            userRepository.save(user);

            return new CreateAccountResponseDTO(null, null, false, null);
        }

        String uid = userRegistrationService.createGigyaAccount(user, password);

        user.setGigyaUid(uid);
        user.setRegistrationCompletedTimestamp(Instant.now().getEpochSecond());
        userRepository.save(user);

        return new CreateAccountResponseDTO(user.getBrand(), user.getUserType(), true, user.getPortal());
    }

    @Transactional
    public void configureSecurity(UUID userId) {
        User user = getUser(userId);
        userRegistrationService.registerAccountWithC7(user);
        user.setC7RegistrationTimestamp(Instant.now().getEpochSecond());
        userRepository.save(user);
    }

    public User getUser(UUID userId) {
        return userRepository.findOne(userId);
    }

    public User getUser(String email, String sapAccountNumber) {
        return userRepository.findByEmailAndSapAccountNumber(email, sapAccountNumber);
    }

    public boolean isAccountAvailable(UUID userId, String email) {
        User user = getUser(userId);

        if (user.isRegistrationCompleted()) {
            throw new HttpStatusResponseException(HttpStatus.BAD_REQUEST, "The requested action cannot be performed!",
                    user.getId());
        }

        return userRegistrationService.isGigyaAccountAvailable(user, email);
    }

    public boolean isEmailAvailable(String email, Brand brand, UserType userType) {
        // create a user so we can re-use existing method
        User user = new User();
        user.setBrand(brand);
        user.setUserType(userType);
        user.setId(UUID.randomUUID());

        return userRegistrationService.isGigyaAccountAvailable(user, email);
    }

    public boolean verifyEmail(UUID userId, UUID emailVerificationCode) {
        User user = getUser(userId);

        if (emailVerificationCode.equals(user.getEmailVerificationCode())) {
            return true;
        }

        logger.error("Failed email verification for user id: " + userId);

        return false;
    }

    public UserVerificationMethod getUserVerificationMethod(UUID userId) {
        User user = getUser(userId);

        if (StringUtils.hasText(user.getMyMonUserId())) {
            return UserVerificationMethod.MY_MON_ID;
        }

        return UserVerificationMethod.ACCOUNT_NUMBER;
    }

    @Transactional
    public boolean verifyCode(UUID userId, String code) {
        UserVerificationMethod verificationMethod = getUserVerificationMethod(userId);
        User user = getUser(userId);
        boolean verified = false;

        if (UserVerificationMethod.MY_MON_ID.equals(verificationMethod) &&
                code.equalsIgnoreCase(user.getMyMonUserId())) {
            verified = true;
        } else if (UserVerificationMethod.ACCOUNT_NUMBER.equals(verificationMethod) && NumberUtils.isNumber(code) &&
                Integer.valueOf(code).equals(Integer.valueOf(user.getSapAccountNumber()))) {
            verified = true;
        }

        if (verified) {
            user.setVerificationCompletedTimestamp(Instant.now().getEpochSecond());
            userRepository.save(user);
        } else {
            logger.error("Failed code verification for user id: " + userId);
        }

        return verified;
    }
}
