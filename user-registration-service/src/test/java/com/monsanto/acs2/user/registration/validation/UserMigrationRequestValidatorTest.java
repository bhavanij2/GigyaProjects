package com.monsanto.acs2.user.registration.validation;

import com.monsanto.acs2.user.registration.dto.UserMigrationRequestDTO;
import org.junit.Before;
import org.junit.Test;

import javax.validation.ConstraintValidatorContext;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

public class UserMigrationRequestValidatorTest {
    private UserMigrationRequestValidator validator;

    @Before
    public void setUp() throws Exception {
        validator = new UserMigrationRequestValidator();
    }

    @Test
    public void initialize_DoesNothing() throws Exception {
        validator.initialize(null);
    }

    @Test
    public void isValid_ReturnsTrue_WhenMyMonUserIdHasText() throws Exception {
        UserMigrationRequestDTO request = mock(UserMigrationRequestDTO.class);
        when(request.getMyMonUserId()).thenReturn("test_account");

        boolean valid = validator.isValid(request, null);

        assertThat(valid).isTrue();
    }

    @Test
    public void isValid_ReturnsTrue_WhenEmailHasText() throws Exception {
        UserMigrationRequestDTO request = mock(UserMigrationRequestDTO.class);
        when(request.getEmail()).thenReturn("user@test.com");

        boolean valid = validator.isValid(request, null);

        assertThat(valid).isTrue();
    }

    @Test
    public void isValid_ReturnsTrue_WhenMyMonUserIdAndEmailHasText() throws Exception {
        UserMigrationRequestDTO request = mock(UserMigrationRequestDTO.class);
        when(request.getMyMonUserId()).thenReturn("test_account");
        when(request.getEmail()).thenReturn("user@test.com");

        boolean valid = validator.isValid(request, null);

        assertThat(valid).isTrue();
    }

    @Test
    public void isValid_ReturnsFalse_WhenMyMonUserIdAndEmailAreEmpty() throws Exception {
        UserMigrationRequestDTO request = mock(UserMigrationRequestDTO.class);
        ConstraintValidatorContext context = mock(ConstraintValidatorContext.class);
        ConstraintValidatorContext.ConstraintViolationBuilder builder =
                mock(ConstraintValidatorContext.ConstraintViolationBuilder.class);
        when(context.buildConstraintViolationWithTemplate(
                "User ID or email must be provided!")).thenReturn(builder);

        boolean valid = validator.isValid(request, context);

        assertThat(valid).isFalse();
        verify(context).disableDefaultConstraintViolation();
        verify(builder).addConstraintViolation();
    }
}