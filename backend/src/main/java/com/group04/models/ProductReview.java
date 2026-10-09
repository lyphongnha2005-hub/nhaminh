package com.group04.models;

import java.time.LocalDateTime;
import jakarta.persistence.*;

@Entity
@Table(name = "product_reviews", schema = "dbo")
public class ProductReview {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "customer_id")
    private Long customerId;
    @Column(name = "product_id")
    private Long productId;
    @Column(name = "author_name", nullable = false, length = 120)
    private String authorName;
    @Column(length = 255)
    private String email;
    @Column(nullable = false)
    private Byte rating;
    @Column(nullable = false, length = 2000)
    private String comment;
    @Column(nullable = false, length = 20)
    private String status = "APPROVED";
    @Column(name = "created_at", nullable = false, insertable = false, updatable = false, columnDefinition = "datetime2(0)")
    private LocalDateTime createdAt;
    @Column(name = "moderated_at", columnDefinition = "datetime2(0)")
    private LocalDateTime moderatedAt;

    protected ProductReview() {
    }

    public ProductReview(Long customerId, Long productId, String authorName, String email, int rating, String comment) {
        this.customerId = customerId;
        this.productId = productId;
        this.authorName = authorName;
        this.email = email;
        this.rating = (byte) rating;
        this.comment = comment;
    }

    public void moderate(String value) {
        status = value;
        moderatedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public Long getCustomerId() {
        return customerId;
    }

    public Long getProductId() {
        return productId;
    }

    public String getAuthorName() {
        return authorName;
    }

    public String getEmail() {
        return email;
    }

    public int getRating() {
        return rating;
    }

    public String getComment() {
        return comment;
    }

    public String getStatus() {
        return status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getModeratedAt() {
        return moderatedAt;
    }
}

