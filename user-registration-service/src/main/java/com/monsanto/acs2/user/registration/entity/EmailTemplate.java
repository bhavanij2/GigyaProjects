package com.monsanto.acs2.user.registration.entity;

public class EmailTemplate {

    private EmailTemplateCode code;

    private String template;

    private String subject;

    public EmailTemplateCode getCode() {
        return code;
    }

    public void setCode(EmailTemplateCode code) {
        this.code = code;
    }

    public String getTemplate() {
        return template;
    }

    public void setTemplate(String template) {
        this.template = template;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }
}
