package com.group04.services;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import com.group04.dao.*;
import com.group04.models.*;
import org.junit.jupiter.api.Test;

class ProductImageRemovalTest {
    private final ProductRepository products = mock(ProductRepository.class);
    private final CategoryRepository categories = mock(CategoryRepository.class);
    private final ProductImageRepository images = mock(ProductImageRepository.class);
    private final ProductVariantRepository variants = mock(ProductVariantRepository.class);
    private final ProductService service = new ProductService(products, categories, images, variants);

    private Product setup() {
        Product product = mock(Product.class);
        Category category = new Category("Decor", "decor");
        when(products.findById(7L)).thenReturn(Optional.of(product));
        when(product.getId()).thenReturn(7L);
        when(product.getCategory()).thenReturn(category);
        when(categories.findByNameIgnoreCase("Decor")).thenReturn(Optional.of(category));
        return product;
    }

    private ProductService.CreateProductRequest request(List<String> removed) {
        return new ProductService.CreateProductRequest("Product", "Decor", "Description", "Room",
                BigDecimal.TEN, 1, "ACTIVE", "1kg", List.of(), List.of(), removed);
    }

    @Test
    void removesSelectedImageAndPromotesRemainingImage() {
        Product product = setup();
        ProductImage first = new ProductImage(product, "/first.png", "", 0, true);
        ProductImage second = spy(new ProductImage(product, "/second.png", "", 1, false));
        when(images.findAllByProductIdOrderByDisplayOrderAsc(7L))
                .thenReturn(List.of(first, second))
                .thenReturn(List.of(second));
        var result = service.update(7L, request(List.of("/first.png")));
        verify(images).deleteAll(List.of(first));
        verify(images).saveAll(List.of(second));
        var order = inOrder(images, second);
        order.verify(images).deleteAll(List.of(first));
        order.verify(images).flush();
        order.verify(second).updatePosition(0, true);
        order.verify(images).saveAll(List.of(second));
        assertTrue(second.isPrimary());
        assertEquals("/second.png", result.imageUrl());
    }

    @Test
    void canRemoveAllImages() {
        Product product = setup();
        ProductImage first = new ProductImage(product, "/first.png", "", 0, true);
        when(images.findAllByProductIdOrderByDisplayOrderAsc(7L))
                .thenReturn(List.of(first))
                .thenReturn(List.of());
        var result = service.update(7L, request(List.of("/first.png")));
        verify(images).deleteAll(List.of(first));
        assertNull(result.imageUrl());
        assertTrue(result.imageUrls().isEmpty());
    }

    @Test
    void cannotRemoveAnotherProductsImage() {
        Product product = setup();
        ProductImage first = new ProductImage(product, "/first.png", "", 0, true);
        when(images.findAllByProductIdOrderByDisplayOrderAsc(7L)).thenReturn(List.of(first));
        service.update(7L, request(List.of("/other-product.png")));
        verify(images).deleteAll(List.of());
        verify(images).saveAll(List.of(first));
    }

    @Test
    void omittedRemovalListPreservesImages() {
        setup();
        service.update(7L, request(null));
        verify(images, never()).deleteAll(anyList());
    }
}
