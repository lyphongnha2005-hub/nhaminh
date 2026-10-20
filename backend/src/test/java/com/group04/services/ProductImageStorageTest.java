package com.group04.services;

import com.group04.dao.ProductImageRepository;
import com.group04.dao.ProductRepository;
import com.group04.models.Product;
import com.group04.models.ProductImage;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.mock.web.MockMultipartFile;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class ProductImageStorageTest {
    @TempDir Path persistentDisk;

    @Test void uploadsUseConfiguredDiskAndKeepPublicRelativeUrls() throws Exception {
        var products = mock(ProductRepository.class);
        var images = mock(ProductImageRepository.class);
        var product = mock(Product.class);
        when(products.findById(1L)).thenReturn(Optional.of(product));
        when(images.save(any(ProductImage.class))).thenAnswer(call -> call.getArgument(0));
        var service = new ProductImageService(products, images, persistentDisk.toString());
        byte[] bytes = new byte[]{1, 2, 3};
        var result = service.upload(1L, List.of(new MockMultipartFile("files", "photo.png", "image/png", bytes)));
        String url = result.get(0).imageUrl();
        assertTrue(url.startsWith("/uploads/products/"));
        Path stored = persistentDisk.resolve("products").resolve(Path.of(url).getFileName());
        assertArrayEquals(bytes, Files.readAllBytes(stored));
    }
}
