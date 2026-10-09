package com.group04.models;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import jakarta.persistence.*;

@Entity
@Table(name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "category_id")
    private Category category;
    @Column(nullable = false, length = 255)
    private String name;
    @Column(nullable = false, unique = true, length = 255)
    private String slug;
    @Column(name = "short_description", nullable = false, length = 1000)
    private String shortDescription;
    @Column(name = "room_space", length = 100)
    private String roomSpace;
    @Column(name = "base_price", nullable = false, precision = 18, scale = 2)
    private BigDecimal basePrice;
    @Column(name = "stock_quantity", nullable = false)
    private Integer stockQuantity = 0;
    @Column(nullable = false, length = 20)
    private String status = "DRAFT";
    @Column(name = "is_featured", nullable = false)
    private boolean featured = false;
    @Column(name = "is_popular", nullable = false)
    private boolean popular = false;
    @Column(name = "recycled_waste_amount", length = 255)
    private String recycledWasteAmount;
    @Column(name = "created_at", nullable = false, insertable = false, updatable = false, columnDefinition = "datetime2(0)")
    private LocalDateTime createdAt;
    @Column(name = "updated_at", nullable = false, columnDefinition = "datetime2(0)")
    private LocalDateTime updatedAt = LocalDateTime.now();

    protected Product() {
    }

    public Product(Category category, String name, String slug, String description, String roomSpace, BigDecimal price,
            Integer stock, String status, String recycled) {
        this.category = category;
        this.name = name;
        this.slug = slug;
        this.shortDescription = description;
        this.roomSpace = roomSpace;
        this.basePrice = price;
        this.stockQuantity = stock;
        this.status = status;
        this.recycledWasteAmount = recycled;
    }

    public void update(Category category, String name, String description, String roomSpace, BigDecimal price,
            Integer stock, String status, String recycled) {
        this.category = category;
        this.name = name;
        this.shortDescription = description;
        this.roomSpace = roomSpace;
        this.basePrice = price;
        this.stockQuantity = stock;
        this.status = status;
        this.recycledWasteAmount = recycled;
    }

    @PreUpdate
    void touch() {
        updatedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public Category getCategory() {
        return category;
    }

    public String getName() {
        return name;
    }

    public String getSlug() {
        return slug;
    }

    public String getShortDescription() {
        return shortDescription;
    }

    public String getRoomSpace() {
        return roomSpace;
    }

    public BigDecimal getBasePrice() {
        return basePrice;
    }

    public Integer getStockQuantity() {
        return stockQuantity;
    }

    public String getStatus() {
        return status;
    }

    public String getRecycledWasteAmount() {
        return recycledWasteAmount;
    }
}

