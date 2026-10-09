package com.group04.services;

import com.group04.models.AuthDtos.RegisterRequest;
import jakarta.validation.Validation;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class RegisterPhoneValidationTest {
    @Test void registrationRequiresPhone() {
        try (var factory = Validation.buildDefaultValidatorFactory()) {
            var validator = factory.getValidator();
            for (String phone : new String[] {null, "", "   "}) {
                var errors = validator.validate(new RegisterRequest("Nguyen A", "a@example.com", phone, "Strong@123"));
                assertTrue(errors.stream().anyMatch(error -> error.getPropertyPath().toString().equals("phone")));
            }
            assertTrue(validator.validate(new RegisterRequest("Nguyen A", "a@example.com", "0901234567", "Strong@123")).isEmpty());
        }
    }
}
