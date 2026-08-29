package com.tourtec.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/flow")
@CrossOrigin(origins = "*")
public class FlowDistributionController {

    @GetMapping("/suggestions")
    public ResponseEntity<?> getFlowSuggestions() {
        return ResponseEntity.ok(List.of(
                Map.of(
                        "destination", "Charminar",
                        "currentFlow", "Heavy (+35% above average)",
                        "suggestedAlternative", "Salar Jung Museum / Chowmahalla Palace",
                        "incentive", "+50 Eco-Reward Points & 15% off entrance voucher",
                        "timeWindow", "Best time to return: 5:30 PM onwards"
                )
        ));
    }
}
