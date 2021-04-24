package com.monsanto.acs2.user.registration.service;

import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.simpleemail.AmazonSimpleEmailService;
import com.amazonaws.services.simpleemail.AmazonSimpleEmailServiceClientBuilder;
import com.amazonaws.services.simpleemail.model.*;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.monsanto.acs2.user.registration.dto.EmailMessageDTO;
import com.monsanto.acs2.user.registration.entity.EmailTemplate;
import com.monsanto.acs2.user.registration.entity.EmailTemplateCode;
import com.monsanto.acs2.user.registration.entity.User;
import io.prometheus.client.Gauge;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.vault.core.VaultOperations;
import org.springframework.vault.support.VaultResponse;
import org.springframework.web.client.RestTemplate;
import java.util.Map;
import java.util.UUID;

@Component
public class EmailService {
    private static final Gauge awsResponseTime = Gauge.build()
            .name("gauge_aws_response")
            .help("Response time for AWS requests.")
            .labelNames("action")
            .register();
    private final VaultOperations vaultOperations;
    private final SecurityService securityService;
    private final RestTemplate restTemplate;
    private final PortalParametersService portalParametersService;
    @Value("${c7.aem.service.endpoint}")
    private String c7AemServiceEndpoint;

    @Value("${aws.user.vault.path}")
    private String vaultAwsUserPath;

    public EmailService(VaultOperations vaultOperations, SecurityService securityService, PortalParametersService portalParametersService) {
        this.vaultOperations = vaultOperations;
        this.securityService = securityService;
        this.portalParametersService = portalParametersService;
        this.restTemplate = new RestTemplate();
    }

    public EmailTemplate getEmailTemplate(User user, EmailTemplateCode code) throws Exception {
        HttpHeaders headers = securityService.getOAuthHeaders();
        HttpEntity entity = new HttpEntity(headers);
        ResponseEntity<String> response;
        try {
            String domain = portalParametersService.getPortalParameters(user.getPortal()).getPortalUrl();
            String url = c7AemServiceEndpoint + "/email?path=/emails/" + code + "&domain=" + domain;
            response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
        } catch(Exception e){
            throw (e);
        }
        JsonNode responseBody = new ObjectMapper().readTree(response.getBody());
        EmailTemplate emailTemplate = new EmailTemplate();
        emailTemplate.setCode(code);
        emailTemplate.setSubject(responseBody.get("subject").textValue());
        emailTemplate.setTemplate(responseBody.get("body").textValue());
        return emailTemplate;
    }

    public void sendEmail(EmailMessageDTO emailMessageDTO, UUID userId, String configurationSetName) {
        VaultResponse vaultResponse = vaultOperations.read(vaultAwsUserPath);
        Map<String, Object> awsProps = vaultResponse.getData();
        BasicAWSCredentials awsCreds = new BasicAWSCredentials((String) awsProps.get("aws_access_key_id"),
                (String) awsProps.get("aws_secret_access_key"));
        AmazonSimpleEmailService client =
                AmazonSimpleEmailServiceClientBuilder.standard()
                        .withRegion(Regions.US_EAST_1)
                        .withCredentials(new AWSStaticCredentialsProvider(awsCreds))
                        .build();

        Body body = new Body()
                .withHtml(new Content()
                        .withCharset("UTF-8")
                        .withData(emailMessageDTO.getBody()));

        SendEmailRequest request = new SendEmailRequest()
                .withDestination(
                        new Destination().withToAddresses(emailMessageDTO.getTo()))
                .withMessage(new Message()
                        .withBody(body)
                        .withSubject(new Content()
                                .withCharset("UTF-8").withData(emailMessageDTO.getSubject())))
                .withSource(emailMessageDTO.getFrom());

        if (configurationSetName != null) {
            request
                    .withConfigurationSetName(configurationSetName)
                    .withTags(new MessageTag().withName("userId").withValue(userId.toString()));
        }

        Gauge.Timer responseTimer = awsResponseTime.labels("simple_email_service").startTimer();

        // TODO http://jira.monsanto.com/browse/GCX-2144: No Permissions to perform ses:SendEmail for AWS IAM User acs2-c7
        try {
            client.sendEmail(request);
        } finally {
            responseTimer.setDuration();
        }
    }
}
