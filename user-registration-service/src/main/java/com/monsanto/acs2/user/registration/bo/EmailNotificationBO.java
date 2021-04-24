package com.monsanto.acs2.user.registration.bo;

import com.monsanto.acs2.user.registration.dto.EmailMessageDTO;
import com.monsanto.acs2.user.registration.entity.*;
import com.monsanto.acs2.user.registration.service.EmailService;
import com.monsanto.acs2.user.registration.service.PortalParametersService;
import io.prometheus.client.Counter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
public class EmailNotificationBO {
    private static final Counter CRITICAL_ERRORS = Counter.build()
            .name("counter_critical_errors")
            .help("Number of critical errors encountered.")
            .labelNames("action")
            .register();
    private final Logger logger = LoggerFactory.getLogger(getClass());
    private final EmailService emailService;
    private final PortalParametersService portalParametersService;
    private final EmailTemplateBO emailTemplateBO;

    public EmailNotificationBO(EmailService emailService, EmailTemplateBO emailTemplateBO, PortalParametersService portalParametersService) {
        this.emailService = emailService;
        this.emailTemplateBO = emailTemplateBO;
        this.portalParametersService = portalParametersService;
    }

    @Async
    public void sendRegistrationCompleteEmail(User user) {
        Map<String, Object> data = new HashMap<>();
        data.put("brand", user.getBrand());
        data.put("userType", user.getUserType());

        String emailSender = getEmailSender(user);
        EmailTemplateCode emailTemplateCode = EmailTemplateCode.REGISTRATION_COMPLETE;

        sendEmail(emailTemplateCode, user, data, null, emailSender);
    }

    @Async
    public void sendPreRegistrationInviteEmail(User user, boolean resend) {
        Map<String, Object> data = new HashMap<>();
        data.put("userId", user.getId());
        data.put("resend", resend);

        String emailSender = getEmailSender(user);
        EmailTemplateCode emailTemplateCode = EmailTemplateCode.PRE_REGISTRATION_INVITE;

        sendEmail(emailTemplateCode, user, data, null, emailSender);
    }

    @Async
    public void sendVerificationEmail(User user) {
        Map<String, Object> data = new HashMap<>();
        data.put("userId", user.getId());
        data.put("emailVerificationCode", user.getEmailVerificationCode());

        sendEmail(EmailTemplateCode.EMAIL_VERIFICATION, user, data, null, EmailSenders.NATIONAL_GROWER_SENDER);
    }

    private void sendEmail(
            EmailTemplateCode code,
            User user,
            Map<String, Object> data,
            String configurationSetName,
            String emailSender
    ) {
        try {
            EmailTemplate emailTemplate = emailService.getEmailTemplate(user, code);

            String body = emailTemplateBO.processTemplate(code.toString(), emailTemplate.getTemplate(), data);

            EmailMessageDTO emailMessageDTO = new EmailMessageDTO();
            emailMessageDTO.setBody(body);
            emailMessageDTO.setFrom(emailSender);
            emailMessageDTO.setTo(user.getUserContact().getEmail());
            emailMessageDTO.setSubject(emailTemplate.getSubject());

            emailService.sendEmail(emailMessageDTO, user.getId(), configurationSetName);
        } catch (Exception e) {
            logger.error("Failed to send " + code + " email for user id: " + user.getId(), e);
            CRITICAL_ERRORS.labels("email_notification").inc();
        }
    }

    private String getEmailSender(User user) {
        String portal = user.getPortal();

        // TODO: Remove else after all users have portal configured
        if(portal != null) {
            return portalParametersService.getPortalParameters(portal).getEmailSource();
        } else {
            if(user.getUserType() == UserType.grower) {
                return EmailSenders.NATIONAL_GROWER_SENDER;
            } else {
                return EmailSenders.NATIONAL_DEALER_SENDER;
            }
        }
    }
}
