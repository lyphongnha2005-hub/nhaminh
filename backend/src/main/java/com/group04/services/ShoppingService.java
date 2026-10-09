package com.group04.services;

import java.util.List;
import jakarta.annotation.PostConstruct;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.group04.models.AccountPrincipal;
import com.group04.utils.ApiException;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.*;

@Service
public class ShoppingService {
    private final JdbcTemplate jdbc;
    private final ObjectMapper mapper;
    public ShoppingService(JdbcTemplate jdbc, ObjectMapper mapper) { this.jdbc = jdbc; this.mapper = mapper; }
    @PostConstruct public void initialize() {
        jdbc.execute("""
            IF OBJECT_ID(N'dbo.account_collections', N'U') IS NULL
            CREATE TABLE dbo.account_collections (
                account_type VARCHAR(10) NOT NULL,
                account_id BIGINT NOT NULL,
                kind VARCHAR(10) NOT NULL,
                payload NVARCHAR(MAX) NOT NULL,
                PRIMARY KEY(account_type, account_id, kind)
            )
            """);
    }
    private void authorize(AccountPrincipal account) {
        if (account == null) throw new ApiException(HttpStatus.UNAUTHORIZED, "Vui lòng đăng nhập");
    }
    public JsonNode read(AccountPrincipal account, String kind) {
        authorize(account);
        var values = jdbc.queryForList("SELECT payload FROM dbo.account_collections WHERE account_type = ? AND account_id = ? AND kind = ?",
                String.class, account.accountType(), account.id(), kind);
        try { return values.isEmpty() ? mapper.createArrayNode() : mapper.readTree(values.get(0)); }
        catch (Exception e) { throw new IllegalStateException("Unable to read shopping data", e); }
    }
    @Transactional(isolation = Isolation.SERIALIZABLE)
    public JsonNode save(AccountPrincipal account, String kind, JsonNode items) {
        authorize(account);
        if (!List.of("cart", "wishlist").contains(kind) || !items.isArray() || items.size() > 100 || items.toString().length() > 200000)
            throw new ApiException(HttpStatus.BAD_REQUEST, "Danh sách không hợp lệ hoặc vượt quá 100 sản phẩm");
        for (var item : items) {
            if (kind.equals("wishlist")) {
                if (!item.isTextual() || !item.asText().matches("[0-9]{1,19}")) invalid();
            } else {
                if (!item.isObject() || !item.path("productId").asText().matches("[0-9]{1,19}")
                        || !item.path("quantity").isIntegralNumber() || !item.path("quantity").canConvertToInt()
                        || item.path("quantity").asInt() < 1 || item.path("quantity").asInt() > 999
                        || !item.path("unitPrice").isNumber() || item.path("unitPrice").asDouble() < 0) invalid();
                for (String field : List.of("cartItemId", "name", "image", "size", "waxTone", "fitting", "recycledWasteAmount")) {
                    if (!item.path(field).isTextual() || item.path(field).asText().length() > 2000) invalid();
                }
            }
        }
        int updated = jdbc.update("UPDATE dbo.account_collections SET payload = ? WHERE account_type = ? AND account_id = ? AND kind = ?",
                items.toString(), account.accountType(), account.id(), kind);
        if (updated == 0) jdbc.update("INSERT INTO dbo.account_collections (account_type, account_id, kind, payload) VALUES (?, ?, ?, ?)",
                account.accountType(), account.id(), kind, items.toString());
        return items;
    }
    private void invalid() { throw new ApiException(HttpStatus.BAD_REQUEST, "Dữ liệu sản phẩm trong danh sách không hợp lệ"); }
}
