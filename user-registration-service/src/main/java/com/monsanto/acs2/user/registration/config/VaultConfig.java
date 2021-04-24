package com.monsanto.acs2.user.registration.config;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.util.StringUtils;
import org.springframework.vault.authentication.AppRoleAuthentication;
import org.springframework.vault.authentication.AppRoleAuthenticationOptions;
import org.springframework.vault.authentication.ClientAuthentication;
import org.springframework.vault.client.VaultClients;
import org.springframework.vault.client.VaultEndpoint;
import org.springframework.vault.config.AbstractVaultConfiguration;

import java.io.IOException;

@Configuration
public class VaultConfig extends AbstractVaultConfiguration {

    @Override
    public VaultEndpoint vaultEndpoint() {
        return VaultEndpoint.create("vault.agro.services", 443);
    }

    @Override
    public ClientAuthentication clientAuthentication() {
        try {
            VaultCredentials vaultCredentials = getVaultCredentials();
            AppRoleAuthenticationOptions options = AppRoleAuthenticationOptions.builder()
                    .roleId(vaultCredentials.roleId)
                    .secretId(vaultCredentials.secretId)
                    .build();

            return new AppRoleAuthentication(options,
                    VaultClients.createRestTemplate(vaultEndpoint(), new SimpleClientHttpRequestFactory()));
        } catch (Exception e) {
            throw new RuntimeException("Vault Authentication failed!", e);
        }
    }

    private VaultCredentials getVaultCredentials() throws IOException {
        String vcapServices = System.getenv("VCAP_SERVICES");

        if (StringUtils.hasText(vcapServices)) {
            JsonNode userProvidedServices = new ObjectMapper().readTree(vcapServices).get("user-provided");
            for (JsonNode userProvidedService : userProvidedServices) {
                JsonNode credentials = userProvidedService.get("credentials");
                if (credentials.get("name").textValue().equals("user-registration-service-vault-details")) {
                    String role_id = credentials.get("role_id").textValue();
                    String secret_id = credentials.get("secret_id").textValue();

                    return new VaultCredentials(role_id, secret_id);
                }
            }
        }

        String roleId = System.getenv("VAULT_ROLE_ID");
        String secretId = System.getenv("VAULT_SECRET");

        if (StringUtils.hasText(roleId) && StringUtils.hasText(secretId)) {
            return new VaultCredentials(roleId, secretId);
        }

        throw new RuntimeException("Credentials for Vault configuration were not found!");
    }

    private class VaultCredentials {
        private final String roleId;
        private final String secretId;

        private VaultCredentials(String roleId, String secretId) {
            this.roleId = roleId;
            this.secretId = secretId;
        }
    }
}
