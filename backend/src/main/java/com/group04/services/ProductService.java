package com.group04.services;

import com.group04.dao.*;
import com.group04.models.*;

import java.math.BigDecimal;
import java.text.Normalizer;
import java.util.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;

@Service
@Transactional
public class ProductService {
    private final ProductRepository products;
    private final CategoryRepository categories;
    private final ProductImageRepository images;
    private final ProductVariantRepository variants;

    public ProductService(ProductRepository p, CategoryRepository c, ProductImageRepository i,
            ProductVariantRepository v) {
        products = p;
        categories = c;
        images = i;
        variants = v;
    }

    @Transactional(readOnly = true)
    public List<ProductView> list() {
        return products.findAllByOrderByIdDesc().stream().map(this::view).toList();
    }

    @Transactional(readOnly = true)
    public List<ProductView> listActive() {
        return products.findAllByStatusOrderByIdDesc("ACTIVE").stream().map(this::view).toList();
    }

    @Transactional(readOnly = true)
    public ProductView activeById(Long id) {
        return products.findByIdAndStatus(id, "ACTIVE").map(this::view).orElseThrow(
                () -> new com.group04.utils.ApiException(org.springframework.http.HttpStatus.NOT_FOUND,
                        "KhÃ´ng tÃ¬m tháº¥y sáº£n pháº©m"));
    }

    public ProductView create(CreateProductRequest r) {
        String categoryName = r.categoryName().trim();
        Category category = categories.findByNameIgnoreCase(categoryName)
                .orElseGet(() -> categories.save(new Category(categoryName, slug(categoryName) + "-" + shortId())));
        Product p = products.save(new Product(category, r.name().trim(), slug(r.name()) + "-" + shortId(),
                r.shortDescription().trim(), blank(r.roomSpace()), r.basePrice(), r.stockQuantity(), r.status(),
                blank(r.recycledWasteAmount())));
        saveVariants(p, "SIZE", r.sizes());
        saveVariants(p, "COLOR", r.colors());
        return view(p);
    }

    public ProductView update(Long id, CreateProductRequest r) {
        Product p = products.findById(id).orElseThrow(() -> new com.group04.utils.ApiException(
                org.springframework.http.HttpStatus.NOT_FOUND, "KhÃ´ng tÃ¬m tháº¥y sáº£n pháº©m"));
        String categoryName = r.categoryName().trim();
        Category category = categories.findByNameIgnoreCase(categoryName)
                .orElseGet(() -> categories.save(new Category(categoryName, slug(categoryName) + "-" + shortId())));
        p.update(category, r.name().trim(), r.shortDescription().trim(), blank(r.roomSpace()), r.basePrice(),
                r.stockQuantity(), r.status(), blank(r.recycledWasteAmount()));
        products.save(p);
        if (r.removedImageUrls() != null && !r.removedImageUrls().isEmpty()) {
            List<ProductImage> current = images.findAllByProductIdOrderByDisplayOrderAsc(id);
            List<ProductImage> removed = current.stream()
                    .filter(image -> r.removedImageUrls().contains(image.getImageUrl())).toList();
            images.deleteAll(removed);
            // Delete the previous primary before promoting another image: SQL Server
            // enforces a unique filtered index on the primary image per product.
            images.flush();
            List<ProductImage> remaining = current.stream().filter(image -> !removed.contains(image)).toList();
            for (int index = 0; index < remaining.size(); index++) {
                remaining.get(index).updatePosition(index, index == 0);
            }
            images.saveAll(remaining);
            images.flush();
        }
        variants.deleteAllByProductId(id);
        variants.flush();
        saveVariants(p, "SIZE", r.sizes());
        saveVariants(p, "COLOR", r.colors());
        return view(p);
    }

    public void delete(Long id) {
        Product product = products.findById(id).orElseThrow(() -> new com.group04.utils.ApiException(
                org.springframework.http.HttpStatus.NOT_FOUND, "KhÃ´ng tÃ¬m tháº¥y sáº£n pháº©m"));
        products.delete(product);
        products.flush();
    }

    private void saveVariants(Product product, String type, List<VariantRequest> requests) {
        if (requests == null)
            return;
        int index = 1;
        for (VariantRequest v : requests) {
            if (v.name() == null || v.name().isBlank())
                continue;
            String code = type.substring(0, 1) + "-" + index++ + "-" + shortId();
            String hex = "COLOR".equals(type) ? blank(v.colorHex()) : null;
            String dimensions = "SIZE".equals(type) ? blank(v.dimensions()) : null;
            variants.save(new ProductVariant(product, type, code, v.name().trim(), dimensions, hex,
                    v.priceAdjustment() == null ? BigDecimal.ZERO : v.priceAdjustment(),
                    v.stockQuantity() == null ? 0 : v.stockQuantity()));
        }
    }

    private ProductView view(Product p) {
        List<String> imageUrls = images.findAllByProductIdOrderByDisplayOrderAsc(p.getId()).stream()
                .map(ProductImage::getImageUrl).toList();
        List<VariantView> variantViews = variants.findAllByProductIdAndStatusOrderByIdAsc(p.getId(), "ACTIVE").stream()
                .map(v -> new VariantView(v.getId(), v.getVariantType(), v.getCode(), v.getName(), v.getDimensions(),
                        v.getColorHex(), v.getPriceAdjustment(), v.getStockQuantity()))
                .toList();
        return new ProductView(p.getId(), p.getName(), p.getSlug(), p.getCategory().getName(), p.getShortDescription(),
                p.getRoomSpace(), p.getBasePrice(), p.getStockQuantity(), p.getStatus(), p.getRecycledWasteAmount(),
                imageUrls.isEmpty() ? null : imageUrls.get(0), imageUrls, variantViews);
    }

    private String blank(String s) {
        return s == null || s.isBlank() ? null : s.trim();
    }

    private String shortId() {
        return UUID.randomUUID().toString().substring(0, 8);
    }

    private String slug(String value) {
        String s = Normalizer.normalize(value, Normalizer.Form.NFD);
        s = java.util.regex.Pattern.compile("\\p{M}+").matcher(s).replaceAll("")
                .replace('\u0111', 'd').replace('\u0110', 'D')
                .toLowerCase(Locale.ROOT).replaceAll("[^a-z0-9]+", "-").replaceAll("(^-|-$)", "");
        return s.isBlank() ? "san-pham" : s;
    }

    public record CreateProductRequest(@NotBlank @Size(max = 255) String name,
            @NotBlank @Size(max = 120) String categoryName, @NotBlank @Size(max = 1000) String shortDescription,
            @Size(max = 100) String roomSpace, @NotNull @DecimalMin("0") BigDecimal basePrice,
            @NotNull @Min(0) Integer stockQuantity, @NotBlank @Pattern(regexp = "DRAFT|ACTIVE|INACTIVE") String status,
            @Size(max = 255) String recycledWasteAmount, @Valid List<VariantRequest> sizes,
            @Valid List<VariantRequest> colors,
            @Size(max = 5) List<@NotBlank @Size(max = 1000) String> removedImageUrls) {
    }

    public record VariantRequest(@NotBlank @Size(max = 255) String name, @Size(max = 255) String dimensions,
            @Pattern(regexp = "^$|^#[0-9A-Fa-f]{6}$") String colorHex, @DecimalMin("0") BigDecimal priceAdjustment,
            @Min(0) Integer stockQuantity) {
    }

    public record ProductView(Long id, String name, String slug, String categoryName, String shortDescription,
            String roomSpace, BigDecimal basePrice, Integer stockQuantity, String status, String recycledWasteAmount,
            String imageUrl, List<String> imageUrls, List<VariantView> variants) {
    }

    public record VariantView(Long id, String type, String code, String name, String dimensions, String colorHex,
            BigDecimal priceAdjustment, Integer stockQuantity) {
    }
}

