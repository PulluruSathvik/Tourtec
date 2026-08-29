package com.tourtec.controller;

import com.tourtec.model.RoadmapOptimizationRequest;
import com.tourtec.model.RoadmapOptimizationResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/roadmap")
@CrossOrigin(origins = "*")
public class RoadmapController {

    @PostMapping("/optimize")
    public ResponseEntity<RoadmapOptimizationResponse> optimizeRoadmap(@RequestBody RoadmapOptimizationRequest req) {
        return ResponseEntity.ok(RoadmapOptimizationResponse.builder()
                .optimizedRoute(req.getDestinations() != null ? req.getDestinations() : List.of("Origin", "Site A", "Site B"))
                .totalDistanceKm(28.4)
                .estimatedTimeMinutes(45)
                .crowdAvoidanceScore(88)
                .ecoRecommendations(List.of("Use Metro line 2 to bypass bottleneck", "Take EV Shuttle from Station to Gate"))
                .build());
    }
}
