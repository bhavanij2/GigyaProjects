package com.monsanto.acs2.user.registration.exception;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;
import org.slf4j.Logger;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.validation.BindingResult;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.MethodArgumentNotValidException;

import java.util.Arrays;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@RunWith(MockitoJUnitRunner.class)
public class ResponseEntityExceptionHandlerTest {
    private ResponseEntityExceptionHandler exceptionHandler;
    @Mock
    private Logger logger;

    @Before
    public void setUp() throws Exception {
        exceptionHandler = new ResponseEntityExceptionHandler();

        ReflectionTestUtils.setField(exceptionHandler, "logger", logger);
    }

    @Test
    public void handleMethodArgumentNotValidException() throws Exception {
        MethodArgumentNotValidException exception = mock(MethodArgumentNotValidException.class);
        BindingResult bindingResult = mock(BindingResult.class);
        ObjectError objectError = mock(ObjectError.class);
        when(exception.getBindingResult()).thenReturn(bindingResult);
        when(bindingResult.getAllErrors()).thenReturn(Arrays.asList(objectError, objectError, objectError));
        when(objectError.getDefaultMessage()).thenReturn("error1", "error2", "error3");

        ResponseEntity<HttpStatusResponse> response = exceptionHandler.handleMethodArgumentNotValidException(exception);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        HttpStatusResponse body = response.getBody();
        assertThat(body.getStatus()).isEqualTo(HttpStatus.BAD_REQUEST.value());
        assertThat(body.getMessages()).hasSize(3);
        assertThat(body.getMessages().get(0)).isEqualTo("error1");
        assertThat(body.getMessages().get(1)).isEqualTo("error2");
        assertThat(body.getMessages().get(2)).isEqualTo("error3");
    }

    @Test
    public void handleHttpStatusResponseException() throws Exception {
        UUID userId = UUID.randomUUID();
        HttpStatusResponseException exception = new HttpStatusResponseException(HttpStatus.BAD_REQUEST,
                "Missing data!", userId);

        ResponseEntity<HttpStatusResponse> response = exceptionHandler.handleHttpStatusResponseException(exception);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        HttpStatusResponse body = response.getBody();
        assertThat(body.getStatus()).isEqualTo(HttpStatus.BAD_REQUEST.value());
        assertThat(body.getMessages()).hasSize(1);
        assertThat(body.getMessages().get(0)).isEqualTo("Missing data!");
        verify(logger).error("An exception was thrown with HTTP status 400 for user ID " + userId + "!", exception);
    }

    @Test
    public void handleAnyOtherException() throws Exception {
        ResponseEntity<HttpStatusResponse> response = exceptionHandler.handleAnyOtherException(new RuntimeException());

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);
        HttpStatusResponse body = response.getBody();
        assertThat(body.getStatus()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR.value());
        assertThat(body.getMessages()).hasSize(1);
        assertThat(body.getMessages().get(0)).isEqualTo("An error occurred while processing your request!");
    }
}