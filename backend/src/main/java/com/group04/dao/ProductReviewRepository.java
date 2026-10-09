package com.group04.dao;

import com.group04.models.*;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProductReviewRepository extends JpaRepository<ProductReview, Long> {
    List<ProductReview> findAllByOrderByCreatedAtDesc();

    @Query(value = "SELECT * FROM dbo.product_reviews WHERE product_id = :productId AND status <> 'REJECTED' ORDER BY created_at DESC", nativeQuery = true)
    List<ProductReview> findApprovedByProductId(@Param("productId") Long productId);
}

