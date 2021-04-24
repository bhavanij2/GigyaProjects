package com.monsanto.acs2.user.registration.exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@ControllerAdvice
public class ResponseEntityExceptionHandler {
    private final Logger logger = LoggerFactory.getLogger(getClass());

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<HttpStatusResponse> handleMethodArgumentNotValidException(MethodArgumentNotValidException ex) {
        List<String> messages = ex.getBindingResult().getAllErrors().stream()
                .map(DefaultMessageSourceResolvable::getDefaultMessage)
                .collect(Collectors.toList());

        return new ResponseEntity<>(new HttpStatusResponse(HttpStatus.BAD_REQUEST.value(), messages),
                HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(HttpStatusResponseException.class)
    public ResponseEntity<HttpStatusResponse> handleHttpStatusResponseException(HttpStatusResponseException ex) {
        logger.error("An exception was thrown with HTTP status " + ex.getStatus() + " for user ID " + ex.getUserId() +
                "!", ex);

        return new ResponseEntity<>(new HttpStatusResponse(ex.getStatus().value(),
                Collections.singletonList(ex.getMessage())), ex.getStatus());
    }

    @ExceptionHandler
    public ResponseEntity<HttpStatusResponse> handleAnyOtherException(Exception ex) {
        logger.error("An unhandled exception was thrown!", ex);

        return new ResponseEntity<>(new HttpStatusResponse(HttpStatus.INTERNAL_SERVER_ERROR.value(),
                Collections.singletonList("An error occurred while processing your request!")),
                HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
