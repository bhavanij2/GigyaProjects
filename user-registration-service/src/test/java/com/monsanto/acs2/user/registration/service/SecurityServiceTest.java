package com.monsanto.acs2.user.registration.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;
import org.springframework.http.*;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.util.MultiValueMap;
import org.springframework.vault.core.VaultOperations;
import org.springframework.vault.support.VaultResponse;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.*;

@RunWith(MockitoJUnitRunner.class)
public class SecurityServiceTest {
    private static final String OAUTH_CLIENT_ID = "EPAY_CLIENT";
    private static final String OAUTH_CLIENT_SECRET = "EPAY_SECRET";
    private SecurityService service;
    @Mock
    private RestTemplate restTemplate;

    @Before
    public void setUp() throws Exception {
        VaultOperations vaultOperations = mock(VaultOperations.class);
        VaultResponse vaultResponse = mock(VaultResponse.class);
        Map<String, Object> response = new HashMap<>();
        response.put("client_id", OAUTH_CLIENT_ID);
        response.put("client_secret", OAUTH_CLIENT_SECRET);
        when(vaultOperations.read("oauth")).thenReturn(vaultResponse);
        when(vaultResponse.getData()).thenReturn(response);

        service = new SecurityService(vaultOperations);

        ReflectionTestUtils.setField(service, "oauthVaultPath", "oauth");
        ReflectionTestUtils.setField(service, "oauthEndpoint", "https://oauth.monsanto.com");
        ReflectionTestUtils.setField(service, "restTemplate", restTemplate);
    }

    @Test
    public void getOAuthHeaders_ReturnsHeaderWithToken() throws Exception {
        setUpOAuthResponse();

        HttpHeaders headers = service.getOAuthHeaders();

        assertThat(headers).hasSize(1);
        List<String> authorizationHeaders = headers.get(HttpHeaders.AUTHORIZATION);
        assertThat(authorizationHeaders).hasSize(1);
        assertThat(authorizationHeaders.get(0)).isEqualTo("Tester kdsjd58732459328fdlkjhsf8ew");
        ArgumentCaptor<HttpEntity> httpEntityArgumentCaptor = ArgumentCaptor.forClass(HttpEntity.class);
        verify(restTemplate).postForEntity(eq("https://oauth.monsanto.com?grant_type=client_credentials"),
                httpEntityArgumentCaptor.capture(), eq(SecurityService.OAuthResponse.class));
        HttpEntity<MultiValueMap<String, String>> httpEntity = httpEntityArgumentCaptor.getValue();
        assertThat(httpEntity.getHeaders().getContentType()).isEqualTo(MediaType.APPLICATION_FORM_URLENCODED);
        assertThat(httpEntity.getBody()).hasSize(2);
        assertThat(httpEntity.getBody().get("client_id")).isEqualTo(Collections.singletonList(OAUTH_CLIENT_ID));
        assertThat(httpEntity.getBody().get("client_secret")).isEqualTo(Collections.singletonList(OAUTH_CLIENT_SECRET));
    }

    private void setUpOAuthResponse() {
        SecurityService.OAuthResponse oAuthResponse = new SecurityService.OAuthResponse();
        oAuthResponse.setAccess_token("kdsjd58732459328fdlkjhsf8ew");
        oAuthResponse.setToken_type("Tester");
        oAuthResponse.setExpires_in(7199);
        when(restTemplate.postForEntity(eq("https://oauth.monsanto.com?grant_type=client_credentials"), any(),
                eq(SecurityService.OAuthResponse.class))).thenReturn(new ResponseEntity<>(oAuthResponse, HttpStatus.OK));
    }

    @Test
    public void getOAuthHeaders_DoesNotRefreshToken_WhenTokenHasNotExpired() throws Exception {
        SecurityService.OAuthResponse oAuthResponse = new SecurityService.OAuthResponse();
        oAuthResponse.setAccess_token("jsf8348754jhdsfkuh4");
        oAuthResponse.setToken_type("Tester");
        oAuthResponse.setExpires_in(600);
        ReflectionTestUtils.setField(service, "oAuthResponse", oAuthResponse);

        HttpHeaders headers = service.getOAuthHeaders();

        assertThat(headers).hasSize(1);
        List<String> authorizationHeaders = headers.get(HttpHeaders.AUTHORIZATION);
        assertThat(authorizationHeaders).hasSize(1);
        assertThat(authorizationHeaders.get(0)).isEqualTo("Tester jsf8348754jhdsfkuh4");
        verifyZeroInteractions(restTemplate);
    }

    @Test
    public void getOAuthHeaders_RefreshesToken_WhenTokenHasExpired() throws Exception {
        SecurityService.OAuthResponse expiredOAuthResponse = new SecurityService.OAuthResponse();
        expiredOAuthResponse.setAccess_token("jsf8348754jhdsfkuh4");
        expiredOAuthResponse.setToken_type("Tester");
        expiredOAuthResponse.setExpires_in(60);
        ReflectionTestUtils.setField(service, "oAuthResponse", expiredOAuthResponse);
        SecurityService.OAuthResponse refreshedOAuthResponse = new SecurityService.OAuthResponse();
        refreshedOAuthResponse.setAccess_token("weyrtqyhbfsb374627r4sfd");
        refreshedOAuthResponse.setToken_type("Tester");
        refreshedOAuthResponse.setExpires_in(7199);
        when(restTemplate.postForEntity(eq("https://oauth.monsanto.com?grant_type=client_credentials"), any(),
                eq(SecurityService.OAuthResponse.class)))
                .thenReturn(new ResponseEntity<>(refreshedOAuthResponse, HttpStatus.OK));

        HttpHeaders headers = service.getOAuthHeaders();

        assertThat(headers).hasSize(1);
        List<String> authorizationHeaders = headers.get(HttpHeaders.AUTHORIZATION);
        assertThat(authorizationHeaders).hasSize(1);
        assertThat(authorizationHeaders.get(0)).isEqualTo("Tester weyrtqyhbfsb374627r4sfd");
    }

    @Test
    public void getOAuthClientId() throws Exception {
        when(restTemplate.postForObject(anyString(), any(), eq(JsonNode.class)))
                .thenReturn(new ObjectMapper().readTree("{\"access_token\":{\"client_id\":\"TEST_CLIENT_ID\"}}"));

        String clientId = service.getOAuthClientId("Bearer fidshfdsifslijfsijre2421");

        ArgumentCaptor<HttpEntity> httpEntityArgumentCaptor = ArgumentCaptor.forClass(HttpEntity.class);
        verify(restTemplate).postForObject(eq("https://oauth.monsanto.com?" +
                        "grant_type=urn:pingidentity.com:oauth2:grant_type:validate_bearer"),
                httpEntityArgumentCaptor.capture(), eq(JsonNode.class));
        HttpEntity<MultiValueMap<String, String>> httpEntity = httpEntityArgumentCaptor.getValue();
        assertThat(httpEntity.getHeaders().getContentType()).isEqualTo(MediaType.APPLICATION_FORM_URLENCODED);
        assertThat(httpEntity.getBody()).hasSize(3);
        assertThat(httpEntity.getBody().get("client_id")).isEqualTo(Collections.singletonList(OAUTH_CLIENT_ID));
        assertThat(httpEntity.getBody().get("client_secret")).isEqualTo(Collections.singletonList(OAUTH_CLIENT_SECRET));
        assertThat(httpEntity.getBody().get("token")).isEqualTo(Collections.singletonList("fidshfdsifslijfsijre2421"));
        assertThat(clientId).isEqualTo("TEST_CLIENT_ID");
    }
}