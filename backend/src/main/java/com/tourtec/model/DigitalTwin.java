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
public class DigitalTwin {
    private String destinationId;
    private String destinationName;
    private Integer totalVisitorsInside;
    private Integer maxThreshold;
    private Double crowdPressureIndex; // 0.0 - 1.0
    private Weather weather;
    private List<Zone> zones;
    private String status; // NORMAL, ALERT, CRITICAL
}
