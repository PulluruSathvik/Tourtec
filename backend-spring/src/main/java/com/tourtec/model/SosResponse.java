package com.tourtec.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SosResponse {
    private String sosIncidentId;
    private String status; // DISPATCHED, ACKNOWLEDGED
    private String nearestPoliceStation;
    private String nearestHospital;
    private String emergencyHelpline;
    private LocalDateTime dispatchedAt;
    private String message;
}
