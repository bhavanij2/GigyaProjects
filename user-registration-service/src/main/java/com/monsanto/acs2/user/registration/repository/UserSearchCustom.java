package com.monsanto.acs2.user.registration.repository;

import com.monsanto.acs2.user.registration.entity.User;

import java.util.List;

public interface UserSearchCustom {
    public List<User> searchUser(String hqSapId, String email, String first_name,
    String last_name, String locationId, String  city, String state, String brand,
    String persona, String country);
}