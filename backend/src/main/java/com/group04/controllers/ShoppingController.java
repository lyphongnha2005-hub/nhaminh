package com.group04.controllers;

import java.util.Map;
import com.fasterxml.jackson.databind.JsonNode;
import com.group04.models.AccountPrincipal;
import com.group04.services.ShoppingService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile/shopping")
@PreAuthorize("isAuthenticated()")
public class ShoppingController {
    private final ShoppingService service;
    public ShoppingController(ShoppingService service) { this.service = service; }
    @GetMapping public Map<String, JsonNode> get(@AuthenticationPrincipal AccountPrincipal account) {
        return Map.of("cart", service.read(account, "cart"), "wishlist", service.read(account, "wishlist"));
    }
    @PutMapping("/{kind:cart|wishlist}") public JsonNode save(@AuthenticationPrincipal AccountPrincipal account,
            @PathVariable String kind, @RequestBody JsonNode items) { return service.save(account, kind, items); }
}
