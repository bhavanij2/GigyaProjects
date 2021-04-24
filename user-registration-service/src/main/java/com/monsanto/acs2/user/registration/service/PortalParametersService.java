package com.monsanto.acs2.user.registration.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.monsanto.acs2.user.registration.entity.*;
import org.apache.commons.lang3.NotImplementedException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.http.*;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.vault.core.VaultOperations;
import org.springframework.web.client.RestClientResponseException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;
import com.monsanto.acs2.user.registration.dto.PortalParametersDTO;
import com.monsanto.acs2.user.registration.entity.PortalKey;

import java.net.URL;

import java.net.URI;
import java.net.URLEncoder;
import java.util.*;
import java.util.stream.Collectors;
import java.nio.charset.StandardCharsets;

@Component
public class PortalParametersService {

    private final RestTemplate restTemplate;
    private final SecurityService securityService;
    private final Environment environment;
    private final Map<String, PortalKey> portalUrlMapping;

    @Value("${gigya.vault.path}")
    private String gigyaVaultPath;
    @Value("${gigya.base.url}")
    private String gigyaBaseUrl;
    @Value("${c7.portal.parameters.endpoint}")
    private String c7PortalParametersEndpoint;

    public PortalParametersService(SecurityService securityService,
                                   Environment environment) {
        this.securityService = securityService;
        this.environment = environment;

        this.restTemplate = new RestTemplate();
        List<HttpMessageConverter<?>> messageConverters = new ArrayList<>();
        MappingJackson2HttpMessageConverter converter = new MappingJackson2HttpMessageConverter();
        converter.setSupportedMediaTypes(Collections.singletonList(MediaType.ALL));
        messageConverters.add(converter);
        restTemplate.setMessageConverters(messageConverters);
        portalUrlMapping = new HashMap<String, PortalKey>();
        portalUrlMapping.put("mycrop", new PortalKey("national", "dealer", "US"));
        portalUrlMapping.put("seedsmansource", new PortalKey("channel", "dealer", "US"));
        portalUrlMapping.put("fontanelle", new PortalKey("fontanelle", "*", "US"));
        portalUrlMapping.put("goldcountryseed", new PortalKey("goldcountry", "*", "US"));
        portalUrlMapping.put("hubnerseed",  new PortalKey("hubner", "*", "US"));
        portalUrlMapping.put("jungseedgenetics",  new PortalKey("jung", "*", "US"));
        portalUrlMapping.put("krugerseed",  new PortalKey("kruger", "*", "US"));
        portalUrlMapping.put("lewishybrids",  new PortalKey("lewis", "*", "US"));
        portalUrlMapping.put("rea-hybrids",  new PortalKey("rea", "*", "US"));
        portalUrlMapping.put("specialityhybrids",  new PortalKey("speciality", "*", "US"));
        portalUrlMapping.put("stewartseeds",  new PortalKey("stewart", "*", "US"));
        portalUrlMapping.put("stoneseed",  new PortalKey("stone", "*", "US"));
        portalUrlMapping.put("dekalbasgrowdeltapine",  new PortalKey("national", "grower", "US"));
        portalUrlMapping.put("canada",  new PortalKey("bayer", "*", "CA"));
        portalUrlMapping.put("brazil",  new PortalKey("bayer", "*", "BR"));
        portalUrlMapping.put("mexico",  new PortalKey("bayer", "*", "MX"));
        portalUrlMapping.put("channelgrower",  new PortalKey("channel", "grower", "US"));
    }

    public PortalParametersDTO getPortalParameters(String portal) {
        HttpHeaders headers = securityService.getOAuthHeaders();
        headers.add(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE);
        PortalKey portalKey = portalUrlMapping.get(portal);

        String url = c7PortalParametersEndpoint+"/country/"+portalKey.getCountry()
        +"/brand/"+portalKey.getBrand()
        +"/persona/"+portalKey.getPersona();
        try {
            ResponseEntity<JsonNode> response = restTemplate.exchange(
                url, 
                HttpMethod.GET,
                new HttpEntity<>( headers), 
                JsonNode.class);
            Iterator iterator = response.getBody().elements();
            PortalParametersDTO portalParametersDTO = null;
            String brand = null;
            String persona = null;
            String brandLogo = null;
            String gigyaBucket = null;
            String country = null;
            String gigyaTCField = null;
            String gigyaVaultPath = null;
            String emailSource = null;
            String portalUrl = null;
            String faviconUrl = null;
            String termsAndConditions = null;
            while(iterator.hasNext()){
                JsonNode node = (JsonNode)iterator.next();
                brand = node.get("brand").textValue();
                brandLogo = node.get("brandLogo").textValue();
                country = node.get("country").textValue();
                gigyaBucket = node.get("gigyaBucket").textValue();
                gigyaTCField = node.get("gigyaTCField").textValue();
                persona = node.get("persona").textValue();
                gigyaVaultPath = node.get("gigyaVaultPath").textValue();
                emailSource = node.get("emailSource").textValue();
                portalUrl = node.get("portalUrl").textValue();
                termsAndConditions = node.get("termsAndConditions").textValue();
                if (node.get("faviconUrl") != null) {
                    faviconUrl = node.get("faviconUrl").textValue();
                }
            }
            return new PortalParametersDTO(brand, persona, brandLogo, country, 
                gigyaBucket, gigyaTCField, gigyaVaultPath, emailSource, portalUrl, faviconUrl, termsAndConditions);
        } catch (RestClientResponseException e) {
            throw new RuntimeException("**** Exception getting portal parameters ****", e);
        }
    }
}