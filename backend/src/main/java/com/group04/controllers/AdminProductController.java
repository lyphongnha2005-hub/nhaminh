package com.group04.controllers;

import java.util.List;
import jakarta.validation.Valid;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.group04.services.ProductService;
import com.group04.services.ProductImageService;
import com.group04.services.ProductService.*;
import com.group04.services.ProductImageService.ImageView;

@RestController
@RequestMapping("/api/admin/products")
public class AdminProductController {
    private final ProductService service;
    private final ProductImageService imageService;

    public AdminProductController(ProductService s, ProductImageService i) {
        service = s;
        imageService = i;
    }

    @GetMapping
    public List<ProductView> list() {
        return service.list();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProductView create(@Valid @RequestBody CreateProductRequest request) {
        return service.create(request);
    }

    @PutMapping("/{id}")
    public ProductView update(@PathVariable Long id, @Valid @RequestBody CreateProductRequest request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }

    @PostMapping(value = "/{id}/images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public List<ImageView> images(@PathVariable Long id, @RequestPart("files") List<MultipartFile> files) {
        return imageService.upload(id, files);
    }
}

