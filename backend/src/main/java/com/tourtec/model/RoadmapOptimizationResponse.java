package com.tourtec.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoadmapOptimizationResponse {
    private List<String> optimizedRoute;
    private Double totalDistanceKm;
    private Integer estimatedTimeMinutes;
    private Integer crowdAvoidanceScore; // 0 - 100%
    private List<String> ecoRecommendations;
}
