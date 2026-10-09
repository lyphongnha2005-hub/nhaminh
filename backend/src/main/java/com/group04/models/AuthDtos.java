package com.group04.models;

import java.time.Instant;
import jakarta.validation.constraints.*;

public final class AuthDtos {
    private AuthDtos() {
    }

    public record RegisterRequest(@NotBlank @Size(max = 120) String fullName,
            @NotBlank @Email @Size(max = 255) String email,
            @NotBlank(message = "Vui lòng nhập số điện thoại")
            @Pattern(regexp = "^[0-9+() .-]{8,20}$", message = "Số điện thoại không hợp lệ") String phone,
            @NotBlank @Size(min = 8, max = 72) @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]).+$", message = "Máº­t kháº©u pháº£i cÃ³ chá»¯ hoa, chá»¯ thÆ°á»ng, sá»‘ vÃ  kÃ½ tá»± Ä‘áº·c biá»‡t") String password) {
    }

    public record LoginRequest(@NotBlank @Email String email, @NotBlank String password) {
    }

    public record ChangePasswordRequest(@NotBlank String currentPassword,
            @NotBlank @Size(min = 8, max = 72) @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]).+$", message = "Máº­t kháº©u pháº£i cÃ³ chá»¯ hoa, chá»¯ thÆ°á»ng, sá»‘ vÃ  kÃ½ tá»± Ä‘áº·c biá»‡t") String newPassword) {
    }

    public record ResetPasswordRequest(@NotBlank @Email String email,
            @NotBlank @Pattern(regexp = "^[0-9+() .-]{8,20}$", message = "Sá»‘ Ä‘iá»‡n thoáº¡i khÃ´ng há»£p lá»‡") String phone,
            @NotBlank @Size(min = 8, max = 72) @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]).+$", message = "Máº­t kháº©u pháº£i cÃ³ chá»¯ hoa, chá»¯ thÆ°á»ng, sá»‘ vÃ  kÃ½ tá»± Ä‘áº·c biá»‡t") String newPassword) {
    }

    public record ProfileUpdateRequest(@NotBlank @Size(max = 120) String fullName,
            @Pattern(regexp = "^$|^[0-9+() .-]{8,20}$", message = "Sá»‘ Ä‘iá»‡n thoáº¡i khÃ´ng há»£p lá»‡") String phone) {
    }

    public record UserView(Long id, String fullName, String email, String phone, String role, String status) {
    }

    public record AuthResponse(String accessToken, String tokenType, Instant expiresAt, UserView user) {
    }
}

