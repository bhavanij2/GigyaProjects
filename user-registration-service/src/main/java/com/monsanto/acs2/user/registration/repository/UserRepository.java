package com.monsanto.acs2.user.registration.repository;

import com.monsanto.acs2.user.registration.entity.Brand;
import com.monsanto.acs2.user.registration.entity.User;
import com.monsanto.acs2.user.registration.entity.UserType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import javax.persistence.EntityManager;

import java.util.List;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {

    User findByMyMonUserIdIgnoreCaseAndBrandAndUserType(String myMonUserId, Brand brand, UserType userType);

    User findByEmailIgnoreCaseAndBrandAndUserType(String email, Brand brand, UserType userType);
    
    User findByEmailIgnoreCaseAndPortalIgnoreCase(String email, String portal);

    User findByEmailAndSapAccountNumber(String email, String sapAccountNumber);

    @Query(value = "SELECT COUNT(*), year_month, " +
            "CASE created_by " +
            "   WHEN 'PD-ACS2-MYMON-SVC' THEN 'MyMonsanto' " +
            "   WHEN 'PD-EPAY-AKANA-SVC' THEN 'Email Blast' " +
            "   WHEN 'PD-CREDIT-APPLICATION-SERVICES-SVC' THEN 'Credit App' " +
            "   ELSE 'Other' " +
            "END AS entry_method " +
            "FROM (" +
            "   SELECT TO_CHAR(TO_TIMESTAMP(registration_completed_timestamp) AT TIME ZONE :timeZone, 'YYYY-MM') " +
            "       AS year_month, created_by " +
            "   FROM public.user " +
            "   WHERE registration_completed_timestamp IS NOT NULL AND test_user = false " +
            "       AND registration_completed_timestamp >= :fromTimestamp " +
            "       AND registration_completed_timestamp <= :toTimestamp" +
            ") AS registration_data " +
            "GROUP BY year_month, created_by " +
            "ORDER BY year_month", nativeQuery = true)
    List<Object[]> getMetrics(@Param("timeZone") String timeZone, @Param("fromTimestamp") Long fromTimestamp,
                              @Param("toTimestamp") Long toTimestamp);

    List<User> findByRegistrationCompletedTimestampIsNull();

    List<User> findByRegistrationCompletedTimestampIsNullAndHqSapId(String hqSapId);

}
