package com.group04.utils;

import com.group04.filters.JwtAuthenticationFilter;

import java.util.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.*;
import org.springframework.http.*;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.*;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.*;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {
    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    CorsConfigurationSource cors(@Value("${app.cors.allowed-origins}") String origins) {
        var c = new CorsConfiguration();
        c.setAllowedOrigins(Arrays.stream(origins.split(",")).map(String::trim).filter(s -> !s.isEmpty()).toList());
        c.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        c.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        c.setAllowCredentials(true);
        var source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", c);
        return source;
    }

    @Bean
    SecurityFilterChain security(HttpSecurity http, JwtAuthenticationFilter jwt) throws Exception {
        return http.csrf(c -> c.disable()).cors(c -> {
        }).sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .exceptionHandling(e -> e.authenticationEntryPoint((q, r, x) -> json(r, 401, "YÃªu cáº§u xÃ¡c thá»±c"))
                        .accessDeniedHandler((q, r, x) -> json(r, 403, "KhÃ´ng Ä‘á»§ quyá»n truy cáº­p")))
                .authorizeHttpRequests(a -> a
                        .requestMatchers("/api/health", "/api/auth/register", "/api/auth/login",
                                "/api/auth/reset-password")
                        .permitAll().requestMatchers(HttpMethod.POST, "/api/products/*/reviews").authenticated()
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        .requestMatchers("/api/auth/**", "/api/profile/**", "/api/orders/**", "/api/wishlist/**")
                        .authenticated().anyRequest().permitAll())
                .addFilterBefore(jwt, UsernamePasswordAuthenticationFilter.class).build();
    }

    private static void json(jakarta.servlet.http.HttpServletResponse r, int status, String message)
            throws java.io.IOException {
        r.setStatus(status);
        r.setContentType(MediaType.APPLICATION_JSON_VALUE);
        r.setCharacterEncoding("UTF-8");
        r.getWriter().write("{\"status\":" + status + ",\"message\":\"" + message + "\"}");
    }
}

