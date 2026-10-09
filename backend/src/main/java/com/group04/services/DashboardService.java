package com.group04.services;

import java.math.*;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.http.HttpStatus;
import com.group04.utils.ApiException;

@Service
@Transactional(readOnly = true)
public class DashboardService {
    private final JdbcTemplate jdbc;

    public DashboardService(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    public DashboardStats stats() {
        long active = value("SELECT COUNT_BIG(*) FROM dbo.products WHERE status='ACTIVE'").longValue();
        long low = value(
                "SELECT COUNT_BIG(*) FROM dbo.products WHERE status='ACTIVE' AND stock_quantity BETWEEN 0 AND 3")
                .longValue();
        long newThisMonth = value(
                "SELECT COUNT_BIG(*) FROM dbo.products WHERE created_at>=DATEFROMPARTS(YEAR(GETUTCDATE()),MONTH(GETUTCDATE()),1)")
                .longValue();
        BigDecimal carton = decimal(
                "SELECT COALESCE(SUM(TRY_CONVERT(DECIMAL(18,2),REPLACE(REPLACE(LOWER(recycled_waste_amount),'kg',''),' ',''))),0) FROM dbo.products WHERE status='ACTIVE'");
        BigDecimal revenue = decimal(
                "SELECT COALESCE(SUM(total_amount),0) FROM dbo.orders WHERE order_status='COMPLETED' AND created_at>=DATEFROMPARTS(YEAR(GETUTCDATE()),MONTH(GETUTCDATE()),1)");
        BigDecimal previous = decimal(
                "SELECT COALESCE(SUM(total_amount),0) FROM dbo.orders WHERE order_status='COMPLETED' AND created_at>=DATEADD(MONTH,-1,DATEFROMPARTS(YEAR(GETUTCDATE()),MONTH(GETUTCDATE()),1)) AND created_at<DATEFROMPARTS(YEAR(GETUTCDATE()),MONTH(GETUTCDATE()),1)");
        BigDecimal growth = previous.signum() == 0 ? null
                : revenue.subtract(previous).multiply(BigDecimal.valueOf(100)).divide(previous, 1,
                        RoundingMode.HALF_UP);
        long trees = carton.divide(BigDecimal.valueOf(59), 0, RoundingMode.HALF_UP).longValue();
        return new DashboardStats(active, low, newThisMonth, carton, trees, revenue, growth);
    }

    public List<GreenMember> greenMembers() {
        return jdbc.query("""
                SELECT c.id, c.full_name, c.email, c.phone,
                       COUNT_BIG(o.id) AS total_orders,
                       COALESCE(SUM(items.total_items), 0) AS total_items,
                       COALESCE(SUM(o.total_amount), 0) AS total_spent,
                       MAX(o.created_at) AS last_order_at
                FROM dbo.customers c
                JOIN dbo.orders o ON o.customer_id = c.id AND o.order_status <> 'CANCELLED'
                LEFT JOIN (
                    SELECT order_id, SUM(quantity) AS total_items
                    FROM dbo.order_items
                    GROUP BY order_id
                ) items ON items.order_id = o.id
                GROUP BY c.id, c.full_name, c.email, c.phone
                ORDER BY total_items DESC, total_spent DESC, total_orders DESC
                """, (rs, row) -> new GreenMember(
                        rs.getLong("id"), rs.getString("full_name"), rs.getString("email"),
                        rs.getString("phone"), rs.getLong("total_orders"), rs.getLong("total_items"),
                        rs.getBigDecimal("total_spent"), rs.getTimestamp("last_order_at").toLocalDateTime()));
    }

    public List<OrderNotification> recentOrders() {
        return jdbc.query("""
                SELECT TOP (20) id, order_code, customer_name, total_amount, order_status, created_at
                FROM dbo.orders
                ORDER BY created_at DESC, id DESC
                """, (rs, row) -> new OrderNotification(rs.getLong("id"), rs.getString("order_code"),
                        rs.getString("customer_name"), rs.getBigDecimal("total_amount"),
                        rs.getString("order_status"), rs.getTimestamp("created_at").toLocalDateTime()));
    }

    @Transactional
    public OrderNotification confirmOrder(long id) {
        int changed = jdbc.update("""
                UPDATE dbo.orders SET order_status='CONFIRMED', updated_at=SYSUTCDATETIME()
                WHERE id=? AND order_status='PENDING'
                """, id);
        if (changed == 0)
            throw new ApiException(HttpStatus.BAD_REQUEST, "ÄÆ¡n hÃ ng khÃ´ng tá»“n táº¡i hoáº·c Ä‘Ã£ Ä‘Æ°á»£c xá»­ lÃ½");
        return jdbc.queryForObject("""
                SELECT id, order_code, customer_name, total_amount, order_status, created_at
                FROM dbo.orders WHERE id=?
                """, (rs, row) -> new OrderNotification(rs.getLong("id"), rs.getString("order_code"),
                        rs.getString("customer_name"), rs.getBigDecimal("total_amount"),
                        rs.getString("order_status"), rs.getTimestamp("created_at").toLocalDateTime()), id);
    }

    @Transactional
    public OrderNotification cancelOrder(long id) {
        int changed = jdbc.update("""
                UPDATE dbo.orders SET order_status='CANCELLED', updated_at=SYSUTCDATETIME()
                WHERE id=? AND order_status IN ('PENDING','CONFIRMED')
                """, id);
        if (changed == 0)
            throw new ApiException(HttpStatus.BAD_REQUEST, "ÄÆ¡n hÃ ng khÃ´ng tá»“n táº¡i hoáº·c khÃ´ng thá»ƒ há»§y");
        restoreStock(id);
        return jdbc.queryForObject("""
                SELECT id, order_code, customer_name, total_amount, order_status, created_at
                FROM dbo.orders WHERE id=?
                """, (rs, row) -> new OrderNotification(rs.getLong("id"), rs.getString("order_code"),
                        rs.getString("customer_name"), rs.getBigDecimal("total_amount"),
                        rs.getString("order_status"), rs.getTimestamp("created_at").toLocalDateTime()), id);
    }

    @Transactional
    public void deleteOrder(long id) {
        String status = jdbc.query("SELECT order_status FROM dbo.orders WHERE id=?",
                rs -> rs.next() ? rs.getString(1) : null, id);
        if (status == null)
            throw new ApiException(HttpStatus.NOT_FOUND, "Không tìm thấy đơn hàng");
        if (!"CANCELLED".equals(status)) restoreStock(id);
        if (jdbc.update("DELETE FROM dbo.orders WHERE id=?", id) == 0)
            throw new ApiException(HttpStatus.NOT_FOUND, "KhÃ´ng tÃ¬m tháº¥y Ä‘Æ¡n hÃ ng");
    }

    private void restoreStock(long orderId) {
        jdbc.update("""
                UPDATE p
                SET p.stock_quantity=p.stock_quantity+i.quantity,
                    p.updated_at=SYSUTCDATETIME()
                FROM dbo.products p
                JOIN dbo.order_items i ON i.product_id=p.id
                WHERE i.order_id=?
                """, orderId);
    }

    private Number value(String sql) {
        return jdbc.queryForObject(sql, Number.class);
    }

    private BigDecimal decimal(String sql) {
        Number number = value(sql);
        return number instanceof BigDecimal b ? b : new BigDecimal(number.toString());
    }

    public record DashboardStats(long activeProducts, long lowStockProducts, long newProductsThisMonth,
            BigDecimal recycledCartonKg, long equivalentTrees, BigDecimal monthlyRevenue,
            BigDecimal revenueGrowthPercent) {
    }

    public record GreenMember(long id, String fullName, String email, String phone, long totalOrders,
            long totalItems, BigDecimal totalSpent, LocalDateTime lastOrderAt) {
    }

    public record OrderNotification(long id, String orderCode, String customerName, BigDecimal totalAmount,
            String status, LocalDateTime createdAt) {
    }
}

