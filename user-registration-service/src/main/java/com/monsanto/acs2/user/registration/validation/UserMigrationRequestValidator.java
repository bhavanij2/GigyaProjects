package com.monsanto.acs2.user.registration.validation;

import com.monsanto.acs2.user.registration.dto.UserMigrationRequestDTO;
import org.springframework.util.StringUtils;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

public class UserMigrationRequestValidator implements ConstraintValidator<ValidUserMigrationRequest,
        UserMigrationRequestDTO> {

    @Override
    public void initialize(ValidUserMigrationRequest constraintAnnotation) {
    }

    @Override
    public boolean isValid(UserMigrationRequestDTO userMigrationRequestDTO, ConstraintValidatorContext context) {
        String errorMessage = null;

        if (!StringUtils.hasText(userMigrationRequestDTO.getMyMonUserId()) &&
                !StringUtils.hasText(userMigrationRequestDTO.getEmail())) {
            errorMessage = "User ID or email must be provided!";
        }

        if (errorMessage != null) {
            context.disableDefaultConstraintViolation();
            context.buildConstraintViolationWithTemplate(errorMessage).addConstraintViolation();

            return false;
        }

        return true;
    }
}
