package com.tourtec.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
public class RootController {

    @GetMapping("/")
    public ResponseEntity<?> rootWelcome() {
        return ResponseEntity.ok(Map.of(
                "message", "🚀 Welcome to TOURTEC India Smart Tourism Spring Boot API (STS Backend)",
                "status", "online",
                "version", "2.0.0",
                "timestamp", LocalDateTime.now().toString(),
                "endpoints", Map.of(
                        "health", "/api/health",
                        "destinations", "/api/destinations",
                        "alerts", "/api/alerts",
                        "authUsers", "/api/auth/users",
                        "flowSuggestions", "/api/flow/suggestions"
                ),
                "frontendApplication", "https://tourtec-frontend.onrender.com"
        ));
    }
}
