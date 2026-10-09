package com.group04.models;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import jakarta.persistence.*;

@Entity
@Table(name = "product_variants")
public class ProductVariant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_id")
    private Product product;
    @Column(name = "variant_type", nullable = false, length = 20)
    private String variantType;
    @Column(nullable = false, length = 100)
    private String code;
    @Column(nullable = false, length = 255)
    private String name;
    @Column(length = 255)
    private String dimensions;
    @Column(name = "color_hex", length = 7, columnDefinition = "char(7)")
    private String colorHex;
    @Column(name = "price_adjustment", nullable = false, precision = 18, scale = 2)
    private BigDecimal priceAdjustment = BigDecimal.ZERO;
    @Column(name = "stock_quantity", nullable = false)
    private Integer stockQuantity = 0;
    @Column(nullable = false, length = 20)
    private String status = "ACTIVE";
    @Column(name = "created_at", nullable = false, insertable = false, updatable = false, columnDefinition = "datetime2(0)")
    private LocalDateTime createdAt;
    @Column(name = "updated_at", nullable = false, columnDefinition = "datetime2(0)")
    private LocalDateTime updatedAt = LocalDateTime.now();

    protected ProductVariant() {
    }

    public ProductVariant(Product p, String type, String code, String name, String dimensions, String colorHex,
            BigDecimal adjustment, Integer stock) {
        product = p;
        variantType = type;
        this.code = code;
        this.name = name;
        this.dimensions = dimensions;
        this.colorHex = colorHex;
        priceAdjustment = adjustment;
        stockQuantity = stock;
    }

    @PreUpdate
    void touch() {
        updatedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public String getVariantType() {
        return variantType;
    }

    public String getCode() {
        return code;
    }

    public String getName() {
        return name;
    }

    public String getDimensions() {
        return dimensions;
    }

    public String getColorHex() {
        return colorHex;
    }

    public BigDecimal getPriceAdjustment() {
        return priceAdjustment;
    }

    public Integer getStockQuantity() {
        return stockQuantity;
    }
}

