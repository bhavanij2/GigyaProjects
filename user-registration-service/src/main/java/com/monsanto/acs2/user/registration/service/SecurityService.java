package com.monsanto.acs2.user.registration.service;

import com.fasterxml.jackson.databind.JsonNode;
import io.prometheus.client.Gauge;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.vault.core.VaultOperations;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.Map;

@Component
public class SecurityService {
    private static final Gauge securityResponseTime = Gauge.build()
            .name("gauge_security_response")
            .help("Response time for security API calls.")
            .labelNames("action")
            .register();
    private final RestTemplate restTemplate;
    private final VaultOperations vaultOperations;
    private OAuthResponse oAuthResponse;

    @Value("${oauth.vault.path}")
    private String oauthVaultPath;
    @Value("${oauth.endpoint}")
    private String oauthEndpoint;

    public SecurityService(VaultOperations vaultOperations) {
        this.restTemplate = new RestTemplate();
        this.vaultOperations = vaultOperations;
    }

    public HttpHeaders getOAuthHeaders() {
        if (oAuthResponse == null || LocalDateTime.now().isAfter(oAuthResponse.expiration)) {
            setOAuthResponse();
        }

        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.AUTHORIZATION, oAuthResponse.token_type + " " + oAuthResponse.access_token);

        return headers;
    }

    public String getOAuthClientId(String authorizationHeader) {
        HttpEntity<MultiValueMap<String, String>> httpEntity = getOAuthHttpEntity();
        httpEntity.getBody().add("token", authorizationHeader.replace("Bearer ", ""));
        Gauge.Timer validateClientTimer = securityResponseTime.labels("ping_validate_client")
                .startTimer();
        JsonNode jsonNode;

        try {
            jsonNode = restTemplate.postForObject(oauthEndpoint +
                            "?grant_type=urn:pingidentity.com:oauth2:grant_type:validate_bearer", httpEntity,
                    JsonNode.class);
        } finally {
            validateClientTimer.setDuration();
        }

        return jsonNode.get("access_token").get("client_id").asText();
    }

    private void setOAuthResponse() {
        Gauge.Timer refreshTokenTimer = securityResponseTime.labels("ping_refresh_token")
                .startTimer();

        try {
            oAuthResponse = restTemplate.postForEntity(oauthEndpoint + "?grant_type=client_credentials",
                    getOAuthHttpEntity(), OAuthResponse.class).getBody();
        } finally {
            refreshTokenTimer.setDuration();
        }
    }

    private HttpEntity<MultiValueMap<String, String>> getOAuthHttpEntity() {
        Map<String, Object> vaultData = vaultOperations.read(oauthVaultPath).getData();

        HttpHeaders requestHeaders = new HttpHeaders();
        requestHeaders.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> requestBody = new LinkedMultiValueMap<>();
        requestBody.add("client_id", vaultData.get("client_id").toString());
        requestBody.add("client_secret", vaultData.get("client_secret").toString());

        return new HttpEntity<>(requestBody, requestHeaders);
    }

    protected static class OAuthResponse {
        private String access_token;
        private String token_type;
        private LocalDateTime expiration;

        public void setAccess_token(String access_token) {
            this.access_token = access_token;
        }

        public void setToken_type(String token_type) {
            this.token_type = token_type;
        }

        public void setExpires_in(long expires_in) {
            this.expiration = LocalDateTime.now().plusSeconds(expires_in).minusMinutes(5);
        }
    }
}
