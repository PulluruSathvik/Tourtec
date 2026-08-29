package com.tourtec.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Zone {
    private String zoneId;
    private String name;
    private Integer currentOccupancy;
    private Integer maxSafeLimit;
    private Integer waitTimeMinutes;
    private String densityLevel; // Normal, High, Critical
}
