package com.monsanto.acs2.user.registration.validation;

import com.monsanto.acs2.user.registration.dto.UserRegistrationRequestDTO;
import com.monsanto.acs2.user.registration.entity.PhoneType;
import org.junit.Before;
import org.junit.Test;

import javax.validation.ConstraintValidatorContext;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

public class UserRegistrationRequestValidatorTest {
    private UserRegistrationRequestValidator validator;

    @Before
    public void setUp() throws Exception {
        validator = new UserRegistrationRequestValidator();
    }

    @Test
    public void initialize_DoesNothing() throws Exception {
        validator.initialize(null);
    }

    @Test
    public void isValid_ReturnsTrue_WhenPhone2AndPhoneType2AreEmpty() throws Exception {
        UserRegistrationRequestDTO userRegistrationRequestDTO = mock(UserRegistrationRequestDTO.class);

        boolean valid = validator.isValid(userRegistrationRequestDTO, null);

        assertThat(valid).isTrue();
    }

    @Test
    public void isValid_ReturnsTrue_WhenPhone2AndPhoneType2ArePopulated() throws Exception {
        UserRegistrationRequestDTO userRegistrationRequestDTO = mock(UserRegistrationRequestDTO.class);
        when(userRegistrationRequestDTO.getPhone2()).thenReturn("555-555-5555");
        when(userRegistrationRequestDTO.getPhoneType2()).thenReturn(PhoneType.MOBILE);

        boolean valid = validator.isValid(userRegistrationRequestDTO, null);

        assertThat(valid).isTrue();
    }

    @Test
    public void isValid_ReturnsFalse_WhenPhone2IsPopulatedAndPhoneType2IsNull() throws Exception {
        UserRegistrationRequestDTO userRegistrationRequestDTO = mock(UserRegistrationRequestDTO.class);
        ConstraintValidatorContext context = mock(ConstraintValidatorContext.class);
        ConstraintValidatorContext.ConstraintViolationBuilder builder =
                mock(ConstraintValidatorContext.ConstraintViolationBuilder.class);
        when(context.buildConstraintViolationWithTemplate(
                "Please provide the type for your second phone number.")).thenReturn(builder);
        when(userRegistrationRequestDTO.getPhone2()).thenReturn("555-555-5555");

        boolean valid = validator.isValid(userRegistrationRequestDTO, context);

        assertThat(valid).isFalse();
        verify(context).disableDefaultConstraintViolation();
        verify(builder).addConstraintViolation();
    }

    @Test
    public void isValid_ReturnsFalse_WhenPhone2IsNullAndPhoneType2IsPopulated() throws Exception {
        UserRegistrationRequestDTO userRegistrationRequestDTO = mock(UserRegistrationRequestDTO.class);
        ConstraintValidatorContext context = mock(ConstraintValidatorContext.class);
        ConstraintValidatorContext.ConstraintViolationBuilder builder =
                mock(ConstraintValidatorContext.ConstraintViolationBuilder.class);
        when(context.buildConstraintViolationWithTemplate(
                "Please provide your second phone number.")).thenReturn(builder);
        when(userRegistrationRequestDTO.getPhoneType2()).thenReturn(PhoneType.MOBILE);

        boolean valid = validator.isValid(userRegistrationRequestDTO, context);

        assertThat(valid).isFalse();
        verify(context).disableDefaultConstraintViolation();
        verify(builder).addConstraintViolation();
    }
}