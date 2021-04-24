package com.monsanto.acs2.user.registration.service;

import com.monsanto.acs2.user.registration.bo.UserAdminBO;
import com.monsanto.acs2.user.registration.dto.PendingUserDTO;
import com.monsanto.acs2.user.registration.dto.RegistrationMetricDTO;
import com.monsanto.acs2.user.registration.entity.Brand;
import com.monsanto.acs2.user.registration.entity.UserType;
import com.monsanto.acs2.user.registration.security.CurrentUsername;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicReference;
import java.util.stream.Collectors;


@RestController
public class UserAdminController {
    private final UserAdminBO userAdminBO;

    public UserAdminController(UserAdminBO userAdminBO) {
        this.userAdminBO = userAdminBO;
    }

    @DeleteMapping("/maintenance")
    public void deleteUser(
        @RequestParam String email, @RequestParam Brand brand,
        @RequestParam UserType userType,
        @CurrentUsername(allowAppClients = true, requiredEntitlement = "delete-user-registration") String securedUsername) {
        UUID userId = userAdminBO.getUser(email, brand, userType).getId();

        userAdminBO.deleteC7Account(userId);
        userAdminBO.deleteGigyaAccount(userId);
        userAdminBO.deleteUser(userId);
    }

    @PutMapping("/maintenance")
    public void updateUser(@RequestParam String email, @RequestParam Brand brand, @RequestParam UserType userType,
                           @RequestParam String sapAccountNumber,
                           @CurrentUsername(requiredEntitlement = "edit-user-registration") String securedUsername) {
        UUID userId = userAdminBO.getUser(email, brand, userType).getId();

        userAdminBO.deleteC7Account(userId);
        userAdminBO.updateUser(userId, sapAccountNumber);
    }

    @GetMapping("/registration-metrics")
    public List<RegistrationMetricDTO> getRegistrationMetrics(
            @RequestParam String timeZone, @RequestParam Long fromTimestamp, @RequestParam Long toTimestamp,
            @CurrentUsername(requiredEntitlement = "view-registration-metrics") String securedUsername) {
        return userAdminBO.getRegistrationMetrics(timeZone, fromTimestamp, toTimestamp);
    }

    @GetMapping("/users/pending")
    public List<PendingUserDTO> getPendingUsers(
            @RequestParam(value = "hq-sap-id", required = false) String hqSapId,
            @RequestParam(value = "email", required = false) String email,
            @RequestParam(value = "last-name", required = false) String lastName,
            @RequestParam(value = "first-name", required = false) String firstName,
            @RequestParam(value = "sap-location-id", required = false) String locationId,
            @RequestParam(value = "city", required = false) String city,
            @RequestParam(value = "state", required = false) String state,
            @RequestParam(value = "brand", required = false) String brand,
            @RequestParam(value = "persona", required = false) String persona,
            @RequestParam(value = "country", required = false) String country) {
        return userAdminBO.getPendingUsers(hqSapId, email, firstName, lastName,
                locationId, city, state, brand, persona, country);
    }

    @PutMapping("/users/pending/role")
    public String updateUserLocationRole(
            @RequestParam String oldRoleId,
            @RequestParam String newRoleId,
            @CurrentUsername(allowAppClients = true) String securedUsername
    ) {
        List<PendingUserDTO> pendingUserDTOS = userAdminBO.getPendingUsers();
        List<PendingUserDTO> dealers = pendingUserDTOS.stream()
                .filter(userDTO -> "dealer".equals(userDTO.getUserType().name()))
                .collect(Collectors.toList());
        AtomicInteger updatedUsers = new AtomicInteger(0);
        dealers.forEach(dealer -> {
            boolean isUpdated = userAdminBO.updateUserLocationRole(dealer.getId(), oldRoleId, newRoleId);
            if(isUpdated) {
                updatedUsers.getAndIncrement();
            }
        });
        return "Number of users updated: " + updatedUsers;
    }
}
