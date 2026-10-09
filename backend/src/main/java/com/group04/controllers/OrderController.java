package com.group04.controllers;

import java.math.BigDecimal;
import java.util.List;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import com.group04.models.AccountPrincipal;
import com.group04.services.OrderService;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    private final OrderService orders;

    public OrderController(OrderService orders) {
        this.orders = orders;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public OrderService.OrderCreated create(@AuthenticationPrincipal AccountPrincipal principal,
            @Valid @RequestBody CreateOrderRequest request) {
        return orders.create(principal, request);
    }

    public record CreateOrderRequest(
            @NotBlank @Size(max = 120) String customerName,
            @NotBlank @Size(max = 20) String customerPhone,
            @NotBlank @Size(max = 500) String shippingAddress,
            @Size(max = 1000) String note,
            @NotBlank @Pattern(regexp = "COD|VIETQR|MOMO|ZALOPAY") String paymentMethod,
            @NotEmpty List<@Valid OrderItemRequest> items) {
    }

    public record OrderItemRequest(@NotNull Long productId, @NotBlank @Size(max = 255) String productName,
            @Size(max = 1000) String productImageUrl, @Size(max = 2000) String selectedVariants,
            @NotNull @DecimalMin("0") BigDecimal unitPrice, @Min(1) int quantity) {
    }
}

