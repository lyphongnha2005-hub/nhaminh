package com.group04.controllers;

import static com.group04.models.AuthDtos.*;
import java.util.Map;
import jakarta.validation.Valid;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.group04.models.AccountPrincipal;
import com.group04.services.AuthService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService service;

    public AuthController(AuthService s) {
        service = s;
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    UserView register(@Valid @RequestBody RegisterRequest r) {
        return service.register(r);
    }

    @PostMapping("/login")
    AuthResponse login(@Valid @RequestBody LoginRequest r) {
        return service.login(r);
    }

    @PostMapping("/reset-password")
    Map<String, String> resetPassword(@Valid @RequestBody ResetPasswordRequest r) {
        service.resetPassword(r);
        return Map.of("message", "Äáº·t láº¡i máº­t kháº©u thÃ nh cÃ´ng. Báº¡n cÃ³ thá»ƒ Ä‘Äƒng nháº­p báº±ng máº­t kháº©u má»›i.");
    }

    @GetMapping("/me")
    UserView me(Authentication a) {
        return service.me((AccountPrincipal) a.getPrincipal());
    }

    @PutMapping("/me")
    UserView update(Authentication a, @Valid @RequestBody ProfileUpdateRequest r) {
        return service.update((AccountPrincipal) a.getPrincipal(), r);
    }

    @PostMapping("/change-password")
    Map<String, String> password(Authentication a, @Valid @RequestBody ChangePasswordRequest r) {
        service.changePassword((AccountPrincipal) a.getPrincipal(), r);
        return Map.of("message", "Äá»•i máº­t kháº©u thÃ nh cÃ´ng. HÃ£y Ä‘Äƒng nháº­p láº¡i trÃªn cÃ¡c thiáº¿t bá»‹ khÃ¡c.");
    }

    @PostMapping("/logout")
    Map<String, String> logout() {
        return Map.of("message", "ÄÄƒng xuáº¥t thÃ nh cÃ´ng");
    }
}

