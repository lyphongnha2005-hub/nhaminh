package com.group04;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class NhaMinhApplication {
    public static void main(String[] args) {
        loadLocalEnvironment();
        // A machine-level DEBUG variable must not enable verbose HTTP/security logs.
        if (System.getProperty("debug") == null) {
            System.setProperty("debug", "false");
        }
        SpringApplication.run(NhaMinhApplication.class, args);
    }

    /**
     * Loads developer-only settings without committing secrets to source control.
     * Real environment variables and JVM properties always take precedence.
     */
    private static void loadLocalEnvironment() {
        Path envFile = Path.of(".env.local");
        if (!Files.isRegularFile(envFile)) {
            return;
        }

        try {
            for (String rawLine : Files.readAllLines(envFile, StandardCharsets.UTF_8)) {
                String line = rawLine.trim();
                if (line.isEmpty() || line.startsWith("#")) {
                    continue;
                }

                int separator = line.indexOf('=');
                if (separator <= 0) {
                    throw new IllegalStateException("DÃ²ng khÃ´ng há»£p lá»‡ trong .env.local");
                }

                String name = line.substring(0, separator).trim();
                String value = line.substring(separator + 1).trim();
                if (System.getenv(name) == null && System.getProperty(name) == null) {
                    System.setProperty(name, value);
                }
            }
        } catch (IOException exception) {
            throw new IllegalStateException("KhÃ´ng thá»ƒ Ä‘á»c file .env.local", exception);
        }
    }
}

