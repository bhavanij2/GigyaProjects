package com.monsanto.acs2.user.registration.bo;

import com.monsanto.acs2.user.registration.dto.RegistrationMetricDTO;
import com.monsanto.acs2.user.registration.dto.PendingUserDTO;
import com.monsanto.acs2.user.registration.entity.*;
import com.monsanto.acs2.user.registration.exception.HttpStatusResponseException;
import com.monsanto.acs2.user.registration.repository.UserContactRepository;
import com.monsanto.acs2.user.registration.repository.UserRepository;
import com.monsanto.acs2.user.registration.service.UserRegistrationService;
import com.monsanto.acs2.user.registration.repository.UserSearchCustom;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import javax.transaction.Transactional;
import java.math.BigInteger;
import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Component
public class UserAdminBO {
    private final UserRepository userRepository;
    private final UserSearchCustom userSearchCustomImpl;
    private final UserContactRepository userContactRepository;
    private final UserRegistrationService userRegistrationService;
    private final UserLocationRoleBO userLocationRoleBO;

    public UserAdminBO(UserRepository userRepository, UserContactRepository userContactRepository,
                       UserRegistrationService userRegistrationService,
                       UserSearchCustom userSearchCustomImpl, UserLocationRoleBO userLocationRoleBO) {
        this.userRepository = userRepository;
        this.userContactRepository = userContactRepository;
        this.userRegistrationService = userRegistrationService;
        this.userSearchCustomImpl = userSearchCustomImpl;
        this.userLocationRoleBO = userLocationRoleBO;
    }

    @Transactional
    public void deleteC7Account(UUID userId) {
        User user = userRepository.findOne(userId);

        if (user.getC7RegistrationTimestamp() != null) {
            userRegistrationService.deleteC7Account(user);

            user.setC7RegistrationTimestamp(null);
            userRepository.save(user);
        }
    }

    @Transactional
    public void deleteGigyaAccount(UUID userId) {
        User user = userRepository.findOne(userId);

        if (user.getGigyaUid() != null) {
            userRegistrationService.deleteGigyaAccount(user);

            user.setGigyaUid(null);
            user.setRegistrationCompletedTimestamp(null);
            userRepository.save(user);
        }
    }

    public User getUser(String email, Brand brand, UserType userType) {
        UserContact userContact = userContactRepository
                .findByEmailIgnoreCaseAndUser_BrandAndUser_UserType(email, brand, userType);

        if (userContact == null) {
            throw new HttpStatusResponseException(HttpStatus.BAD_REQUEST, "User not found!", null);
        }

        return userContact.getUser();
    }

    @Transactional
    public void updateUser(UUID userId, String sapAccountNumber) {
        User user = userRepository.findOne(userId);

        user.setSapAccountNumber(sapAccountNumber);

        if (user.getGigyaUid() != null) {
            userRegistrationService.registerAccountWithC7(user);
            user.setC7RegistrationTimestamp(Instant.now().getEpochSecond());
        }

        userRepository.save(user);
    }

    @Transactional
    public void deleteUser(UUID userId) {
        User user = userRepository.findOne(userId);

        if (user.getC7RegistrationTimestamp() != null || user.getGigyaUid() != null) {
            throw new HttpStatusResponseException(HttpStatus.BAD_REQUEST, "User has an associated account!", null);
        }

        userContactRepository.delete(user.getUserContact());
        userRepository.delete(user);
    }

    public List<RegistrationMetricDTO> getRegistrationMetrics(String timeZone, Long fromTimestamp, Long toTimestamp) {
        return userRepository.getMetrics(timeZone, fromTimestamp, toTimestamp).stream()
                .map(metric -> new RegistrationMetricDTO((BigInteger) metric[0], (String) metric[1], (String) metric[2]))
                .collect(Collectors.toList());
    }

    public List<PendingUserDTO> getPendingUsers() {
        return userRepository.findByRegistrationCompletedTimestampIsNull().stream().map(u -> new PendingUserDTO(u))
                .collect(Collectors.toList());
    }

    public List<PendingUserDTO> getPendingUsers(String hqSapId, String email, String firstName,
                                                String lastName, String locationId, String city, String state,
                                                String brand, String persona, String country) {
        return userSearchCustomImpl.searchUser(hqSapId, email, firstName, lastName,
                locationId, city, state, brand, persona, country)
                .stream()
                .map(u -> new PendingUserDTO(u))
                .collect(Collectors.toList());
    }

    @Transactional
    public boolean updateUserLocationRole(UUID userId, String oldRoleId, String newRoleId) {
        User user = userRepository.findOne(userId);
        List<String> updatedLocations = new ArrayList<>();
        if (null != user.getUserLocationRoles() && user.getUserLocationRoles().size() > 0) {
            Set<UserLocationRole> oldUserLocationRoles = user.getUserLocationRoles();
            oldUserLocationRoles.forEach(oldUserLocationRole -> {
                UserLocationRole newUserLocationRole = new UserLocationRole();
                if (oldRoleId.equals(oldUserLocationRole.getRole().getRoleId())) {
                    newUserLocationRole.setLocation(oldUserLocationRole.getLocation());
                    newUserLocationRole.setCreationTimestamp(oldUserLocationRole.getCreationTimestamp());
                    Role newRole = new Role();
                    newRole.setRoleId(newRoleId);
                    newUserLocationRole.setRole(newRole);
                    user.removeUserLocationRole(oldUserLocationRole);
                    newUserLocationRole = userLocationRoleBO.getUserLocationRole(newUserLocationRole.getLocation(),
                            newUserLocationRole.getRole(), user);
                    user.addUserLocationRole(newUserLocationRole);
                    updatedLocations.add(newUserLocationRole.getLocation().getSapId());
                }
            });
            userRepository.save(user);
        }

        boolean updatedUser = false;
        if (updatedLocations.size() > 0) {
            updatedUser = true;
        }
        return updatedUser;
    }
}
