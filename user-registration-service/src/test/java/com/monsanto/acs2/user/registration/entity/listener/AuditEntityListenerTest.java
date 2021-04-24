package com.monsanto.acs2.user.registration.entity.listener;

import com.monsanto.acs2.user.registration.entity.AuditEntity;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

import static org.mockito.Matchers.anyLong;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;

@RunWith(MockitoJUnitRunner.class)
public class AuditEntityListenerTest {
    @Mock
    private AuditEntity entity;
    @InjectMocks
    private AuditEntityListener listener;

    @Test
    public void onPrePersist() {
        listener.onPrePersist(entity);

        verify(entity).setCreationTimestamp(anyLong());
        verify(entity).setLastModifiedTimestamp(anyLong());
        verifyNoMoreInteractions(entity);
    }

    @Test
    public void onPreUpdate() {
        listener.onPreUpdate(entity);

        verify(entity).setLastModifiedTimestamp(anyLong());
        verifyNoMoreInteractions(entity);
    }
}