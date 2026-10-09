package com.group04.dao;

import com.group04.models.*;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findAllByOrderByIdDesc();

    List<Product> findAllByStatusOrderByIdDesc(String status);

    Optional<Product> findByIdAndStatus(Long id, String status);
}

