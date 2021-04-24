package com.monsanto.acs2.user.registration.security;

import java.lang.annotation.*;

@Documented
@Target(ElementType.PARAMETER)
@Retention(RetentionPolicy.RUNTIME)
public @interface CurrentUsername {

    String requiredEntitlement() default "";

    boolean allowAppClients() default false;
}
