package com.group04.services;

import com.group04.dao.*;
import com.group04.models.*;

import java.io.*;
import java.nio.file.*;
import java.util.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import com.group04.utils.ApiException;

@Service
public class ProductImageService {
    private static final Set<String> TYPES = Set.of("image/jpeg", "image/png", "image/webp");
    private static final long MAX = 5 * 1024 * 1024;
    private final ProductRepository products;
    private final ProductImageRepository images;
    private final Path root = Path.of("uploads", "products").toAbsolutePath().normalize();

    public ProductImageService(ProductRepository p, ProductImageRepository i) {
        products = p;
        images = i;
    }

    @Transactional
    public List<ImageView> upload(Long productId, List<MultipartFile> files) {
        Product product = products.findById(productId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "KhÃ´ng tÃ¬m tháº¥y sáº£n pháº©m"));
        if (files == null || files.isEmpty() || files.size() > 5)
            throw new ApiException(HttpStatus.BAD_REQUEST, "HÃ£y chá»n tá»« 1 Ä‘áº¿n 5 áº£nh");
        long existing = images.countByProductId(productId);
        if (existing + files.size() > 5)
            throw new ApiException(HttpStatus.BAD_REQUEST, "Chỉ được lưu tối đa 5 ảnh cho mỗi sản phẩm");
        List<ImageView> result = new ArrayList<>();
        try {
            Files.createDirectories(root);
            for (int i = 0; i < files.size(); i++) {
                MultipartFile file = files.get(i);
                if (file.isEmpty() || file.getSize() > MAX || !TYPES.contains(file.getContentType()))
                    throw new ApiException(HttpStatus.BAD_REQUEST,
                            "áº¢nh pháº£i lÃ  JPG, PNG hoáº·c WEBP vÃ  khÃ´ng vÆ°á»£t quÃ¡ 5MB");
                String ext = switch (file.getContentType()) {
                    case "image/png" -> ".png";
                    case "image/webp" -> ".webp";
                    default -> ".jpg";
                };
                String name = UUID.randomUUID() + ext;
                Path target = root.resolve(name).normalize();
                if (!target.startsWith(root))
                    throw new ApiException(HttpStatus.BAD_REQUEST, "TÃªn file khÃ´ng há»£p lá»‡");
                try (InputStream input = file.getInputStream()) {
                    Files.copy(input, target, StandardCopyOption.REPLACE_EXISTING);
                }
                String url = "/uploads/products/" + name;
                ProductImage saved = images.save(
                        new ProductImage(product, url, product.getName(), (int) existing + i, existing == 0 && i == 0));
                result.add(new ImageView(saved.getId(), saved.getImageUrl(), saved.isPrimary()));
            }
            return result;
        } catch (IOException e) {
            throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "KhÃ´ng thá»ƒ lÆ°u áº£nh sáº£n pháº©m");
        }
    }

    public record ImageView(Long id, String imageUrl, boolean primary) {
    }
}

