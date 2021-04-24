package com.monsanto.acs2.user.registration.security;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.monsanto.acs2.user.registration.exception.HttpStatusResponseException;
import com.monsanto.acs2.user.registration.service.SecurityService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.MethodParameter;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

public class CurrentUsernameMethodArgumentResolver implements HandlerMethodArgumentResolver {
    private final Logger logger = LoggerFactory.getLogger(getClass());
    private final SecurityService securityService;

    public CurrentUsernameMethodArgumentResolver(SecurityService securityService) {
        this.securityService = securityService;
    }

    @Override
    public boolean supportsParameter(MethodParameter parameter) {
        return parameter.hasParameterAnnotation(CurrentUsername.class);
    }

    @Override
    public Object resolveArgument(MethodParameter parameter, ModelAndViewContainer mavContainer,
                                  NativeWebRequest webRequest, WebDataBinderFactory binderFactory) throws Exception {
        CurrentUsername annotation = parameter.getParameterAnnotation(CurrentUsername.class);
        String authorizationHeader = webRequest.getHeader(HttpHeaders.AUTHORIZATION);
        String userProfileHeader = webRequest.getHeader("user-profile");

        if (StringUtils.hasText(annotation.requiredEntitlement()) && StringUtils.hasText(userProfileHeader)) {
            JsonNode userProfile;

            try {
                userProfile = new ObjectMapper().readValue(userProfileHeader, JsonNode.class);
            } catch (Exception e) {
                logger.error("Failed to authorize an internal user!", e);
                throw getForbiddenStatusException();
            }

            for (JsonNode entitlement : userProfile.get("entitlements").get("c7-registration-api-application")) {
                if (entitlement.asText().equals(annotation.requiredEntitlement())) {
                    return userProfile.get("id").asText();
                }
            }
        } else if (annotation.allowAppClients() && StringUtils.hasText(authorizationHeader)) {
            try {
                return securityService.getOAuthClientId(authorizationHeader);
            } catch (Exception e) {
                logger.error("Failed to authorize an app client!", e);
                throw getForbiddenStatusException();
            }
        }

        logger.error("Authorization failed on a secured endpoint!");
        throw getForbiddenStatusException();
    }

    private Exception getForbiddenStatusException() {
        return new HttpStatusResponseException(HttpStatus.FORBIDDEN, "Access denied!", null);
    }
}

