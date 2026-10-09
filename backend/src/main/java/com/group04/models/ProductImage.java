package com.group04.models;

import java.time.LocalDateTime;
import jakarta.persistence.*;

@Entity
@Table(name = "product_images")
public class ProductImage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_id")
    private Product product;
    @Column(name = "image_url", nullable = false, length = 1000)
    private String imageUrl;
    @Column(name = "alt_text", length = 255)
    private String altText;
    @Column(name = "display_order", nullable = false)
    private int displayOrder;
    @Column(name = "is_primary", nullable = false)
    private boolean primary;
    @Column(name = "created_at", nullable = false, insertable = false, updatable = false, columnDefinition = "datetime2(0)")
    private LocalDateTime createdAt;

    protected ProductImage() {
    }

    public ProductImage(Product p, String url, String alt, int order, boolean primary) {
        product = p;
        imageUrl = url;
        altText = alt;
        displayOrder = order;
        this.primary = primary;
    }

    public Long getId() {
        return id;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public boolean isPrimary() {
        return primary;
    }

    public void updatePosition(int order, boolean primary) {
        this.displayOrder = order;
        this.primary = primary;
    }
}

