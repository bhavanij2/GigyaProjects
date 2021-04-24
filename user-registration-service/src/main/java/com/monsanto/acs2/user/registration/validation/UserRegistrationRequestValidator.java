package com.monsanto.acs2.user.registration.validation;

import com.monsanto.acs2.user.registration.dto.UserRegistrationRequestDTO;
import org.springframework.util.StringUtils;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

public class UserRegistrationRequestValidator implements ConstraintValidator<ValidUserRegistrationRequest,
        UserRegistrationRequestDTO> {

    @Override
    public void initialize(ValidUserRegistrationRequest constraintAnnotation) {}

    @Override
    public boolean isValid(UserRegistrationRequestDTO userRegistrationRequestDTO, ConstraintValidatorContext context) {
        String errorMessage = null;

        if (StringUtils.hasText(userRegistrationRequestDTO.getPhone2()) &&
                userRegistrationRequestDTO.getPhoneType2() == null) {
            errorMessage = "Please provide the type for your second phone number.";
        } else if (userRegistrationRequestDTO.getPhoneType2() != null &&
                !StringUtils.hasText(userRegistrationRequestDTO.getPhone2())) {
            errorMessage = "Please provide your second phone number.";
        }

        if (errorMessage != null) {
            context.disableDefaultConstraintViolation();
            context.buildConstraintViolationWithTemplate(errorMessage).addConstraintViolation();

            return false;
        }

        return true;
    }
}
