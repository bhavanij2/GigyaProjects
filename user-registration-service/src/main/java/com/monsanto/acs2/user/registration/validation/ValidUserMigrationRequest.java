package com.monsanto.acs2.user.registration.validation;

import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Constraint(validatedBy = UserMigrationRequestValidator.class)
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidUserMigrationRequest {

    String message() default "Validation failed!";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
