package com.monsanto.acs2.user.registration.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.monsanto.acs2.user.registration.entity.*;
import com.monsanto.acs2.user.registration.dto.*;
import org.apache.commons.lang3.NotImplementedException;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.vault.core.VaultOperations;
import org.springframework.vault.support.VaultResponse;
import org.springframework.web.client.RestClientResponseException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import javassist.tools.reflect.Reflection;

import java.net.URI;
import java.net.URL;
import java.util.*;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.failBecauseExceptionWasNotThrown;
import static org.mockito.Mockito.*;

@RunWith(MockitoJUnitRunner.class)
public class UserRegistrationServiceTest {
    @Mock
    private RestTemplate restTemplate;
    @Mock
    private VaultOperations vaultOperations;
    @Mock
    private SecurityService securityService;
    @Mock
    private Environment environment;
    @InjectMocks
    private UserRegistrationService service;
    @Mock
    private PortalParametersService portalParametersService;

    @Before
    public void setUp() throws Exception {
        ReflectionTestUtils.setField(service, "restTemplate", restTemplate);
        ReflectionTestUtils.setField(service, "gigyaVaultPath", "vaultPath/");
        ReflectionTestUtils.setField(service, "gigyaBaseUrl", "https://gigya.monsanto.com/");
        ReflectionTestUtils.setField(service, "c7UserRegistrationEndpoint", "https://c7.monsanto.com");
        ReflectionTestUtils.setField(service, "l360BaseUrl", "https://l360.monsanto.com");
    }

    @Test
    public void createGigyaAccount_SuccessfullyCreatesNewUser() throws Exception {
        User user = setUpForGigyaRequest();
        when(restTemplate.getForObject(
                "https://gigya.monsanto.com/accounts.initRegistration?apiKey=ruehtfuheugh8r", JsonNode.class))
                .thenReturn(new ObjectMapper().readTree("{\"regToken\": \"fj38u843uuhdkfu\", " +
                        "\"statusCode\": 200}"));
        when(environment.getProperty("gigya.national.dealer.consent.name")).thenReturn("MyConsent");

        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl("https://gigya.monsanto.com/accounts.register");

        String dataParam = "{'brand_type':'national','user_type':'dealer'}";
        String profileParam = "{'firstName':'Test','lastName':'User','country':'US'}";
        String preferencesParam = "{'terms':{'MyConsent':{'isConsentGranted':true}}}";

        builder.queryParam("secret", "ldjfgdih49847")
            .queryParam("apiKey", "ruehtfuheugh8r")
            .queryParam("username", "user@test.com")
            .queryParam("email", "user@test.com")
            .queryParam("profile", profileParam)
            .queryParam("data", dataParam)
            .queryParam("lang", "en")
            .queryParam("regToken", "fj38u843uuhdkfu")
            .queryParam("finalizeRegistration", "true")
            .queryParam("preferences", preferencesParam);

        String endpointString = builder.toUriString();
        URL endpointURL = new URL(endpointString + "&password=" + "dkjfijs438u38ufjhd");
        URI endpointURI = endpointURL.toURI();

        String a = "https://gigya.monsanto.com/accounts.register?secret=ldjfgdih49847&apiKey=ruehtfuheugh8r&username=user@test.com&email=user@test.com&profile=%7B'firstName':'Test','lastName':'User'%7D&data=%7B'brand_type':'national','user_type':'dealer'%7D&lang=en&regToken=fj38u843uuhdkfu&finalizeRegistration=true&preferences=%7B'terms':%7B'MyConsent':%7B'isConsentGranted':true%7D%7D%7D&password=dkjfijs438u38ufjhd";
        String b = "https://gigya.monsanto.com/accounts.register?secret=ldjfgdih49847&apiKey=ruehtfuheugh8r&username=user@test.com&email=user@test.com&profile=%7B'firstName':'Test','lastName':'User'%7D&data=%7B'brand_type':'national','user_type':'dealer'%7D&lang=en&regToken=fj38u843uuhdkfu%26finalizeRegistration%3Dtrue&finalizeRegistration=true&preferences=%7B'terms':%7B'MyConsent':%7B'isConsentGranted':true%7D%7D%7D&password=dkjfijs438u38ufjhd";

        when(restTemplate.getForObject(
                endpointURI,
                JsonNode.class
            )).thenReturn(new ObjectMapper().readTree("{\"newUser\": true, " +
                "\"UID\": \"ifjsd47853fdjkhs\", \"statusCode\": 200}"));

        String uid = service.createGigyaAccount(user, "dkjfijs438u38ufjhd");

        assertThat(uid).isEqualTo("ifjsd47853fdjkhs");
        verify(restTemplate).getForObject(anyString(), eq(JsonNode.class));
    }

    private User setUpForGigyaRequest() {
        Map<String, Object> vaultData = new HashMap<>();
        vaultData.put("apiKey", "ruehtfuheugh8r");
        Map<String, Object> adminVaultData = new HashMap<>();
        adminVaultData.put("userKey", "djfheu49847389");
        adminVaultData.put("secret", "ldjfgdih49847");
        User user = mock(User.class);
        UserContact userContact = mock(UserContact.class);
        VaultResponse vaultResponse = mock(VaultResponse.class);
        VaultResponse adminVaultResponse = mock(VaultResponse.class);
        when(user.getId()).thenReturn(UUID.randomUUID());
        when(user.getBrand()).thenReturn(Brand.national);
        when(user.getUserType()).thenReturn(UserType.dealer);
        when(user.getUserContact()).thenReturn(userContact);
        when(userContact.getEmail()).thenReturn("user@test.com");
        when(userContact.getFirstName()).thenReturn("Test");
        when(userContact.getLastName()).thenReturn("User");
        when(userContact.getCountry()).thenReturn("US");
        when(vaultOperations.read("vaultPath/national/dealer")).thenReturn(vaultResponse);
        when(vaultOperations.read("vaultPath/user-registration")).thenReturn(adminVaultResponse);
        when(vaultResponse.getData()).thenReturn(vaultData);
        when(adminVaultResponse.getData()).thenReturn(adminVaultData);
        return user;
    }

    @Test
    public void createGigyaAccount_InitRegistrationCallFails() throws Exception {
        User user = setUpForGigyaRequest();
        when(restTemplate.getForObject(startsWith("https://gigya.monsanto.com/accounts.initRegistration"),
                eq(JsonNode.class))).thenReturn(new ObjectMapper().readTree("{\"statusCode\": 400}"));

        try {
            service.createGigyaAccount(user, null);
            failBecauseExceptionWasNotThrown(RuntimeException.class);
        } catch (RuntimeException e) {
            verify(restTemplate).getForObject(anyString(), eq(JsonNode.class));
            verifyNoMoreInteractions(restTemplate);
            assertThat(e.getMessage()).contains("{\"statusCode\":400}", user.getId().toString());
            assertThat(e.getCause()).isNull();
        }
    }

    @Test
    public void createGigyaAccount_RegisterCallFails() throws Exception {
        User user = setUpForGigyaRequest();
        String dataParam = "{'brand_type':'national','user_type':'dealer'}";
        String profileParam = "{'firstName':'Test','lastName':'User'}";
        when(restTemplate.getForObject(
                startsWith("https://gigya.monsanto.com/accounts.initRegistration"),
                eq(JsonNode.class)
            ))
            .thenReturn(new ObjectMapper().readTree("{\"regToken\": " +
                "\"fj38u843uuhdkfu\", \"statusCode\": 200}"));
        when(restTemplate.getForObject(
                any(String.class),
                eq(JsonNode.class),
                anyString(),
                anyString()
            ))
            .thenReturn(new ObjectMapper().readTree("{\"statusCode\": 500}"));

        try {
            service.createGigyaAccount(user, null);
            failBecauseExceptionWasNotThrown(RuntimeException.class);
        } catch (RuntimeException e) {
            verify(restTemplate).getForObject(anyString(), eq(JsonNode.class));
            assertThat(e.getMessage()).contains(user.getId().toString());
            assertThat(e).isInstanceOf(RuntimeException.class);
        }
    }

    @Test
    public void createGigyaAccount_NewUserFieldOnResponseIsFalse() throws Exception {
        User user = setUpForGigyaRequest();
        when(restTemplate.getForObject(startsWith(
                "https://gigya.monsanto.com/accounts.initRegistration"),
                eq(JsonNode.class)
            )).thenReturn(new ObjectMapper().readTree("{\"regToken\": " +
                "\"fj38u843uuhdkfu\", \"statusCode\": 200}"));
        when(restTemplate.getForObject(
                anyString(),
                eq(JsonNode.class)
            ))
            .thenReturn(new ObjectMapper().readTree("{\"statusCode\": 200, " + "\"newUser\": false}"));

        try {
            service.createGigyaAccount(user, null);
            failBecauseExceptionWasNotThrown(RuntimeException.class);
        } catch (RuntimeException e) {
            verify(restTemplate).getForObject(anyString(), eq(JsonNode.class));
            verify(restTemplate).getForObject(anyString(), eq(JsonNode.class));
            assertThat(e.getMessage()).contains(user.getId().toString());
            assertThat(e.getCause()).isNull();
        }
    }

    @Test
    public void isGigyaAccountAvailable_SuccessfulResponse_ReturnsTrue() throws Exception {
        User user = setUpForGigyaRequest();
        String isAvailableLoginIdEndpoint = "https://gigya.monsanto.com/accounts.isAvailableLoginID" +
            "?apiKey=ruehtfuheugh8r&loginID=user@test.com";

        URI isAvailableLoginIdURI = URI.create(isAvailableLoginIdEndpoint);
        when(restTemplate.getForObject(isAvailableLoginIdURI, JsonNode.class))
                .thenReturn(new ObjectMapper().readTree("{\"statusCode\":200,\"isAvailable\":true}"));

        boolean isAvailable = service.isGigyaAccountAvailable(user, "user@test.com");

        assertThat(isAvailable).isTrue();
    }

    @Test
    public void isGigyaAccountAvailable_SuccessfulResponse_ReturnsFalse() throws Exception {
        User user = setUpForGigyaRequest();
        String isAvailableLoginIdEndpoint = "https://gigya.monsanto.com/accounts.isAvailableLoginID" +
            "?apiKey=ruehtfuheugh8r&loginID=user@test.com";

        URI isAvailableLoginIdURI = URI.create(isAvailableLoginIdEndpoint);
        when(restTemplate.getForObject(isAvailableLoginIdURI, JsonNode.class))
                .thenReturn(new ObjectMapper().readTree("{\"statusCode\":200,\"isAvailable\":false}"));

        boolean isAvailable = service.isGigyaAccountAvailable(user, "user@test.com");

        assertThat(isAvailable).isFalse();
    }

    @Test
    public void isGigyaAccountAvailable_ErrorResponse_ThrowsException() throws Exception {
        User user = setUpForGigyaRequest();
        String isAvailableLoginIdEndpoint = "https://gigya.monsanto.com/accounts.isAvailableLoginID" +
            "?apiKey=ruehtfuheugh8r&loginID=user@test.com";

        URI isAvailableLoginIdURI = URI.create(isAvailableLoginIdEndpoint);
        when(restTemplate.getForObject(isAvailableLoginIdURI, JsonNode.class))
                .thenReturn(new ObjectMapper().readTree("{\"statusCode\":400}"));

        try {
            service.isGigyaAccountAvailable(user, "user@test.com");
            failBecauseExceptionWasNotThrown(RuntimeException.class);
        } catch (RuntimeException e) {
            verify(restTemplate).getForObject(any(URI.class), eq(JsonNode.class));
            assertThat(e.getMessage()).contains("{\"statusCode\":400}", user.getId().toString());
            assertThat(e.getCause()).isNull();
        }
    }

    // @Test
    public void registerAccountWithC7_SuccessfullyCallsService_WithoutPhone2() throws Exception {
        User user = setUpC7Request(UserType.grower);

        service.registerAccountWithC7(user);

        assertC7Request(null, null);
    }

    // @Test
    public void registerAccountWithC7_SuccessfullyCallsService_WithPhone2() throws Exception {
        User user = setUpC7Request(UserType.grower);
        when(user.getUserContact().getPhone2()).thenReturn("222-222-2222");
        when(user.getUserContact().getPhoneType2()).thenReturn(PhoneType.LANDLINE);
        PortalParametersDTO portalParametersDTO = mock(PortalParametersDTO.class);
        when(portalParametersService.getPortalParameters("mycrop")).thenReturn(portalParametersDTO);

        service.registerAccountWithC7(user);

        assertC7Request("222-222-2222", PhoneType.LANDLINE.toString().toLowerCase());
    }

    @Test
    public void registerAccountWithC7_SuccessfullyCalls_WhenUserTypeIsDealer() throws Exception {
        User user = setUpC7Request(UserType.dealer);

        service.registerAccountWithC7(user);

        ArgumentCaptor<HttpEntity> httpEntityArgumentCaptor = ArgumentCaptor.forClass(HttpEntity.class);
        verify(restTemplate).postForEntity(eq("https://c7.monsanto.com?multiLocation=true"), httpEntityArgumentCaptor.capture(),
                eq(null));
        HttpEntity entity = httpEntityArgumentCaptor.getValue();

        Map<String, Object> body = (Map<String, Object>) entity.getBody();
        assertThat(body.get("persona")).isEqualTo(UserType.dealer.toString());

        ArrayList<Map<String, String>> locationRoles = (ArrayList)body.get("locationRoles");
        int expectedLength = 2;
        assertThat(locationRoles.size()).isEqualTo(expectedLength);

        String[] expectedRolesList = {"roleOneId", "roleTwoId"};
        Map<String, Boolean> testedRoles = new HashMap<String, Boolean>();

        for (String role : expectedRolesList) {
            testedRoles.put(role, false);
        }

        for (int i = 0; i < expectedLength; i++) {
            Map<String, String> locationRole = locationRoles.get(i);

            String sapId = locationRole.get("sapId");
            String roleId = locationRole.get("roleId");

            String expectedSapId = "locationOneSapId";

            assertThat(sapId).isEqualTo(expectedSapId);
            assertThat(testedRoles.containsKey(roleId) && testedRoles.get(roleId) == false).isEqualTo(true);

            testedRoles.put(roleId, true);
        }
    }

    private User setUpC7Request(UserType userType) {
        User user = mock(User.class);
        UserContact userContact = mock(UserContact.class);
        when(user.getUserContact()).thenReturn(userContact);
        when(user.getGigyaUid()).thenReturn("12345");
        when(userContact.getEmail()).thenReturn("user@test.com");
        when(user.getBrand()).thenReturn(Brand.national);
        when(user.getUserType()).thenReturn(userType);
        when(user.getSapAccountNumber()).thenReturn("0001234567");
        when(user.getPortal()).thenReturn("mycrop");
        when(userContact.getFirstName()).thenReturn("Test");
        when(userContact.getLastName()).thenReturn("User");
        when(userContact.getAddress1()).thenReturn("addr1");
        when(userContact.getAddress2()).thenReturn("addr2");
        when(userContact.getCity()).thenReturn("stl");
        when(userContact.getState()).thenReturn("MO");
        when(userContact.getZipcode()).thenReturn("63303");
        when(userContact.getPhone1()).thenReturn("111-111-1111");
        when(userContact.getPhoneType1()).thenReturn(PhoneType.MOBILE);
        if (UserType.dealer.equals(userType)) {
            Set<UserLocationRole> userLocationRoles = setUpUserLocationRoles(user);
            when(user.getUserLocationRoles()).thenReturn(userLocationRoles);
        }
        HttpHeaders headers = new HttpHeaders();
        headers.put("key", Collections.singletonList("value"));
        when(securityService.getOAuthHeaders()).thenReturn(headers);
        return user;
    }

    private Set<LocationRole> setUpLocationRoles() {
        Location locationOne = new Location();
        locationOne.setSapId("locationOneSapId");
        Role roleOne = new Role();
        roleOne.setRoleId("roleOneId");
        LocationRole locationRoleOne = new LocationRole(locationOne, roleOne);

        Role roleTwo = new Role();
        roleTwo.setRoleId("roleTwoId");
        LocationRole locationRoleTwo = new LocationRole(locationOne, roleTwo);

        LocationRole locationRoles[] = {locationRoleOne, locationRoleTwo};
        Set<LocationRole> locationRoleSet = new HashSet<LocationRole>(Arrays.asList(locationRoles));
        return locationRoleSet;
    }

    private Set<UserLocationRole> setUpUserLocationRoles(User user) {
        Location locationOne = new Location();
        locationOne.setSapId("locationOneSapId");
        Role roleOne = new Role();
        roleOne.setRoleId("roleOneId");

        Role roleTwo = new Role();
        roleTwo.setRoleId("roleTwoId");

        UserLocationRole userLocationRole1 = new UserLocationRole(user, locationOne, roleOne);
        UserLocationRole userLocationRole2 = new UserLocationRole(user, locationOne, roleTwo);

        Set<UserLocationRole> userLocationRoleSet = new HashSet<UserLocationRole>();
        userLocationRoleSet.add(userLocationRole1);
        userLocationRoleSet.add(userLocationRole2);
        return userLocationRoleSet;
    }

    private void assertC7Request(String secondaryPhone, String secondaryPhoneType) {
        ArgumentCaptor<HttpEntity> httpEntityArgumentCaptor = ArgumentCaptor.forClass(HttpEntity.class);
        verify(restTemplate).postForEntity(eq("https://c7.monsanto.com"), httpEntityArgumentCaptor.capture(),
                eq(null));
        HttpEntity entity = httpEntityArgumentCaptor.getValue();
        HttpHeaders entityHeaders = entity.getHeaders();
        assertThat(entityHeaders).hasSize(2);
        assertThat(entityHeaders.get("key")).isEqualTo(Collections.singletonList("value"));
        assertThat(entityHeaders.get(HttpHeaders.CONTENT_TYPE))
                .isEqualTo(Collections.singletonList(MediaType.APPLICATION_JSON_VALUE));
        Map<String, Object> body = (Map<String, Object>) entity.getBody();
        assertThat(body).hasSize((secondaryPhone != null) ? 20 : 18);
        assertThat(body.get("federationId")).isEqualTo("12345");
        assertThat(body.get("userId")).isEqualTo("user@test.com");
        assertThat(body.get("userName")).isEqualTo("user@test.com");
        assertThat(body.get("brand")).isEqualTo(Brand.national.toString());
        assertThat(body.get("persona")).isEqualTo(UserType.grower.toString());
        assertThat(body.get("sapAccountId")).isEqualTo("0001234567");
        List<String> roleIds = (List<String>) body.get("roleIdList");
        assertThat(roleIds).hasSize(3);
        assertThat(roleIds).contains("glb:seed:nbfarm");
        assertThat(roleIds).contains("glb:bioag:nbfarm");
        assertThat(roleIds).contains("glb:acceleron:nbfarm");
        assertThat(body.get("firstName")).isEqualTo("Test");
        assertThat(body.get("lastName")).isEqualTo("User");
        assertThat(body.get("addressLine1")).isEqualTo("addr1");
        assertThat(body.get("addressLine2")).isEqualTo("addr2");
        assertThat(body.get("city")).isEqualTo("stl");
        assertThat(body.get("state")).isEqualTo("MO");
        assertThat(body.get("zip")).isEqualTo("63303");
        assertThat(body.get("primaryPhone")).isEqualTo("111-111-1111");
        assertThat(body.get("primaryPhoneType")).isEqualTo(PhoneType.MOBILE.toString().toLowerCase());
        assertThat(body.get("secondaryPhone")).isEqualTo(secondaryPhone);
        assertThat(body.get("secondaryPhoneType")).isEqualTo(secondaryPhoneType);
    }

    @Test
    public void registerAccountWithC7_ThrowsException_WhenBrandIsNotNational() throws Exception {
        UUID userId = UUID.randomUUID();
        User user = mock(User.class);
        when(user.getId()).thenReturn(userId);
        when(user.getBrand()).thenReturn(Brand.channel);

        try {
            service.registerAccountWithC7(user);
            failBecauseExceptionWasNotThrown(NotImplementedException.class);
        } catch (NotImplementedException e) {
            assertThat(e.getMessage()).isEqualTo("Not implemented for this user's brand or user type: " + userId);
            assertThat(e.getCause()).isNull();
            verifyZeroInteractions(restTemplate);
        }
    }

    @Test
    public void registerAccountWithC7_ThrowsException_WhenServiceFails() {
        UUID userId = UUID.randomUUID();
        User user = mock(User.class);
        UserContact userContact = mock(UserContact.class);
        when(user.getUserContact()).thenReturn(userContact);
        when(user.getId()).thenReturn(userId);
        when(user.getBrand()).thenReturn(Brand.national);
        when(user.getUserType()).thenReturn(UserType.grower);
        when(userContact.getPhoneType1()).thenReturn(PhoneType.MOBILE);
        when(securityService.getOAuthHeaders()).thenReturn(new HttpHeaders());
        RestClientResponseException exception = mock(RestClientResponseException.class);
        when(exception.getResponseBodyAsString()).thenReturn("account not found");
        when(restTemplate.postForEntity(eq("https://c7.monsanto.com"), any(), eq(null)))
                .thenThrow(exception);

        try {
            service.registerAccountWithC7(user);
            failBecauseExceptionWasNotThrown(RuntimeException.class);
        } catch (RuntimeException e) {
            assertThat(e.getMessage()).contains("account not found", userId.toString());
            assertThat(e.getCause()).isEqualTo(exception);
        }
    }

    @Test
    public void deleteC7Account() {
        User user = setUpC7Request(UserType.grower);

        service.deleteC7Account(user);

        ArgumentCaptor<HttpEntity> httpEntityArgumentCaptor = ArgumentCaptor.forClass(HttpEntity.class);
        verify(restTemplate).exchange(eq("https://c7.monsanto.com/12345"), eq(HttpMethod.DELETE),
                httpEntityArgumentCaptor.capture(), eq(String.class));
        HttpEntity entity = httpEntityArgumentCaptor.getValue();
        HttpHeaders entityHeaders = entity.getHeaders();
        assertThat(entityHeaders).hasSize(1);
        assertThat(entityHeaders.get("key")).isEqualTo(Collections.singletonList("value"));
        assertThat(entity.getBody()).isNull();
    }

    @Test
    public void deleteGigyaAccount() throws Exception {
        User user = setUpForGigyaRequest();
        when(user.getGigyaUid()).thenReturn("12345");
        String gigyaDeleteEndpoint = "https://gigya.monsanto.com/accounts.deleteAccount?apiKey=ruehtfuheugh8r&secret=ldjfgdih49847&UID=12345";

        when(restTemplate.getForObject(
            URI.create(gigyaDeleteEndpoint),
            JsonNode.class)
        ).thenReturn(new ObjectMapper().readTree("{\"statusCode\": 200}"));

        service.deleteGigyaAccount(user);

        verify(restTemplate).getForObject(any(URI.class), eq(JsonNode.class));
    }

    @Test
    public void getUserStateOptions() {
      User user = mock(User.class);
      UserContact userContact = mock(UserContact.class);
      HttpHeaders headers = mock(HttpHeaders.class);
      JsonNode jsonNode = mock(JsonNode.class);
      ResponseEntity<JsonNode> response = mock(ResponseEntity.class);

      // populate iterator with sample
      ArrayList<JsonNode> arrayList = new ArrayList<JsonNode>();
      for (int i = 0; i < 10; i++) {
        arrayList.add(jsonNode);
      }
      Iterator<JsonNode> iterator = arrayList.iterator();

      UriComponentsBuilder uri = UriComponentsBuilder.fromHttpUrl("https://l360.monsanto.com")
        .queryParam("service", "WFS")
        .queryParam("version", "2.0.0")
        .queryParam("request", "GetFeature")
        .queryParam("typeNames", "geopolitical:world_l1_simplified")
        .queryParam("srsname", "EPSG:4326")
        .queryParam("outputFormat", "application/json")
        .queryParam("propertyName", "l1_name,l1_iso_code");
      String l360Endpoint = uri.toUriString() + "&cql_filter=l0_iso_code={country}";
      when(user.getUserContact()).thenReturn(userContact);
      when(userContact.getCountry()).thenReturn("US");
      when(securityService.getOAuthHeaders()).thenReturn(headers);
      when(response.getBody()).thenReturn(jsonNode);
      when(jsonNode.get("features")).thenReturn(jsonNode);
      when(jsonNode.get("properties")).thenReturn(jsonNode);
      when(jsonNode.get("l1_name")).thenReturn(jsonNode);
      when(jsonNode.get("l1_iso_code")).thenReturn(jsonNode);
      when(jsonNode.elements()).thenReturn(iterator);
      when(jsonNode.textValue()).thenReturn("US");
      when(restTemplate.exchange(
        l360Endpoint,
        HttpMethod.GET,
        new HttpEntity<>(headers),
        JsonNode.class,
        "\'US\'"
      )).thenReturn(response);

      ArrayList<StateOption> stateOptions = service.getUserStateOptions(user);


      assertThat(stateOptions).isNotNull();
      assertThat(stateOptions).isNotEmpty();
    }
}
