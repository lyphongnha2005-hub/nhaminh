package com.group04.utils;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import com.group04.dao.AdminRepository;
import com.group04.dao.RoleRepository;
import com.group04.models.Admin;
import com.group04.models.Role;

@Component
public class DataInitializer implements ApplicationRunner {
    private final RoleRepository roles;
    private final AdminRepository admins;
    private final PasswordEncoder encoder;
    private final String email, password, name;

    public DataInitializer(RoleRepository r, AdminRepository a, PasswordEncoder e,
            @Value("${app.admin.email}") String email, @Value("${app.admin.password}") String password,
            @Value("${app.admin.full-name}") String name) {
        roles = r;
        admins = a;
        encoder = e;
        this.email = email;
        this.password = password;
        this.name = name;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        Role admin = roles.findByName("ADMIN").orElseGet(() -> roles.save(new Role("ADMIN", "Quáº£n trá»‹ viÃªn")));
        roles.findByName("CUSTOMER").orElseGet(() -> roles.save(new Role("CUSTOMER", "KhÃ¡ch hÃ ng")));
        boolean any = !email.isBlank() || !password.isBlank() || !name.isBlank();
        if (!any)
            return;
        if (email.isBlank() || password.isBlank() || name.isBlank())
            throw new IllegalStateException("Pháº£i cáº¥u hÃ¬nh Ä‘á»“ng thá»i ADMIN_EMAIL, ADMIN_PASSWORD vÃ  ADMIN_FULL_NAME");
        if (password.length() < 8)
            throw new IllegalStateException("ADMIN_PASSWORD pháº£i cÃ³ Ã­t nháº¥t 8 kÃ½ tá»±");
        if (admins.findByEmailIgnoreCase(email.trim()).isEmpty())
            admins.save(new Admin(admin, name.trim(), email.trim().toLowerCase(), null, encoder.encode(password)));
    }
}

