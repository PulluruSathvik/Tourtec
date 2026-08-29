package com.tourtec.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoadmapOptimizationRequest {
    private String origin;
    private List<String> destinations;
    private String travelMode;
    private Integer durationHours;
}
