package com.group04.dao;

import com.group04.models.*;

import java.util.*;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductImageRepository extends JpaRepository<ProductImage, Long> {
    long countByProductId(Long productId);

    Optional<ProductImage> findFirstByProductIdOrderByDisplayOrderAsc(Long productId);

    List<ProductImage> findAllByProductIdOrderByDisplayOrderAsc(Long productId);
}

