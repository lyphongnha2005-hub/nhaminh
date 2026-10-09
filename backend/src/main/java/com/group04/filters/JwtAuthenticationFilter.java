package com.group04.filters;

import java.io.IOException;
import java.util.List;
import jakarta.servlet.*;
import jakarta.servlet.http.*;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.*;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import com.group04.dao.AdminRepository;
import com.group04.dao.CustomerRepository;
import com.group04.models.Account;
import com.group04.models.AccountPrincipal;
import com.group04.services.JwtService;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtService jwt;
    private final CustomerRepository customers;
    private final AdminRepository admins;

    public JwtAuthenticationFilter(JwtService j, CustomerRepository c, AdminRepository a) {
        jwt = j;
        customers = c;
        admins = a;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain)
            throws ServletException, IOException {
        String h = req.getHeader("Authorization");
        if (h != null && h.startsWith("Bearer ")) {
            try {
                var claims = jwt.parse(h.substring(7));
                Long id = Long.valueOf(claims.getSubject());
                String type = claims.get("accountType", String.class);
                Account account = switch (type) {
                    case "ADMIN" -> admins.findById(id).orElseThrow();
                    case "CUSTOMER" -> customers.findById(id).orElseThrow();
                    default -> throw new BadCredentialsException("Loáº¡i tÃ i khoáº£n khÃ´ng há»£p lá»‡");
                };
                if (!"ACTIVE".equals(account.getStatus()))
                    throw new BadCredentialsException("TÃ i khoáº£n khÃ´ng hoáº¡t Ä‘á»™ng");
                if (!account.getEmail().equalsIgnoreCase(claims.get("email", String.class))
                        || !account.getRole().getName().equals(claims.get("role", String.class)))
                    throw new BadCredentialsException("Token khÃ´ng cÃ²n há»£p lá»‡");
                var principal = new AccountPrincipal(id, type);
                var auth = new UsernamePasswordAuthenticationToken(principal, null,
                        List.of(new SimpleGrantedAuthority("ROLE_" + account.getRole().getName())));
                SecurityContextHolder.getContext().setAuthentication(auth);
            } catch (Exception e) {
                SecurityContextHolder.clearContext();
                res.setStatus(401);
                res.setContentType(MediaType.APPLICATION_JSON_VALUE);
                res.setCharacterEncoding("UTF-8");
                res.getWriter().write("{\"status\":401,\"message\":\"Token khÃ´ng há»£p lá»‡ hoáº·c Ä‘Ã£ háº¿t háº¡n\"}");
                return;
            }
        }
        chain.doFilter(req, res);
    }
}

