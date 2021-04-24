# user-registration-service

The first time you may need to set up this project off network.
You will need to be on mondev network for active local development.

## Setting up Maven

Install Maven from the apache website. 

> Note: Homebrew can create unwanted symlinks


## Run locally on CLI

### First time Setup

1. Set up ssh configs to RDS in [this link](https://github.platforms.engineering/acs2-foundation/docs/wiki/Self-Registration-Local-Development-Setup-(SSH)).
2. Get `VCAP_SERVICES` in from vault
    1. `vault read secret/c7/non-prod/env/user-registration-service`
    2. Save it to use when you run the application
    
### Running the application locally

1. ssh into RDS before running the application.
   - `ssh acs2-c7-registration-np-rds` if you followed the above link.
   > Note: Make sure you're logged in to vault.
2. `VCAP_SERVICES='{<vcap_services from vault>}' mvn spring-boot:run -Dspring.profiles.active=local`


### If you are having cert issues:]
1. get the cert from vault.agro.services
    - `openssl s_client -connect vault.agro.services:443 < /dev/null | sed -ne '/-BEGIN CERTIFICATE-/,/-END CERTIFICATE-/p' > public.crt`
2. add the cert to your keystore
    - `keytool -import -alias vault -keystore $JAVA_HOME/jre/lib/security/cacerts -file public.crt`
3. you may need to run both these commands and `mvn spring-boot:run` as sudoer depending on the ownership of your cacerts

## Run locally on IntelliJ IDE

### First time Setup

1. Set up ssh configs to RDS in [this link](https://github.platforms.engineering/acs2-foundation/docs/wiki/Connecting-to-self-registration-RDS).
2. Set up spring-boot configurations
    1. Click on "Edit Configurations..."
    2. Select "Spring Boot"
    3. Select "UserRegistrationServiceApp"
    4. Add VCAP_SERVICES from vault to "Environment variables:"
        - `vault read secret/c7/non-prod/env/user-registration-service`
        - VCAP_SERVICES={<VCAP_SERVICES Object Retrieved from Vault>} 
        > Note: The object should remain an object, not a string of the VCAP_SERVICES object.
    5. Scroll to  "Active profiles:" and add `local`

### Cloud foundry one time set up

**In Non Prod**

cf cups user-registration-service-vault-details -p '{"alias": "user-registration-service-vault-details", "name": "user-registration-service-vault-details", "path": "secret/c7/non-prod", "role_id": "<replace with role id>","secret_id": "<replace with role secret>","url": "https://vault.agro.services"}'

**In prod**

cf cups user-registration-service-vault-details -p '{"alias": "user-registration-service-vault-details", "name": "user-registration-service-vault-details", "path": "secret/c7/prod", "role_id": "<replace with role id>","secret_id": "<replace with role secret>","url": "https://vault.agro.services"}'

    
### Running the application locally

1. ssh into RDS before running the application.
   - `ssh acs2-c7-registration-np-rds` if you followed the above link.
   > Note: Make sure you're logged in to vault.
2. Hit the play button at the top right.
