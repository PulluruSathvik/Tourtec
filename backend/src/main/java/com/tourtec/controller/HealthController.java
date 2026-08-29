package com.tourtec.controller;

import com.tourtec.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class HealthController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/health")
    public ResponseEntity<?> healthCheck() {
        try {
            long count = userRepository.count();
            return ResponseEntity.ok(Map.of(
                    "status", "healthy",
                    "app", "TOURTEC Spring Boot API (STS)",
                    "version", "2.0.0",
                    "database", "connected",
                    "userCount", count,
                    "timestamp", LocalDateTime.now().toString()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "status", "degraded",
                    "database", e.getMessage(),
                    "timestamp", LocalDateTime.now().toString()
            ));
        }
    }
}
