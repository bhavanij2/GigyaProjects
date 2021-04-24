package com.monsanto.acs2.user.registration.security;

import com.monsanto.acs2.user.registration.exception.HttpStatusResponseException;
import com.monsanto.acs2.user.registration.service.SecurityService;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;
import org.springframework.core.MethodParameter;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.web.context.request.NativeWebRequest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.failBecauseExceptionWasNotThrown;
import static org.mockito.Mockito.*;

@RunWith(MockitoJUnitRunner.class)
public class CurrentUsernameMethodArgumentResolverTest {
    @Mock
    private MethodParameter parameter;
    @Mock
    private SecurityService securityService;
    @InjectMocks
    private CurrentUsernameMethodArgumentResolver resolver;

    @Test
    public void supportsParameter_ReturnsTrue() {
        when(parameter.hasParameterAnnotation(CurrentUsername.class)).thenReturn(true);

        boolean support = resolver.supportsParameter(parameter);

        assertThat(support).isTrue();
    }

    @Test
    public void supportsParameter_ReturnsFalse() {
        when(parameter.hasParameterAnnotation(CurrentUsername.class)).thenReturn(false);

        boolean support = resolver.supportsParameter(parameter);

        assertThat(support).isFalse();
    }

    @Test
    public void resolveArgument_ReturnsPingClientId() throws Exception {
        MethodParameter methodParameter = mock(MethodParameter.class);
        CurrentUsername currentUsername = mock(CurrentUsername.class);
        when(methodParameter.getParameterAnnotation(CurrentUsername.class)).thenReturn(currentUsername);
        when(currentUsername.allowAppClients()).thenReturn(true);
        NativeWebRequest request = mock(NativeWebRequest.class);
        when(request.getHeader(HttpHeaders.AUTHORIZATION)).thenReturn("hjfsd87fsuhsfuy");
        when(securityService.getOAuthClientId("hjfsd87fsuhsfuy")).thenReturn("TEST_USER");

        String clientId = (String) resolver.resolveArgument(methodParameter, null, request,
                null);

        assertThat(clientId).isEqualTo("TEST_USER");
    }

    @Test
    public void resolveArgument_ThrowsHttpStatusResponseException_WhenNoAuthorizationHeader() throws Exception {
        MethodParameter methodParameter = mock(MethodParameter.class);
        CurrentUsername currentUsername = mock(CurrentUsername.class);
        when(methodParameter.getParameterAnnotation(CurrentUsername.class)).thenReturn(currentUsername);
        when(currentUsername.allowAppClients()).thenReturn(true);
        NativeWebRequest request = mock(NativeWebRequest.class);

        try {
            resolver.resolveArgument(methodParameter, null, request, null);
            failBecauseExceptionWasNotThrown(HttpStatusResponseException.class);
        } catch (HttpStatusResponseException e) {
            assertThat(e.getStatus()).isEqualTo(HttpStatus.FORBIDDEN);
            assertThat(e.getMessage()).isEqualTo("Access denied!");
            assertThat(e.getUserId()).isNull();
            assertThat(e.getCause()).isNull();
            verifyZeroInteractions(securityService);
        }
    }

    @Test
    public void resolveArgument_ThrowsHttpStatusResponseException_WhenSecurityServiceThrowsException() throws Exception {
        MethodParameter methodParameter = mock(MethodParameter.class);
        CurrentUsername currentUsername = mock(CurrentUsername.class);
        when(methodParameter.getParameterAnnotation(CurrentUsername.class)).thenReturn(currentUsername);
        when(currentUsername.allowAppClients()).thenReturn(true);
        NativeWebRequest request = mock(NativeWebRequest.class);
        when(request.getHeader(HttpHeaders.AUTHORIZATION)).thenReturn("hjfsd87fsuhsfuy");
        when(securityService.getOAuthClientId("hjfsd87fsuhsfuy")).thenThrow(new RuntimeException());

        try {
            resolver.resolveArgument(methodParameter, null, request, null);
            failBecauseExceptionWasNotThrown(HttpStatusResponseException.class);
        } catch (HttpStatusResponseException e) {
            assertThat(e.getStatus()).isEqualTo(HttpStatus.FORBIDDEN);
            assertThat(e.getMessage()).isEqualTo("Access denied!");
            assertThat(e.getUserId()).isNull();
            assertThat(e.getCause()).isNull();
            verify(securityService).getOAuthClientId(anyString());
        }
    }

    @Test
    public void resolveArgument_ReturnsIdFromUserProfile() throws Exception {
        MethodParameter methodParameter = mock(MethodParameter.class);
        CurrentUsername currentUsername = mock(CurrentUsername.class);
        when(methodParameter.getParameterAnnotation(CurrentUsername.class)).thenReturn(currentUsername);
        when(currentUsername.requiredEntitlement()).thenReturn("test-entitlement");
        NativeWebRequest request = mock(NativeWebRequest.class);
        when(request.getHeader("user-profile")).thenReturn("{\"id\":\"INTERNAL_USER\"," +
                "\"entitlements\": {\"c7-registration-api-application\": [\"test-entitlement\"]}}");

        String userId = (String) resolver.resolveArgument(methodParameter, null, request, null);

        assertThat(userId).isEqualTo("INTERNAL_USER");
    }

    @Test
    public void resolveArgument_ThrowsHttpStatusResponseException_WhenUserDoesNotHaveRequiredEntitlement() throws Exception {
        MethodParameter methodParameter = mock(MethodParameter.class);
        CurrentUsername currentUsername = mock(CurrentUsername.class);
        when(methodParameter.getParameterAnnotation(CurrentUsername.class)).thenReturn(currentUsername);
        when(currentUsername.requiredEntitlement()).thenReturn("test-entitlement");
        NativeWebRequest request = mock(NativeWebRequest.class);
        when(request.getHeader("user-profile")).thenReturn("{\"id\":\"INTERNAL_USER\"," +
                "\"entitlements\": {\"c7-registration-api-application\": [\"test\"]}}");

        try {
            resolver.resolveArgument(methodParameter, null, request, null);
            failBecauseExceptionWasNotThrown(HttpStatusResponseException.class);
        } catch (HttpStatusResponseException e) {
            assertThat(e.getStatus()).isEqualTo(HttpStatus.FORBIDDEN);
            assertThat(e.getMessage()).isEqualTo("Access denied!");
            assertThat(e.getUserId()).isNull();
            assertThat(e.getCause()).isNull();
            verify(currentUsername, times(2)).requiredEntitlement();
        }
    }

    @Test
    public void resolveArgument_ThrowsHttpStatusResponseException_WhenNoUserProfileHeader() throws Exception {
        MethodParameter methodParameter = mock(MethodParameter.class);
        CurrentUsername currentUsername = mock(CurrentUsername.class);
        when(methodParameter.getParameterAnnotation(CurrentUsername.class)).thenReturn(currentUsername);
        when(currentUsername.requiredEntitlement()).thenReturn("test-entitlement");
        NativeWebRequest request = mock(NativeWebRequest.class);

        try {
            resolver.resolveArgument(methodParameter, null, request, null);
            failBecauseExceptionWasNotThrown(HttpStatusResponseException.class);
        } catch (HttpStatusResponseException e) {
            assertThat(e.getStatus()).isEqualTo(HttpStatus.FORBIDDEN);
            assertThat(e.getMessage()).isEqualTo("Access denied!");
            assertThat(e.getUserId()).isNull();
            assertThat(e.getCause()).isNull();
            verify(currentUsername).requiredEntitlement();
        }
    }

    @Test
    public void resolveArgument_ThrowsHttpStatusResponseException_WhenUserProfileParsingFails() throws Exception {
        MethodParameter methodParameter = mock(MethodParameter.class);
        CurrentUsername currentUsername = mock(CurrentUsername.class);
        when(methodParameter.getParameterAnnotation(CurrentUsername.class)).thenReturn(currentUsername);
        when(currentUsername.requiredEntitlement()).thenReturn("test-entitlement");
        NativeWebRequest request = mock(NativeWebRequest.class);
        when(request.getHeader("user-profile")).thenReturn("test");

        try {
            resolver.resolveArgument(methodParameter, null, request, null);
            failBecauseExceptionWasNotThrown(HttpStatusResponseException.class);
        } catch (HttpStatusResponseException e) {
            assertThat(e.getStatus()).isEqualTo(HttpStatus.FORBIDDEN);
            assertThat(e.getMessage()).isEqualTo("Access denied!");
            assertThat(e.getUserId()).isNull();
            assertThat(e.getCause()).isNull();
            verify(currentUsername).requiredEntitlement();
        }
    }

    @Test
    public void resolveArgument_ThrowsHttpStatusResponseException_WhenNoRequiredEntitlementAndAppClientsNotAllowed() throws Exception {
        MethodParameter methodParameter = mock(MethodParameter.class);
        CurrentUsername currentUsername = mock(CurrentUsername.class);
        when(methodParameter.getParameterAnnotation(CurrentUsername.class)).thenReturn(currentUsername);
        when(currentUsername.requiredEntitlement()).thenReturn("");
        when(currentUsername.allowAppClients()).thenReturn(false);
        NativeWebRequest request = mock(NativeWebRequest.class);

        try {
            resolver.resolveArgument(methodParameter, null, request, null);
            failBecauseExceptionWasNotThrown(HttpStatusResponseException.class);
        } catch (HttpStatusResponseException e) {
            assertThat(e.getStatus()).isEqualTo(HttpStatus.FORBIDDEN);
            assertThat(e.getMessage()).isEqualTo("Access denied!");
            assertThat(e.getUserId()).isNull();
            assertThat(e.getCause()).isNull();
            verifyZeroInteractions(securityService);
            verify(currentUsername).requiredEntitlement();
        }
    }
}