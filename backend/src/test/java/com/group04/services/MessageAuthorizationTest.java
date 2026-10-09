package com.group04.services;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.AfterEach;
import org.springframework.context.annotation.*;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.access.AccessDeniedException;
import com.group04.controllers.MessageController;

class MessageAuthorizationTest {
    @Configuration @EnableMethodSecurity
    static class Config {
        @Bean MessageService service() { return mock(MessageService.class); }
        @Bean MessageController controller(MessageService service) { return new MessageController(service); }
    }
    @AfterEach void clear() { SecurityContextHolder.clearContext(); }
    @Test void customerCannotModerateButAdminCan() {
        try (var context = new AnnotationConfigApplicationContext(Config.class)) {
            var controller = context.getBean(MessageController.class);
            SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken("customer", "", AuthorityUtils.createAuthorityList("ROLE_CUSTOMER")));
            assertThrows(AccessDeniedException.class, controller::all);
            assertThrows(AccessDeniedException.class, () -> controller.delete("123"));
            assertThrows(AccessDeniedException.class, () -> controller.moderate("123", new MessageController.ModerateMessage("HIDDEN")));
            SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken("admin", "", AuthorityUtils.createAuthorityList("ROLE_ADMIN")));
            controller.moderate("123", new MessageController.ModerateMessage("HIDDEN"));
            controller.delete("123");
            verify(context.getBean(MessageService.class)).moderate("123", "HIDDEN");
            verify(context.getBean(MessageService.class)).delete("123");
        }
    }
}
