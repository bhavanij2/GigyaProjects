package com.monsanto.acs2.user.registration.repository;

import com.monsanto.acs2.user.registration.entity.Location;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.UUID;

public interface LocationRepository extends JpaRepository<Location, UUID> {
    @Query(value = "SELECT COUNT(*) > 0 FROM public.location WHERE location.sap_id = :sapId", nativeQuery = true)
    public boolean existsBySapId(@Param("sapId") String sapId);

    @Query(value = "SELECT sap_id, source_system, hq_sap_id, sap_location_name, sap_location_city, sap_location_state, creation_timestamp, last_modified_timestamp FROM public.location WHERE location.sap_id = :sapId", nativeQuery = true)
    public Location findBySapId(@Param("sapId") String sapId);
}
