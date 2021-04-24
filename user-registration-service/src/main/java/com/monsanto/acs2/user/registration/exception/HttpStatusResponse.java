package com.monsanto.acs2.user.registration.exception;

import java.util.List;

public class HttpStatusResponse {
    private final int status;
    private final List<String> messages;

    public HttpStatusResponse(int status, List<String> messages) {
        this.status = status;
        this.messages = messages;
    }

    public int getStatus() {
        return status;
    }

    public List<String> getMessages() {
        return messages;
    }
}
