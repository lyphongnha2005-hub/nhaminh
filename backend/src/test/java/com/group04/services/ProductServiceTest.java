package com.group04.services;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import java.math.BigDecimal;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import com.group04.utils.ApiException;
import com.group04.dao.*;
import com.group04.models.*;

class ProductServiceTest {
 private final ProductRepository products=mock(ProductRepository.class);
 private final CategoryRepository categories=mock(CategoryRepository.class);
 private final ProductImageRepository images=mock(ProductImageRepository.class);
 private final ProductVariantRepository variants=mock(ProductVariantRepository.class);
 private final ProductService service=new ProductService(products,categories,images,variants);

 @Test void deleteExistingProduct(){Category category=new Category("Decor","decor");Product product=new Product(category,"ÄÃ¨n giáº¥y","den-giay","MÃ´ táº£","PhÃ²ng khÃ¡ch",BigDecimal.valueOf(100000),3,"ACTIVE","1 kg");when(products.findById(7L)).thenReturn(Optional.of(product));service.delete(7L);verify(products).delete(product);verify(products).flush();}

 @Test void deleteMissingProductReturnsNotFound(){when(products.findById(99L)).thenReturn(Optional.empty());ApiException error=assertThrows(ApiException.class,()->service.delete(99L));assertEquals(HttpStatus.NOT_FOUND,error.status());verify(products,never()).delete(any());}
}

