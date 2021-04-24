package com.monsanto.acs2.user.registration.repository;

import com.monsanto.acs2.user.registration.entity.Brand;
import com.monsanto.acs2.user.registration.entity.UserContact;
import com.monsanto.acs2.user.registration.entity.UserType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface UserContactRepository extends JpaRepository<UserContact, UUID> {
    UserContact findByEmailIgnoreCaseAndUser_BrandAndUser_UserType(String email, Brand brand, UserType userType);
    
    UserContact findByEmailIgnoreCaseAndUser_PortalIgnoreCase(String email, String portal);
}
