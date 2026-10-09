package com.group04.controllers;

import java.util.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;
import com.group04.models.AuthDtos.UserView;
import com.group04.services.AuthService;
import com.group04.utils.ApiException;
import com.group04.dao.CustomerRepository;
import com.group04.models.Customer;
import com.group04.services.ReviewService;
import com.group04.services.DashboardService;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    private final CustomerRepository customers;
    private final DashboardService dashboard;
    private final ReviewService reviews;

    public AdminController(CustomerRepository c, DashboardService d, ReviewService r) {
        customers = c;
        dashboard = d;
        reviews = r;
    }

    @GetMapping("/dashboard")
    DashboardService.DashboardStats dashboard() {
        return dashboard.stats();
    }

    @GetMapping("/green-members")
    List<DashboardService.GreenMember> greenMembers() {
        return dashboard.greenMembers();
    }

    @GetMapping("/order-notifications")
    List<DashboardService.OrderNotification> orderNotifications() {
        return dashboard.recentOrders();
    }

    @PatchMapping("/orders/{id}/confirm")
    DashboardService.OrderNotification confirmOrder(@PathVariable long id) {
        return dashboard.confirmOrder(id);
    }

    @PatchMapping("/orders/{id}/cancel")
    DashboardService.OrderNotification cancelOrder(@PathVariable long id) {
        return dashboard.cancelOrder(id);
    }

    @DeleteMapping("/orders/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    void deleteOrder(@PathVariable long id) {
        dashboard.deleteOrder(id);
    }

    @GetMapping("/customers")
    List<UserView> customers() {
        return customers.findAllByOrderByIdDesc().stream().map(AuthService::view).toList();
    }

    @PatchMapping("/customers/{id}/status")
    @Transactional
    UserView status(@PathVariable Long id, @Valid @RequestBody StatusRequest r) {
        Customer customer = customers.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "KhÃ´ng tÃ¬m tháº¥y customer"));
        customer.setStatus(r.status());
        return AuthService.view(customer);
    }

    public record StatusRequest(
            @NotBlank @Pattern(regexp = "ACTIVE|LOCKED", message = "Tráº¡ng thÃ¡i pháº£i lÃ  ACTIVE hoáº·c LOCKED") String status) {
    }

    @GetMapping("/reviews")
    List<ReviewService.ReviewView> reviews() {
        return reviews.list();
    }

    @PatchMapping("/reviews/{id}/status")
    ReviewService.ReviewView reviewStatus(@PathVariable Long id, @RequestBody ReviewStatusRequest r) {
        return reviews.moderate(id, r.status());
    }

    @DeleteMapping("/reviews/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    void deleteReview(@PathVariable Long id) {
        reviews.delete(id);
    }

    public record ReviewStatusRequest(String status) {
    }
}

