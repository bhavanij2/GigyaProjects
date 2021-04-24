package com.monsanto.acs2.user.registration.bo;

import com.monsanto.acs2.user.registration.dto.EmailMessageDTO;
import com.monsanto.acs2.user.registration.dto.PortalParametersDTO;
import com.monsanto.acs2.user.registration.entity.*;
import com.monsanto.acs2.user.registration.service.EmailService;
import com.monsanto.acs2.user.registration.service.PortalParametersService;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;
import org.slf4j.Logger;
import org.springframework.test.util.ReflectionTestUtils;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Matchers.anyMapOf;
import static org.mockito.Matchers.anyString;
import static org.mockito.Matchers.contains;
import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.*;

@RunWith(MockitoJUnitRunner.class)
public class EmailNotificationBOTest {
    private EmailNotificationBO emailNotificationBO;

    @Mock
    private EmailService emailService;
    @Mock
    private EmailTemplateBO emailTemplateBO;
    @Mock
    private PortalParametersService portalParametersService;
    @Mock
    private PortalParametersDTO portalParametersDTO;
    @Mock
    private Logger logger;

    @Before
    public void setUp() throws Exception {
        emailNotificationBO = new EmailNotificationBO(emailService, emailTemplateBO, portalParametersService);

        ReflectionTestUtils.setField(emailNotificationBO, "logger", logger);
    }

    @Test
    public void sendRegistrationCompleteEmail() throws Exception {
        UUID userId = UUID.randomUUID();
        User user = mock(User.class);
        UserContact userContact = mock(UserContact.class);
        when(user.getUserContact()).thenReturn(userContact);
        when(user.getId()).thenReturn(userId);
        when(user.getBrand()).thenReturn(Brand.national);
        when(user.getUserType()).thenReturn(UserType.grower);
        when(user.getPortal()).thenReturn("dekalbasgrowdeltapine");
        when(userContact.getEmail()).thenReturn("test_user@example.com");
        EmailTemplate emailTemplate = mock(EmailTemplate.class);
        when(emailTemplate.getSubject()).thenReturn("Welcome!");
        when(emailTemplate.getTemplate()).thenReturn("template content");
        when(emailService.getEmailTemplate(user, EmailTemplateCode.REGISTRATION_COMPLETE)).thenReturn(emailTemplate);
        when(emailTemplateBO.processTemplate(anyString(), anyString(), anyMapOf(String.class, Object.class)))
                .thenReturn("test");
        when(portalParametersService.getPortalParameters("dekalbasgrowdeltapine")).thenReturn(portalParametersDTO);
        when(portalParametersDTO.getEmailSource()).thenReturn("farmflex.credit@monsanto.com");

        emailNotificationBO.sendRegistrationCompleteEmail(user);

        ArgumentCaptor<Map> templateDataArgumentCaptor = ArgumentCaptor.forClass(Map.class);
        verify(emailTemplateBO).processTemplate(eq(EmailTemplateCode.REGISTRATION_COMPLETE.toString()),
                eq("template content"), templateDataArgumentCaptor.capture());
        Map<String, Object> templateData = templateDataArgumentCaptor.getValue();
        assertThat(templateData).hasSize(2);
        assertThat(templateData.get("brand")).isEqualTo(Brand.national);
        assertThat(templateData.get("userType")).isEqualTo(UserType.grower);
        ArgumentCaptor<EmailMessageDTO> requestArgumentCaptor = ArgumentCaptor.forClass(EmailMessageDTO.class);
        verify(emailService).sendEmail(requestArgumentCaptor.capture(), eq(userId), eq(null));
        EmailMessageDTO emailMessageDTO = requestArgumentCaptor.getValue();
        assertThat(emailMessageDTO.getTo()).isEqualTo("test_user@example.com");
        assertThat(emailMessageDTO.getFrom()).isEqualTo("farmflex.credit@monsanto.com");
        assertThat(emailMessageDTO.getSubject()).isEqualTo("Welcome!");
        assertThat(emailMessageDTO.getBody()).isEqualTo("test");
    }

    @Test
    public void sendVerificationEmail() throws Exception {
        UUID userId = UUID.randomUUID();
        UUID emailVerificationCode = UUID.randomUUID();
        User user = mock(User.class);
        UserContact userContact = mock(UserContact.class);
        when(user.getUserContact()).thenReturn(userContact);
        when(user.getId()).thenReturn(userId);
        when(user.getEmailVerificationCode()).thenReturn(emailVerificationCode);
        when(user.getPortal()).thenReturn("dekalbasgrowdeltapine");
        when(userContact.getEmail()).thenReturn("test_user@example.com");
        EmailTemplate emailTemplate = mock(EmailTemplate.class);
        when(emailTemplate.getSubject()).thenReturn("Welcome!");
        when(emailTemplate.getTemplate()).thenReturn("template content");
        when(emailService.getEmailTemplate(user, EmailTemplateCode.EMAIL_VERIFICATION)).thenReturn(emailTemplate);
        when(emailTemplateBO.processTemplate(anyString(), anyString(), anyMapOf(String.class, Object.class)))
                .thenReturn("test");
        when(portalParametersService.getPortalParameters("dekalbasgrowdeltapine")).thenReturn(portalParametersDTO);
        when(portalParametersDTO.getEmailSource()).thenReturn("farmflex.credit@monsanto.com");

        emailNotificationBO.sendVerificationEmail(user);

        ArgumentCaptor<Map> templateDataArgumentCaptor = ArgumentCaptor.forClass(Map.class);
        verify(emailTemplateBO).processTemplate(eq(EmailTemplateCode.EMAIL_VERIFICATION.toString()),
                eq("template content"), templateDataArgumentCaptor.capture());
        Map<String, Object> templateData = templateDataArgumentCaptor.getValue();
        assertThat(templateData).hasSize(2);
        assertThat(templateData.get("userId")).isEqualTo(userId);
        assertThat(templateData.get("emailVerificationCode")).isEqualTo(emailVerificationCode);
        ArgumentCaptor<EmailMessageDTO> requestArgumentCaptor = ArgumentCaptor.forClass(EmailMessageDTO.class);
        verify(emailService).sendEmail(requestArgumentCaptor.capture(), eq(userId), eq(null));
        EmailMessageDTO emailMessageDTO = requestArgumentCaptor.getValue();
        assertThat(emailMessageDTO.getTo()).isEqualTo("test_user@example.com");
        assertThat(emailMessageDTO.getFrom()).isEqualTo("farmflex.credit@monsanto.com");
        assertThat(emailMessageDTO.getSubject()).isEqualTo("Welcome!");
        assertThat(emailMessageDTO.getBody()).isEqualTo("test");
    }

    @Test
    public void sendPreRegistrationInviteEmail_WhenResendIsFalse() throws Exception {
        UUID userId = UUID.randomUUID();
        User user = mock(User.class);
        UserContact userContact = mock(UserContact.class);
        when(user.getUserContact()).thenReturn(userContact);
        when(user.getId()).thenReturn(userId);
        when(user.getUserType()).thenReturn(UserType.grower);
        when(userContact.getEmail()).thenReturn("test_user@example.com");
        when(user.getPortal()).thenReturn("dekalbasgrowdeltapine");
        EmailTemplate emailTemplate = mock(EmailTemplate.class);
        when(emailTemplate.getSubject()).thenReturn("Welcome!");
        when(emailTemplate.getTemplate()).thenReturn("template content");
        when(emailService.getEmailTemplate(user, EmailTemplateCode.PRE_REGISTRATION_INVITE)).thenReturn(emailTemplate);
        when(emailTemplateBO.processTemplate(anyString(), anyString(), anyMapOf(String.class, Object.class)))
                .thenReturn("test");
        when(portalParametersService.getPortalParameters("dekalbasgrowdeltapine")).thenReturn(portalParametersDTO);
        when(portalParametersDTO.getEmailSource()).thenReturn("farmflex.credit@monsanto.com");

        emailNotificationBO.sendPreRegistrationInviteEmail(user, false);

        ArgumentCaptor<Map> templateDataArgumentCaptor = ArgumentCaptor.forClass(Map.class);
        verify(emailTemplateBO).processTemplate(eq(EmailTemplateCode.PRE_REGISTRATION_INVITE.toString()),
                eq("template content"), templateDataArgumentCaptor.capture());
        Map<String, Object> templateData = templateDataArgumentCaptor.getValue();
        assertThat(templateData).hasSize(2);
        assertThat(templateData.get("userId")).isEqualTo(userId);
        assertThat(templateData.get("resend")).isEqualTo(false);
        ArgumentCaptor<EmailMessageDTO> requestArgumentCaptor = ArgumentCaptor.forClass(EmailMessageDTO.class);
        verify(emailService).sendEmail(requestArgumentCaptor.capture(), eq(userId),
                eq(null));
        EmailMessageDTO emailMessageDTO = requestArgumentCaptor.getValue();
        assertThat(emailMessageDTO.getTo()).isEqualTo("test_user@example.com");
        assertThat(emailMessageDTO.getFrom()).isEqualTo(EmailSenders.NATIONAL_GROWER_SENDER);
        assertThat(emailMessageDTO.getSubject()).isEqualTo("Welcome!");
        assertThat(emailMessageDTO.getBody()).isEqualTo("test");
    }

    @Test
    public void sendPreRegistrationInviteEmail_WhenResendIsTrue() throws Exception {
        UUID userId = UUID.randomUUID();
        User user = mock(User.class);
        UserContact userContact = mock(UserContact.class);
        when(user.getUserContact()).thenReturn(userContact);
        when(user.getId()).thenReturn(userId);
        when(user.getUserType()).thenReturn(UserType.grower);
        when(userContact.getEmail()).thenReturn("test_user@example.com");
        when(user.getPortal()).thenReturn("dekalbasgrowdeltapine");
        EmailTemplate emailTemplate = mock(EmailTemplate.class);
        when(emailTemplate.getSubject()).thenReturn("Welcome!");
        when(emailTemplate.getTemplate()).thenReturn("template content");
        when(emailService.getEmailTemplate(user, EmailTemplateCode.PRE_REGISTRATION_INVITE)).thenReturn(emailTemplate);
        when(emailTemplateBO.processTemplate(anyString(), anyString(), anyMapOf(String.class, Object.class)))
                .thenReturn("test");
        when(portalParametersService.getPortalParameters("dekalbasgrowdeltapine")).thenReturn(portalParametersDTO);
        when(portalParametersDTO.getEmailSource()).thenReturn("farmflex.credit@monsanto.com");
        
        emailNotificationBO.sendPreRegistrationInviteEmail(user, true);

        ArgumentCaptor<Map> templateDataArgumentCaptor = ArgumentCaptor.forClass(Map.class);
        verify(emailTemplateBO).processTemplate(eq(EmailTemplateCode.PRE_REGISTRATION_INVITE.toString()),
                eq("template content"), templateDataArgumentCaptor.capture());
        Map<String, Object> templateData = templateDataArgumentCaptor.getValue();
        assertThat(templateData).hasSize(2);
        assertThat(templateData.get("userId")).isEqualTo(userId);
        assertThat(templateData.get("resend")).isEqualTo(true);
        ArgumentCaptor<EmailMessageDTO> requestArgumentCaptor = ArgumentCaptor.forClass(EmailMessageDTO.class);
        verify(emailService).sendEmail(requestArgumentCaptor.capture(), eq(userId),
                eq(null));
        EmailMessageDTO emailMessageDTO = requestArgumentCaptor.getValue();
        assertThat(emailMessageDTO.getTo()).isEqualTo("test_user@example.com");
        assertThat(emailMessageDTO.getFrom()).isEqualTo(EmailSenders.NATIONAL_GROWER_SENDER);
        assertThat(emailMessageDTO.getSubject()).isEqualTo("Welcome!");
        assertThat(emailMessageDTO.getBody()).isEqualTo("test");
    }

    @Test
    public void sendPreRegistrationInviteEmail_WhenUserIsDealer() throws Exception {
        UUID userId = UUID.randomUUID();
        User user = mock(User.class);
        UserContact userContact = mock(UserContact.class);
        when(user.getUserContact()).thenReturn(userContact);
        when(user.getId()).thenReturn(userId);
        when(user.getUserType()).thenReturn(UserType.dealer);
        when(user.getPortal()).thenReturn("mycrop");
        when(userContact.getEmail()).thenReturn("test_user@example.com");
        EmailTemplate emailTemplate = mock(EmailTemplate.class);
        when(emailTemplate.getSubject()).thenReturn("Welcome!");
        when(emailTemplate.getTemplate()).thenReturn("template content");

        when(emailService.getEmailTemplate(user, EmailTemplateCode.PRE_REGISTRATION_INVITE)).thenReturn(emailTemplate);
        when(emailTemplateBO.processTemplate(anyString(), anyString(), anyMapOf(String.class, Object.class)))
                .thenReturn("test");
        when(portalParametersService.getPortalParameters("mycrop")).thenReturn(portalParametersDTO);
        when(portalParametersDTO.getEmailSource()).thenReturn("mycrop@bayer.com");
                
        emailNotificationBO.sendPreRegistrationInviteEmail(user, false);

        ArgumentCaptor<Map> templateDataArgumentCaptor = ArgumentCaptor.forClass(Map.class);
        verify(emailTemplateBO).processTemplate(eq(EmailTemplateCode.PRE_REGISTRATION_INVITE.toString()),
                eq("template content"), templateDataArgumentCaptor.capture());
        Map<String, Object> templateData = templateDataArgumentCaptor.getValue();
        assertThat(templateData).hasSize(2);
        assertThat(templateData.get("userId")).isEqualTo(userId);
        assertThat(templateData.get("resend")).isEqualTo(false);
        ArgumentCaptor<EmailMessageDTO> requestArgumentCaptor = ArgumentCaptor.forClass(EmailMessageDTO.class);
        verify(emailService).sendEmail(requestArgumentCaptor.capture(), eq(userId),
                eq(null));
        EmailMessageDTO emailMessageDTO = requestArgumentCaptor.getValue();
        assertThat(emailMessageDTO.getTo()).isEqualTo("test_user@example.com");
        assertThat(emailMessageDTO.getFrom()).isEqualTo(EmailSenders.NATIONAL_DEALER_SENDER);
        assertThat(emailMessageDTO.getSubject()).isEqualTo("Welcome!");
        assertThat(emailMessageDTO.getBody()).isEqualTo("test");
    }


    @Test
    public void sendEmail_ExceptionLogged_WhenThrown() throws Exception {
        UUID userId = UUID.randomUUID();
        User user = mock(User.class);
        when(user.getId()).thenReturn(userId);
        when(user.getUserType()).thenReturn(UserType.grower);
        EmailTemplate emailTemplate = mock(EmailTemplate.class);
        when(emailService.getEmailTemplate(user, EmailTemplateCode.REGISTRATION_COMPLETE)).thenReturn(emailTemplate);
        IOException exception = new IOException();
        when(emailTemplateBO.processTemplate(anyString(), anyString(), anyMapOf(String.class, Object.class)))
                .thenThrow(exception);

        emailNotificationBO.sendRegistrationCompleteEmail(user);

        verify(logger).error(contains("send REGISTRATION_COMPLETE email for user id: " + userId), eq(exception));
    }

    @Test
    public void sendEmail_ExceptionLogged_WhenThrownForDealer() throws Exception {
        UUID userId = UUID.randomUUID();
        User user = mock(User.class);
        when(user.getId()).thenReturn(userId);
        when(user.getUserType()).thenReturn(UserType.dealer);
        EmailTemplate emailTemplate = mock(EmailTemplate.class);
        when(emailService.getEmailTemplate(user, EmailTemplateCode.REGISTRATION_COMPLETE)).thenReturn(emailTemplate);
        IOException exception = new IOException();
        when(emailTemplateBO.processTemplate(anyString(), anyString(), anyMapOf(String.class, Object.class)))
                .thenThrow(exception);

        emailNotificationBO.sendRegistrationCompleteEmail(user);

        verify(logger).error(contains("send REGISTRATION_COMPLETE email for user id: " + userId), eq(exception));
    }
}