package com.group04.services;

import static com.group04.models.AuthDtos.*;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.group04.utils.ApiException;
import com.group04.dao.AdminRepository;
import com.group04.dao.CustomerRepository;
import com.group04.dao.RoleRepository;
import com.group04.models.*;

@Service
@Transactional
public class AuthService {
    private final CustomerRepository customers;
    private final AdminRepository admins;
    private final RoleRepository roles;
    private final PasswordEncoder passwords;
    private final JwtService jwt;

    public AuthService(CustomerRepository c, AdminRepository a, RoleRepository r, PasswordEncoder p, JwtService j) {
        customers = c;
        admins = a;
        roles = r;
        passwords = p;
        jwt = j;
    }

    public UserView register(RegisterRequest r) {
        String email = r.email().trim().toLowerCase(), phone = blank(r.phone());
        if (customers.existsByEmailIgnoreCase(email) || admins.existsByEmailIgnoreCase(email))
            throw new ApiException(HttpStatus.CONFLICT, "Email Ä‘Ã£ Ä‘Æ°á»£c sá»­ dá»¥ng");
        if (phone != null && customers.existsByPhone(phone))
            throw new ApiException(HttpStatus.CONFLICT, "Sá»‘ Ä‘iá»‡n thoáº¡i Ä‘Ã£ Ä‘Æ°á»£c sá»­ dá»¥ng");
        Role role = roles.findByName("CUSTOMER").orElseThrow(
                () -> new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "Role CUSTOMER chÆ°a Ä‘Æ°á»£c khá»Ÿi táº¡o"));
        return view(
                customers.save(new Customer(role, r.fullName().trim(), email, phone, passwords.encode(r.password()))));
    }

    public AuthResponse login(LoginRequest r) {
        String email = r.email().trim();
        Account account = admins.findByEmailIgnoreCase(email).map(Account.class::cast).orElseGet(
                () -> customers.findByEmailIgnoreCase(email).map(Account.class::cast).orElseThrow(() -> badLogin()));
        if (!passwords.matches(r.password(), account.getPasswordHash()))
            throw badLogin();
        if (!"ACTIVE".equals(account.getStatus()))
            throw new ApiException(HttpStatus.FORBIDDEN, "TÃ i khoáº£n Ä‘ang bá»‹ khÃ³a hoáº·c vÃ´ hiá»‡u hÃ³a");
        var token = jwt.issue(account);
        return new AuthResponse(token.value(), "Bearer", token.expiresAt(), view(account));
    }

    public UserView me(AccountPrincipal principal) {
        return view(get(principal));
    }

    public UserView update(AccountPrincipal principal, ProfileUpdateRequest r) {
        Account account = get(principal);
        String phone = blank(r.phone());
        if (account instanceof Customer && phone != null && !phone.equals(account.getPhone())
                && customers.existsByPhone(phone))
            throw new ApiException(HttpStatus.CONFLICT, "Sá»‘ Ä‘iá»‡n thoáº¡i Ä‘Ã£ Ä‘Æ°á»£c sá»­ dá»¥ng");
        account.setFullName(r.fullName().trim());
        account.setPhone(phone);
        return view(account);
    }

    public void changePassword(AccountPrincipal principal, ChangePasswordRequest r) {
        Account account = get(principal);
        if (!passwords.matches(r.currentPassword(), account.getPasswordHash()))
            throw new ApiException(HttpStatus.BAD_REQUEST, "Máº­t kháº©u hiá»‡n táº¡i khÃ´ng Ä‘Ãºng");
        account.setPasswordHash(passwords.encode(r.newPassword()));
    }

    public void resetPassword(ResetPasswordRequest r) {
        Customer customer = customers.findByEmailIgnoreCase(r.email().trim())
                .filter(c -> c.getPhone() != null && c.getPhone().equals(r.phone().trim()))
                .orElseThrow(() -> new ApiException(HttpStatus.BAD_REQUEST, "Email hoáº·c sá»‘ Ä‘iá»‡n thoáº¡i khÃ´ng Ä‘Ãºng"));
        if (!"ACTIVE".equals(customer.getStatus()))
            throw new ApiException(HttpStatus.FORBIDDEN, "TÃ i khoáº£n Ä‘ang bá»‹ khÃ³a hoáº·c vÃ´ hiá»‡u hÃ³a");
        customer.setPasswordHash(passwords.encode(r.newPassword()));
    }

    public Account get(AccountPrincipal principal) {
        return switch (principal.accountType()) {
            case "ADMIN" -> admins.findById(principal.id()).orElseThrow(() -> missing());
            case "CUSTOMER" -> customers.findById(principal.id()).orElseThrow(() -> missing());
            default -> throw missing();
        };
    }

    private ApiException missing() {
        return new ApiException(HttpStatus.UNAUTHORIZED, "TÃ i khoáº£n khÃ´ng tá»“n táº¡i");
    }

    private ApiException badLogin() {
        return new ApiException(HttpStatus.UNAUTHORIZED, "Tài khoản hoặc mật khẩu không chính xác");
    }

    private String blank(String s) {
        return s == null || s.isBlank() ? null : s.trim();
    }

    public static UserView view(Account a) {
        return new UserView(a.getId(), a.getFullName(), a.getEmail(), a.getPhone(), a.getRole().getName(),
                a.getStatus());
    }
}

