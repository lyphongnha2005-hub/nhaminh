package com.group04.models;

import java.time.LocalDateTime;
import jakarta.persistence.*;

@MappedSuperclass
public abstract class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "role_id")
    private Role role;
    @Column(name = "full_name", nullable = false, length = 120)
    private String fullName;
    @Column(nullable = false, unique = true, length = 255)
    private String email;
    @Column(unique = true, length = 20)
    private String phone;
    @Column(name = "password_hash", nullable = false, length = 100)
    private String passwordHash;
    @Column(nullable = false, length = 20)
    private String status = "ACTIVE";
    @Column(name = "created_at", nullable = false, insertable = false, updatable = false, columnDefinition = "datetime2(0)")
    private LocalDateTime createdAt;
    @Column(name = "updated_at", nullable = false, columnDefinition = "datetime2(0)")
    private LocalDateTime updatedAt;

    protected Account() {
    }

    protected Account(Role role, String fullName, String email, String phone, String hash) {
        this.role = role;
        this.fullName = fullName;
        this.email = email;
        this.phone = phone;
        this.passwordHash = hash;
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    void touch() {
        updatedAt = LocalDateTime.now();
    }

    public abstract String getAccountType();

    public Long getId() {
        return id;
    }

    public Role getRole() {
        return role;
    }

    public String getFullName() {
        return fullName;
    }

    public String getEmail() {
        return email;
    }

    public String getPhone() {
        return phone;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public String getStatus() {
        return status;
    }

    public void setFullName(String v) {
        fullName = v;
    }

    public void setPhone(String v) {
        phone = v;
    }

    public void setPasswordHash(String v) {
        passwordHash = v;
    }

    public void setStatus(String v) {
        status = v;
    }
}

