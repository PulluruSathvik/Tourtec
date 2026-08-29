package com.tourtec.controller;

import com.tourtec.model.Alert;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/alerts")
@CrossOrigin(origins = "*")
public class AlertsController {

    @GetMapping
    public ResponseEntity<List<Alert>> getActiveAlerts() {
        return ResponseEntity.ok(List.of(
                Alert.builder()
                        .id("ALT-001")
                        .title("Surge Traffic at Charminar Main Gate")
                        .message("High footfall detected near Mecca Masjid entrance. Consider visiting Salar Jung Museum first.")
                        .severity("warning")
                        .location("Hyderabad, Telangana")
                        .destinationId("charminar")
                        .timestamp(LocalDateTime.now())
                        .build(),
                Alert.builder()
                        .id("ALT-002")
                        .title("Weather Notice: Light Showers at Marine Drive")
                        .message("Intermittent breeze and light drizzle. Sunset viewing is optimal from Nariman Point.")
                        .severity("info")
                        .location("Mumbai, Maharashtra")
                        .destinationId("gateway-of-india")
                        .timestamp(LocalDateTime.now())
                        .build()
        ));
    }
}
