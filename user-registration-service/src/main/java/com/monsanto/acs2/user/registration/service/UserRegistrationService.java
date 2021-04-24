package com.monsanto.acs2.user.registration.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.monsanto.acs2.user.registration.entity.*;
import io.prometheus.client.Gauge;
import org.apache.commons.lang3.NotImplementedException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.http.*;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.vault.core.VaultOperations;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClientResponseException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;
import com.monsanto.acs2.user.registration.dto.PortalParametersDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.net.URL;

import java.net.URI;
import java.net.URLEncoder;
import java.util.*;
import java.util.stream.Collectors;
import java.nio.charset.StandardCharsets;

@Component
public class UserRegistrationService {
    private static final Gauge registrationResponseTime = Gauge.build()
            .name("gauge_registration_response")
            .help("Response time for registration API calls.")
            .labelNames("action")
            .register();
    private final Logger logger = LoggerFactory.getLogger(getClass());

    private final RestTemplate restTemplate;
    private final VaultOperations vaultOperations;
    private final SecurityService securityService;
    private final Environment environment;
    private final PortalParametersService portalParametersService;

    @Value("${gigya.vault.path}")
    private String gigyaVaultPath;
    @Value("${gigya.base.url}")
    private String gigyaBaseUrl;
    @Value("${l360.base.url}")
    private String l360BaseUrl;
    @Value("${c7.user.registration.endpoint}")
    private String c7UserRegistrationEndpoint;

    public UserRegistrationService(VaultOperations vaultOperations, SecurityService securityService,
                                   Environment environment,PortalParametersService portalParametersService) {
        this.vaultOperations = vaultOperations;
        this.securityService = securityService;
        this.environment = environment;
        this.portalParametersService = portalParametersService;

        this.restTemplate = new RestTemplate();
        List<HttpMessageConverter<?>> messageConverters = new ArrayList<>();
        MappingJackson2HttpMessageConverter converter = new MappingJackson2HttpMessageConverter();
        converter.setSupportedMediaTypes(Collections.singletonList(MediaType.ALL));
        messageConverters.add(converter);
        restTemplate.setMessageConverters(messageConverters);
    }

    private String getPreferencesParam(User user) {
        if(user.getPortal() != null){
            String portal = user.getPortal();
            PortalParametersDTO portalParametersDTO = portalParametersService.getPortalParameters(portal);
            String tTField = portalParametersDTO.getGigyaTCField();
            return "{'terms':{'" + tTField +
                                        "':{'isConsentGranted':true}}}";
        }


        String preferencesParam = "{'terms':{'" + environment.getProperty("gigya." +
                                        user.getBrand() + "." + user.getUserType() + ".consent.name") +
                                        "':{'isConsentGranted':true}}}";  
        return preferencesParam;
    }

    private String getDataParam(User user) {
        String brand = null;
        String persona = null;
        if(user.getPortal() != null){
            String portal = user.getPortal();
            PortalParametersDTO portalParametersDTO = portalParametersService.getPortalParameters(portal);
            brand =  portalParametersDTO.getBrand();
            persona =  portalParametersDTO.getPersona();
        } else {
           brand = user.getBrand().toString();

           persona = user.getUserType().toString();
        }
        String nationalGrowerDataParam = "{'brand':'" + brand + "','userType':'" + persona + "'}";
        String dealerDataParam = "{'brand_type':'" + brand + "','user_type':'" + persona + "'}";

        // TODO: GCX-2240
        String dataParam = brand == Brand.national.toString() && persona == UserType.grower.toString()
                                ? nationalGrowerDataParam
                                : dealerDataParam;
        return dataParam;
    }

    public String createGigyaAccount(User user, String password) {
        String apiKey = getApiKey(user);
        JsonNode initRegistrationResponse;

        Gauge.Timer initRegistrationTimer = registrationResponseTime.labels("gigya_init_registration")
                .startTimer();

        try {
            initRegistrationResponse = restTemplate.getForObject(gigyaBaseUrl +
                    "accounts.initRegistration?apiKey=" + apiKey, JsonNode.class);
        } finally {
            initRegistrationTimer.setDuration();
        }

        validateSuccessfulResponse(initRegistrationResponse, user.getId());

        UserContact userContact = user.getUserContact();
        JsonNode registerResponse;
        Gauge.Timer registerTimer = registrationResponseTime.labels("gigya_registration").startTimer();

        Map<String, Object> adminVaultData = getAdminVaultData();
        String dataParam = getDataParam(user);
        String preferencesParam = getPreferencesParam(user);
        String profileParam = "{'firstName':'" + userContact.getFirstName() + "','lastName':'" + userContact.getLastName() + "','country':'" + userContact.getCountry() + "'}";

        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(gigyaBaseUrl + "accounts.register");

        try {
            builder.queryParam("secret", adminVaultData.get("secret"))
                .queryParam("apiKey", apiKey)
                .queryParam("username", userContact.getEmail())
                .queryParam("email", userContact.getEmail())
                .queryParam("profile", profileParam)
                .queryParam("data", dataParam)
                .queryParam("lang", "en")
                .queryParam("regToken", initRegistrationResponse.get("regToken").asText())
                .queryParam("finalizeRegistration", "true")
                .queryParam("preferences", preferencesParam);
            password = URLEncoder.encode(password, StandardCharsets.UTF_8.toString());

            // NOTE: adding password as a queryParam like in the above methods will improperly encode some of the allowed password special characters
            String registerAccountsEndpoint = builder.toUriString();
            URL registerAccountsURL = new URL(registerAccountsEndpoint + "&password=" + password);
            URI registerAccountsURI = registerAccountsURL.toURI();

            registerResponse = restTemplate.getForObject(registerAccountsURI, JsonNode.class);

            registerTimer.setDuration();
            validateSuccessfulResponse(registerResponse, user.getId());

            if (!registerResponse.get("newUser").asBoolean()) {
                throw new RuntimeException("Gigya failed to create a new user for id " + user.getId() + ": " +
                        registerResponse);
            }

            return registerResponse.get("UID").asText();
        } catch (Exception e) {
            throw new RuntimeException("Gigya failed to create a new user for id " + user.getId());
        }
    }

    private UriComponentsBuilder addGigyaBucketQueryParams(UriComponentsBuilder builder, String apiKey) {
        Map<String, Object> adminVaultData = getAdminVaultData();

        return builder
                .queryParam("apiKey", apiKey)
                .queryParam("secret", adminVaultData.get("secret"));
    }

    private Map<String, Object> getAdminVaultData() {
        return vaultOperations.read(gigyaVaultPath + "user-registration").getData();
    }

    private String getApiKey(User user) {
        if(user.getPortal() != null) {
            String gigyaVaultPath = portalParametersService.getPortalParameters(user.getPortal()).getGigyaVaultPath();
            return vaultOperations.read(gigyaVaultPath).getData().get("apiKey").toString();
        }
        return vaultOperations.read(gigyaVaultPath + user.getBrand() + "/" + user.getUserType()).getData().get("apiKey").toString();
    }

    private void validateSuccessfulResponse(JsonNode response, UUID userId) {
        if (!HttpStatus.valueOf(response.get("statusCode").asInt()).is2xxSuccessful()) {
            throw new RuntimeException("Gigya responded with an error for user id " + userId + ": " + response);
        }
    }

    public boolean isGigyaAccountAvailable(User user, String email) {
        String apiKey = getApiKey(user);
        Map<String, Object> adminVaultData = getAdminVaultData();
        JsonNode response;
        Gauge.Timer timer = registrationResponseTime.labels("gigya_account_availability").startTimer();

        try {
            StringBuilder builder = new StringBuilder(gigyaBaseUrl);
            builder.append("accounts.isAvailableLoginID")
                .append("?apiKey=" + apiKey)
                .append("&loginID=" + email);
            String isAccountsAvailableEndpoint = builder.toString();

            URI isAccountsAvailableURI = URI.create(isAccountsAvailableEndpoint);

            response = restTemplate.getForObject(isAccountsAvailableURI, JsonNode.class);
        } finally {
            timer.setDuration();
        }

        validateSuccessfulResponse(response, user.getId());

        return response.get("isAvailable").asBoolean();
    }

    public void registerAccountWithC7(User user) {
        //TODO get rid of this reference
        if (Brand.channel.equals(user.getBrand())) {
            throw new NotImplementedException("Not implemented for this user's brand or user type: " + user.getId());
        }

        Map<String, Object> request = getRegisterC7AccountRequest(user);
        HttpHeaders headers = securityService.getOAuthHeaders();
        headers.add(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE);

        if (UserType.grower.equals(user.getUserType())) {
            registerNationalGrowerAccountWithC7(user, request, headers);
        } else {
            registerNationalDealerAccountWithC7(user, request, headers);
        } 
    }

    private void registerNationalGrowerAccountWithC7(User user, Map<String, Object> request, HttpHeaders headers) {
        request.put("sapAccountId", user.getSapAccountNumber());
        request.put("roleIdList", Arrays.asList("glb:seed:nbfarm", "glb:bioag:nbfarm", "glb:acceleron:nbfarm"));

        String nationalGrowerQueryParamString = "";
        sendRegistrationRequest(request, headers, user.getId(), nationalGrowerQueryParamString);
    }

    private void registerNationalDealerAccountWithC7(User user, Map<String, Object> request, HttpHeaders headers) {
        List<Map<String, String>> locationRoles = user.getUserLocationRoles()
            .stream().map(locationRole -> mapLocationRole(locationRole))
            .collect(Collectors.toList());
        request.put("locationRoles", locationRoles);

        String nationalDealerQueryParamString = "?multiLocation=true";
        sendRegistrationRequest(request, headers, user.getId(), nationalDealerQueryParamString);
    }

    private void sendRegistrationRequest(Map<String, Object> request, HttpHeaders headers, UUID uuid, String queryParamString) {
        Gauge.Timer timer = registrationResponseTime.labels("c7_registration").startTimer();

        try {
            restTemplate.postForEntity(c7UserRegistrationEndpoint + queryParamString, new HttpEntity<>(request, headers), null);
        } catch (RestClientResponseException e) {
            throw new RuntimeException("C7 registration failed for user id " + uuid + " with response: " +
                    e.getResponseBodyAsString(), e);
        } finally {
            timer.setDuration();
        }
    }

    private Map<String, String> mapLocationRole(UserLocationRole userLocationRole) {
        Map<String, String> locationRoleObj = new HashMap<String, String>();
        locationRoleObj.put("sapId", userLocationRole.getLocation().getSapId());
        locationRoleObj.put("roleId", userLocationRole.getRole().getRoleId());
        return locationRoleObj;
    }

    private Map<String, Object> getRegisterC7AccountRequest(User user) {
        Map<String, Object> request = new HashMap<>();
        UserContact userContact = user.getUserContact();
        PortalParametersDTO portalParametersDTO = null;

        if(user.getPortal() != null) {
            portalParametersDTO = portalParametersService.getPortalParameters(user.getPortal());
        }

        request.put("federationId", user.getGigyaUid());
        request.put("userId", userContact.getEmail());
        request.put("userName", userContact.getEmail());
        if(user.getBrand() != null) {
            request.put("brand", user.getBrand().toString());
        }else{
            request.put("brand", portalParametersDTO.getBrand());
        }
        if(user.getUserType() != null) {
            request.put("persona", user.getUserType().toString());
        }else{
            request.put("persona", portalParametersDTO.getPersona());
        }
        request.put("portal", user.getPortal());
        request.put("firstName", userContact.getFirstName());
        request.put("lastName", userContact.getLastName());
        request.put("addressLine1", userContact.getAddress1());
        request.put("addressLine2", userContact.getAddress2());
        request.put("city", userContact.getCity());
        request.put("state", userContact.getState());
        request.put("country", userContact.getCountry());
        request.put("zip", userContact.getZipcode());
        request.put("primaryPhone", userContact.getPhone1());
        request.put("primaryPhoneType", userContact.getPhoneType1().toString().toLowerCase());

        if (StringUtils.hasText(userContact.getPhone2())) {
            request.put("secondaryPhone", userContact.getPhone2());
            request.put("secondaryPhoneType", userContact.getPhoneType2().toString().toLowerCase());
        }

        return request;
    }

    public void deleteC7Account(User user) {
        Gauge.Timer timer = registrationResponseTime.labels("c7_delete").startTimer();

        try {
            restTemplate.exchange(c7UserRegistrationEndpoint + "/" + user.getGigyaUid(), HttpMethod.DELETE,
                    new HttpEntity<>(securityService.getOAuthHeaders()), String.class);
        } finally {
            timer.setDuration();
        }
    }

    public void deleteGigyaAccount(User user) {
        JsonNode response;
        Gauge.Timer timer = registrationResponseTime.labels("gigya_delete").startTimer();

        try {
            UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(gigyaBaseUrl + "accounts.deleteAccount");
            addGigyaBucketQueryParams(builder, getApiKey(user))
                    .queryParam("UID", user.getGigyaUid());

            response = restTemplate.getForObject(URI.create(builder.toUriString()), JsonNode.class);
        } finally {
            timer.setDuration();
        }

        validateSuccessfulResponse(response, user.getId());
    }

    public ArrayList<StateOption> getUserStateOptions(User user) {
        Gauge.Timer timer = registrationResponseTime.labels("get_states").startTimer();

        ResponseEntity<JsonNode> response;
        ArrayList<StateOption> states = new ArrayList<StateOption>();
        UserContact userContact = user.getUserContact();
        if (userContact != null && user.getUserContact().getCountry() != null && !user.getUserContact().getCountry().isEmpty()) {
            String country = user.getUserContact().getCountry();

            UriComponentsBuilder uri = UriComponentsBuilder.fromHttpUrl(l360BaseUrl)
                .queryParam("service", "WFS")
                .queryParam("version", "2.0.0")
                .queryParam("request", "GetFeature")
                .queryParam("typeNames", "geopolitical:world_l1_simplified")
                .queryParam("srsname", "EPSG:4326")
                .queryParam("outputFormat", "application/json")
                .queryParam("propertyName", "l1_name,l1_iso_code");
            try {
                response = restTemplate.exchange(
                    uri.toUriString() + "&cql_filter=l0_iso_code={country}",
                    HttpMethod.GET,
                    new HttpEntity<>(securityService.getOAuthHeaders()),
                    JsonNode.class,
                    "\'" + country + "\'"
                );
                Iterator<JsonNode> nodes = response.getBody().get("features").elements();
                while (nodes.hasNext()) {
                    JsonNode node = nodes.next();
                    StateOption state = new StateOption(node);
                    states.add(state);
                }
            } finally {
                timer.setDuration();
            }
        }
        return states;
    }
}
