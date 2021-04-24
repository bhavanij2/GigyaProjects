package com.monsanto.acs2.user.registration.repository;

import com.monsanto.acs2.user.registration.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.UUID;

public interface RoleRepository extends JpaRepository<Role, UUID> {
    @Query(value = "SELECT COUNT(*) > 0 FROM public.role WHERE role_id = :roleId", nativeQuery = true)
    public boolean existsByRoleId(@Param("roleId") String roleId);

    @Query(value = "SELECT role_id, creation_timestamp, last_modified_timestamp FROM public.role WHERE role_id = :roleId", nativeQuery = true)
    public Role findByRoleId(@Param("roleId") String roleId);
}
