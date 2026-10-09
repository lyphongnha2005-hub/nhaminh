package com.group04.services;

import static com.group04.controllers.OrderController.*;
import java.math.BigDecimal;
import java.time.*;
import java.time.format.DateTimeFormatter;
import java.util.concurrent.ThreadLocalRandom;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.group04.services.AuthService;
import com.group04.utils.ApiException;
import com.group04.models.AccountPrincipal;
import com.group04.models.Customer;

@Service
public class OrderService {
    private final JdbcTemplate jdbc;
    private final AuthService auth;

    public OrderService(JdbcTemplate jdbc, AuthService auth) {
        this.jdbc = jdbc;
        this.auth = auth;
    }

    @Transactional
    public OrderCreated create(AccountPrincipal principal, CreateOrderRequest request) {
        if (principal == null || !(auth.get(principal) instanceof Customer customer))
            throw new ApiException(HttpStatus.FORBIDDEN, "Chá»‰ khÃ¡ch hÃ ng má»›i cÃ³ thá»ƒ Ä‘áº·t hÃ ng");
        BigDecimal subtotal = request.items().stream()
                .map(item -> item.unitPrice().multiply(BigDecimal.valueOf(item.quantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal shippingFee = subtotal.compareTo(BigDecimal.valueOf(500000)) >= 0
                ? BigDecimal.ZERO : BigDecimal.valueOf(30000);
        BigDecimal total = subtotal.add(shippingFee);
        String code = "NM" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyMMddHHmmss"))
                + ThreadLocalRandom.current().nextInt(10, 100);
        // Reserve stock atomically. The transaction rolls every change back when
        // any product is missing or does not have enough inventory.
        for (OrderItemRequest item : request.items()) {
            int changed = jdbc.update("""
                    UPDATE dbo.products
                    SET stock_quantity=stock_quantity-?, updated_at=SYSUTCDATETIME()
                    WHERE id=? AND status='ACTIVE' AND stock_quantity>=?
                    """, item.quantity(), item.productId(), item.quantity());
            if (changed == 0) {
                throw new ApiException(HttpStatus.CONFLICT,
                        "Sản phẩm '" + item.productName() + "' không còn đủ số lượng trong kho");
            }
        }
        Number id = jdbc.queryForObject("""
                INSERT INTO dbo.orders(order_code,customer_id,customer_name,customer_phone,customer_email,
                  shipping_address,note,subtotal,shipping_fee,total_amount,payment_method,payment_status,order_status)
                OUTPUT INSERTED.id
                VALUES(?,?,?,?,?,?,?,?,?,?,?,'UNPAID','PENDING')
                """, Number.class, code, customer.getId(), request.customerName().trim(), request.customerPhone().trim(),
                customer.getEmail(), request.shippingAddress().trim(), blank(request.note()), subtotal, shippingFee,
                total, request.paymentMethod());
        if (id == null) throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "KhÃ´ng thá»ƒ táº¡o mÃ£ Ä‘Æ¡n hÃ ng");
        for (OrderItemRequest item : request.items()) {
            jdbc.update("""
                    INSERT INTO dbo.order_items(order_id,product_id,product_name,product_image_url,
                      selected_variants,unit_price,quantity) VALUES(?,?,?,?,?,?,?)
                    """, id.longValue(), item.productId(), item.productName(), blank(item.productImageUrl()),
                    blank(item.selectedVariants()), item.unitPrice(), item.quantity());
        }
        return new OrderCreated(id.longValue(), code, total, "PENDING", LocalDateTime.now());
    }

    private String blank(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }

    public record OrderCreated(long id, String orderCode, BigDecimal totalAmount, String status,
            LocalDateTime createdAt) {
    }
}

