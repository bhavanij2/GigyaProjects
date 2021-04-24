package com.monsanto.acs2.user.registration.exception;

import org.springframework.http.HttpStatus;

import java.util.UUID;

public class HttpStatusResponseException extends RuntimeException {
    private final HttpStatus status;
    private final UUID userId;

    public HttpStatusResponseException(HttpStatus status, String message, UUID userId) {
        super(message);
        this.status = status;
        this.userId = userId;
    }

    public HttpStatus getStatus() {
        return this.status;
    }

    public UUID getUserId() {
        return userId;
    }
}
