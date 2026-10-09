package com.group04.services;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import jakarta.annotation.PostConstruct;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import com.group04.utils.ApiException;

@Service
public class MessageService {
    private final JdbcTemplate jdbc;
    public MessageService(JdbcTemplate jdbc) { this.jdbc = jdbc; }

    @PostConstruct
    public void initialize() {
        jdbc.execute("""
            IF OBJECT_ID(N'dbo.community_messages', N'U') IS NULL
            CREATE TABLE dbo.community_messages (
                id VARCHAR(36) NOT NULL PRIMARY KEY,
                text NVARCHAR(500) NOT NULL,
                status VARCHAR(10) NOT NULL DEFAULT 'VISIBLE'
                    CHECK (status IN ('VISIBLE', 'HIDDEN')),
                created_at VARCHAR(30) NOT NULL
            )
            """);
    }

    public List<MessageView> list(boolean admin) {
        return jdbc.query("SELECT id, text, status, created_at FROM dbo.community_messages "
                + (admin ? "" : "WHERE status = 'VISIBLE' ") + "ORDER BY created_at DESC, id",
                (rs, row) -> new MessageView(rs.getString("id"), rs.getString("text"),
                        rs.getString("status"), rs.getString("created_at")));
    }

    public MessageView create(String text) {
        if (text == null || text.isBlank() || text.length() > 500)
            throw new ApiException(HttpStatus.BAD_REQUEST, "Thông điệp phải có từ 1 đến 500 ký tự");
        var message = new MessageView(UUID.randomUUID().toString(), text.trim(), "VISIBLE", Instant.now().toString());
        jdbc.update("INSERT INTO dbo.community_messages (id, text, status, created_at) VALUES (?, ?, ?, ?)",
                message.id(), message.text(), message.status(), message.createdAt());
        return message;
    }

    public void moderate(String id, String status) {
        if (!List.of("VISIBLE", "HIDDEN").contains(status == null ? "" : status))
            throw new ApiException(HttpStatus.BAD_REQUEST, "Trạng thái không hợp lệ");
        check(jdbc.update("UPDATE dbo.community_messages SET status = ? WHERE id = ?", status, id));
    }

    public void delete(String id) {
        check(jdbc.update("DELETE FROM dbo.community_messages WHERE id = ?", id));
    }

    private void check(int affected) {
        if (affected == 0) throw new ApiException(HttpStatus.NOT_FOUND, "Thông điệp không còn tồn tại");
    }

    public record MessageView(String id, String text, String status, String createdAt) {}
}
