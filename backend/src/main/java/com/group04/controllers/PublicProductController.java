package com.group04.controllers;

import java.util.List;
import org.springframework.web.bind.annotation.*;
import com.group04.services.ProductService;
import com.group04.services.ProductService.ProductView;

@RestController
@RequestMapping("/api/products")
public class PublicProductController {
    private final ProductService service;

    public PublicProductController(ProductService s) {
        service = s;
    }

    @GetMapping
    public List<ProductView> list() {
        return service.listActive();
    }

    @GetMapping("/{id}")
    public ProductView detail(@PathVariable Long id) {
        return service.activeById(id);
    }
}

