package com.group04.dao;

import com.group04.models.*;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductVariantRepository extends JpaRepository<ProductVariant, Long> {
    List<ProductVariant> findAllByProductIdAndStatusOrderByIdAsc(Long productId, String status);

    void deleteAllByProductId(Long productId);
}

