package com.group04.controllers;

import java.util.List;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import com.group04.models.AccountPrincipal;
import com.group04.services.ReviewService;

@RestController
@RequestMapping("/api/products/{productId}/reviews")
public class ReviewController {
    private final ReviewService reviews;

    public ReviewController(ReviewService reviews) {
        this.reviews = reviews;
    }

    @GetMapping
    public List<ReviewService.ReviewView> list(@PathVariable Long productId) {
        return reviews.approvedForProduct(productId);
    }

    @PostMapping
    public ReviewService.ReviewView create(@AuthenticationPrincipal AccountPrincipal principal,
            @PathVariable Long productId, @Valid @RequestBody CreateReviewRequest request) {
        return reviews.create(principal, productId, request.rating(), request.comment());
    }

    public record CreateReviewRequest(@Min(1) @Max(5) int rating, @NotBlank @Size(max = 2000) String comment) {
    }
}

