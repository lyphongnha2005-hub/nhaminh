package com.group04.models;

import java.time.LocalDateTime;
import jakarta.persistence.*;

@Entity
@Table(name = "categories")
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, unique = true, length = 120)
    private String name;
    @Column(nullable = false, unique = true, length = 160)
    private String slug;
    @Column(length = 1000)
    private String description;
    @Column(nullable = false, length = 20)
    private String status = "ACTIVE";
    @Column(name = "created_at", nullable = false, insertable = false, updatable = false, columnDefinition = "datetime2(0)")
    private LocalDateTime createdAt;
    @Column(name = "updated_at", nullable = false, columnDefinition = "datetime2(0)")
    private LocalDateTime updatedAt = LocalDateTime.now();

    protected Category() {
    }

    public Category(String name, String slug) {
        this.name = name;
        this.slug = slug;
    }

    @PreUpdate
    void touch() {
        updatedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }
}

