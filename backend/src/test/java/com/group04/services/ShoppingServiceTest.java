package com.group04.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.group04.models.AccountPrincipal;
import com.group04.utils.ApiException;
import org.junit.jupiter.api.*;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import java.util.UUID;
import static org.junit.jupiter.api.Assertions.*;

class ShoppingServiceTest {
    private JdbcTemplate jdbc;
    private ShoppingService service;
    private final ObjectMapper mapper = new ObjectMapper();
    private final AccountPrincipal first = new AccountPrincipal(1L, "CUSTOMER");
    private final AccountPrincipal second = new AccountPrincipal(2L, "CUSTOMER");
    @BeforeEach void setup() {
        jdbc = new JdbcTemplate(new DriverManagerDataSource("jdbc:h2:mem:" + UUID.randomUUID() + ";DB_CLOSE_DELAY=-1"));
        jdbc.execute("CREATE SCHEMA dbo");
        jdbc.execute("CREATE TABLE dbo.account_collections (account_type VARCHAR(10), account_id BIGINT, kind VARCHAR(10), payload NVARCHAR(MAX), PRIMARY KEY(account_type,account_id,kind))");
        service = new ShoppingService(jdbc, mapper);
    }
    @Test void accountsAndListsRemainSeparateAfterReload() throws Exception {
        var cart = mapper.readTree("""
          [{"cartItemId":"abc","productId":"7","name":"Đèn","image":"/image.png","size":"M","waxTone":"Xanh","fitting":"default","unitPrice":1000,"quantity":2,"recycledWasteAmount":"1kg"}]
          """);
        service.save(first, "cart", cart);
        service.save(first, "wishlist", mapper.readTree("[\"7\"]"));
        service.save(second, "wishlist", mapper.readTree("[\"8\"]"));
        var reloaded = new ShoppingService(jdbc, mapper);
        assertEquals(cart, reloaded.read(first, "cart"));
        assertTrue(reloaded.read(second, "cart").isEmpty());
        assertEquals("7", reloaded.read(first, "wishlist").get(0).asText());
        assertEquals("8", reloaded.read(second, "wishlist").get(0).asText());
        assertTrue(reloaded.read(new AccountPrincipal(1L, "ADMIN"), "cart").isEmpty());
        reloaded.save(second, "wishlist", mapper.createArrayNode());
        assertEquals(1, reloaded.read(first, "wishlist").size());
    }
    @Test void anonymousAndInvalidDataRejected() {
        assertThrows(ApiException.class, () -> service.read(null, "cart"));
        assertThrows(ApiException.class, () -> service.save(null, "cart", mapper.createArrayNode()));
        assertThrows(ApiException.class, () -> service.save(first, "cart", mapper.createObjectNode()));
        var invalid = mapper.createArrayNode().addObject().put("quantity", 0);
        assertThrows(ApiException.class, () -> service.save(first, "cart", mapper.createArrayNode().add(invalid)));
    }
}
