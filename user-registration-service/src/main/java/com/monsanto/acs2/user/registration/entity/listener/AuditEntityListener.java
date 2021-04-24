package com.monsanto.acs2.user.registration.entity.listener;

import com.monsanto.acs2.user.registration.entity.AuditEntity;

import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;
import java.time.Instant;

public class AuditEntityListener {

    @PrePersist
    public void onPrePersist(AuditEntity entity) {
        Long timestamp = Instant.now().getEpochSecond();

        entity.setCreationTimestamp(timestamp);
        entity.setLastModifiedTimestamp(timestamp);
    }

    @PreUpdate
    public void onPreUpdate(AuditEntity entity) {
        entity.setLastModifiedTimestamp(Instant.now().getEpochSecond());
    }
}
