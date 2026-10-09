package com.group04.services;

import com.group04.dao.CustomerRepository;
import com.group04.dao.ProductReviewRepository;
import com.group04.models.ProductReview;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.group04.utils.ApiException;
import com.group04.dao.ProductRepository;
import com.group04.models.AccountPrincipal;

@Service
@Transactional
public class ReviewService {
    private final ProductReviewRepository reviews;
    private final CustomerRepository customers;
    private final ProductRepository products;
    private final JdbcTemplate jdbc;

    public ReviewService(ProductReviewRepository reviews, CustomerRepository customers, ProductRepository products,
            JdbcTemplate jdbc) {
        this.reviews = reviews;
        this.customers = customers;
        this.products = products;
        this.jdbc = jdbc;
    }

    @Transactional(readOnly = true)
    public List<ReviewView> list() {
        return reviews.findAllByOrderByCreatedAtDesc().stream().map(this::view).toList();
    }

    @Transactional(readOnly = true)
    public List<ReviewView> approvedForProduct(Long productId) {
        return reviews.findApprovedByProductId(productId).stream().map(this::view)
                .toList();
    }

    public ReviewView create(AccountPrincipal principal, Long productId, int rating, String comment) {
        if (principal == null || !"CUSTOMER".equals(principal.accountType()))
            throw new ApiException(HttpStatus.FORBIDDEN, "Chá»‰ tÃ i khoáº£n khÃ¡ch hÃ ng má»›i cÃ³ thá»ƒ Ä‘Ã¡nh giÃ¡ sáº£n pháº©m");
        var customer = customers.findById(principal.id())
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "TÃ i khoáº£n khÃ´ng tá»“n táº¡i"));
        if (!products.existsById(productId))
            throw new ApiException(HttpStatus.NOT_FOUND, "KhÃ´ng tÃ¬m tháº¥y sáº£n pháº©m");
        Long purchased = jdbc.queryForObject("""
                SELECT COUNT_BIG(*)
                FROM dbo.orders o
                JOIN dbo.order_items i ON i.order_id = o.id
                WHERE o.customer_id = ? AND i.product_id = ? AND o.order_status <> 'CANCELLED'
                """, Long.class, customer.getId(), productId);
        if (purchased == null || purchased == 0)
            throw new ApiException(HttpStatus.FORBIDDEN,
                    "Báº¡n chá»‰ cÃ³ thá»ƒ Ä‘Ã¡nh giÃ¡ sáº£n pháº©m sau khi Ä‘Ã£ Ä‘áº·t mua sáº£n pháº©m nÃ y");
        return view(reviews.save(new ProductReview(customer.getId(), productId, customer.getFullName(),
                customer.getEmail(), rating, comment.trim())));
    }

    public ReviewView moderate(Long id, String status) {
        if (!List.of("APPROVED", "REJECTED").contains(status))
            throw new ApiException(HttpStatus.BAD_REQUEST, "Tráº¡ng thÃ¡i pháº£i lÃ  APPROVED hoáº·c REJECTED");
        ProductReview review = reviews.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "KhÃ´ng tÃ¬m tháº¥y Ä‘Ã¡nh giÃ¡"));
        review.moderate(status);
        return view(review);
    }

    public void delete(Long id) {
        ProductReview review = reviews.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "KhÃ´ng tÃ¬m tháº¥y Ä‘Ã¡nh giÃ¡"));
        reviews.delete(review);
    }

    private ReviewView view(ProductReview review) {
        return new ReviewView(review.getId(), review.getCustomerId(), review.getProductId(), review.getAuthorName(),
                review.getEmail(), review.getRating(), review.getComment(), review.getStatus(), review.getCreatedAt(),
                review.getModeratedAt());
    }

    public record ReviewView(Long id, Long customerId, Long productId, String authorName, String email, int rating,
            String comment, String status, LocalDateTime createdAt, LocalDateTime moderatedAt) {
    }
}

