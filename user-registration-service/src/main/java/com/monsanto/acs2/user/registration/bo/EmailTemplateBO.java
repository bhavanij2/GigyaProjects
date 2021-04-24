package com.monsanto.acs2.user.registration.bo;
import freemarker.cache.StringTemplateLoader;
import freemarker.template.Configuration;
import freemarker.template.Template;
import freemarker.template.TemplateException;
import freemarker.template.Version;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.StringWriter;

@Component
public class EmailTemplateBO {
    private static final String FREEMARKER_VERSION = "2.3.23";

    public String processTemplate(String templateCode, String templateStr, Object data)
            throws IOException, TemplateException {
        StringTemplateLoader stringLoader = new StringTemplateLoader();
        stringLoader.putTemplate(templateCode, templateStr);

        Configuration cfg = new Configuration(new Version(FREEMARKER_VERSION));
        cfg.setTemplateLoader(stringLoader);
        Template template = cfg.getTemplate(templateCode);

        StringWriter stringWriter = new StringWriter();
        template.process(data, stringWriter);

        return stringWriter.toString();
    }
}
