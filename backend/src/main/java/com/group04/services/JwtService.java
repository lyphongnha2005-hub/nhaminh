package com.group04.services;

import java.nio.charset.StandardCharsets;
import java.time.*;
import java.util.*;
import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import com.group04.models.Account;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {
    private final SecretKey key;
    private final long expirationMs;

    public JwtService(@Value("${app.jwt.secret}") String secret, @Value("${app.jwt.expiration-ms}") long expirationMs) {
        if (secret == null || secret.getBytes(StandardCharsets.UTF_8).length < 32)
            throw new IllegalStateException("JWT_SECRET pháº£i cÃ³ Ã­t nháº¥t 32 byte");
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expirationMs = expirationMs;
    }

    public Token issue(Account u) {
        Instant now = Instant.now(), expiry = now.plusMillis(expirationMs);
        String value = Jwts.builder().subject(u.getId().toString()).claim("email", u.getEmail())
                .claim("role", u.getRole().getName()).claim("accountType", u.getAccountType()).issuedAt(Date.from(now))
                .expiration(Date.from(expiry)).signWith(key).compact();
        return new Token(value, expiry);
    }

    public Claims parse(String token) {
        return Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload();
    }

    public record Token(String value, Instant expiresAt) {
    }
}

