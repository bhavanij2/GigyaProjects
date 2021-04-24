package com.monsanto.acs2.user.registration;

import com.monsanto.acs2.user.registration.security.CurrentUsernameMethodArgumentResolver;
import com.monsanto.acs2.user.registration.service.SecurityService;
import io.prometheus.client.spring.boot.EnablePrometheusEndpoint;
import io.prometheus.client.spring.boot.EnableSpringBootMetricsCollector;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.jdbc.DataSourceBuilder;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.vault.core.VaultOperations;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

import javax.sql.DataSource;
import java.util.List;
import java.util.Map;

@Configuration
@EnableAsync
@EnablePrometheusEndpoint
@EnableSpringBootMetricsCollector
public class UserRegistrationServiceAppConfig extends WebMvcConfigurerAdapter {
    private final SecurityService securityService;

    @Value("${user-registration-rds.vault.path}")
    private String rdsVaultPath;

    public UserRegistrationServiceAppConfig(SecurityService securityService) {
        this.securityService = securityService;
    }

    @Profile({"nonprod", "prod"})
    @Bean(name = "dataSource")
    @ConfigurationProperties(prefix = "database.connection.pool")
    public DataSource cloudDataSource(@Autowired VaultOperations vaultOperations) {
        return buildDataSource(vaultOperations, rdsVaultPath, null,
                ".java-buildpack/open_jdk_jre/lib/security/");
    }

    @Profile("local")
    @Bean(name = "dataSource")
    @ConfigurationProperties(prefix = "database.connection.pool")
    public DataSource localDataSource(@Autowired VaultOperations vaultOperations) {
        return buildDataSource(vaultOperations, rdsVaultPath, "localhost:9000",
                "/var/private/");
    }

    private DataSource buildDataSource(VaultOperations vaultOperations, String rdsVaultPath, String hostAndPort,
                                       String certPath) {
        Map<String, Object> vaultData = vaultOperations.read(rdsVaultPath).getData();

        String hostPort = (hostAndPort != null) ? hostAndPort : vaultData.get("host") + ":" + vaultData.get("port");
        String url = "jdbc:postgresql://" + hostPort + "/" + vaultData.get("dbname") +
                "?ssl=true&sslmode=verify-ca&sslrootcert=" + certPath + "rds-combined-ca-bundle.pem";
        return DataSourceBuilder
                .create()
                .driverClassName("org.postgresql.Driver")
                .url(url)
                .username(vaultData.get("user").toString())
                .password(vaultData.get("pwd").toString())
                .build();
    }

    @Override
    public void addArgumentResolvers(List<HandlerMethodArgumentResolver> argumentResolvers) {
        argumentResolvers.add(new CurrentUsernameMethodArgumentResolver(securityService));
    }

    //If you have to test UI to service locally uncomment this, This will take care of the CORS issue
    // @Override
    // public void addCorsMappings(CorsRegistry registry) {
    //     // registry.addMapping("/register").allowedOrigins("http://localhost:8080");
    //     registry.addMapping("/**");
    // }
}
