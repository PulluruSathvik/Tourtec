package com.tourtec.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/wallet")
@CrossOrigin(origins = "*")
public class WalletController {

    @GetMapping("/balance/{userId}")
    public ResponseEntity<?> getWalletBalance(@PathVariable Long userId) {
        return ResponseEntity.ok(Map.of(
                "userId", userId,
                "ecoPoints", 275,
                "tier", "Gold Traveler",
                "carbonSavedKg", 14.2,
                "activeVouchers", List.of(
                        Map.of("code", "TOURTEC100", "discount", "15% OFF", "validTill", "2026-12-31"),
                        Map.of("code", "ECOPASS20", "discount", "Free EV Shuttle", "validTill", "2026-10-15")
                )
        ));
    }
}
