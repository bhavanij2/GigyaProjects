package com.monsanto.acs2.user.registration.bo;

import org.junit.Test;

import java.util.HashMap;
import java.util.Map;

import static org.junit.Assert.assertEquals;

public class EmailTemplateBOTest {

    @Test
    public void processTemplate() throws Exception {
        EmailTemplateBO helper = new EmailTemplateBO();

        Map<String, Object> data = new HashMap<>();
        data.put("user", "World");
        String expected = "Hello " + data.get("user") + "!";
        String actual = helper.processTemplate("hello-world", "Hello ${user}!", data);

        assertEquals(expected, actual);
    }
}