package com.group04.services;

import static org.junit.jupiter.api.Assertions.*;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import com.group04.utils.ApiException;

class MessageServiceTest {
    private MessageService service;
    @BeforeEach void setup() {
        var jdbc = new JdbcTemplate(new DriverManagerDataSource("jdbc:h2:mem:" + UUID.randomUUID() + ";DB_CLOSE_DELAY=-1"));
        jdbc.execute("CREATE SCHEMA dbo");
        jdbc.execute("CREATE TABLE dbo.community_messages (id VARCHAR(36) PRIMARY KEY, text NVARCHAR(500), status VARCHAR(10), created_at VARCHAR(30))");
        service = new MessageService(jdbc);
    }
    @Test void hideRestoreAndDelete() {
        var message = service.create("  Chúc bạn một ngày xanh!  ");
        assertEquals("Chúc bạn một ngày xanh!", service.list(false).get(0).text());
        service.moderate(message.id(), "HIDDEN");
        assertTrue(service.list(false).isEmpty());
        assertEquals(1, service.list(true).size());
        service.moderate(message.id(), "VISIBLE");
        assertEquals(1, service.list(false).size());
        service.delete(message.id());
        assertTrue(service.list(true).isEmpty());
        assertThrows(ApiException.class, () -> service.delete(message.id()));
    }
    @Test void validatesContentAndStatus() {
        assertThrows(ApiException.class, () -> service.create(" "));
        assertThrows(ApiException.class, () -> service.create("x".repeat(501)));
        var message = service.create("Xin chào");
        assertThrows(ApiException.class, () -> service.moderate(message.id(), "INVALID"));
        assertEquals(1, service.list(false).size());
    }
}
