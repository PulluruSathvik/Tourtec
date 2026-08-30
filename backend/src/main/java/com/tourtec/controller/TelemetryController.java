package com.tourtec.controller;

import com.tourtec.model.DigitalTwin;
import com.tourtec.model.Weather;
import com.tourtec.model.Zone;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/telemetry")
@CrossOrigin(origins = "*")
public class TelemetryController {

    @GetMapping("/twin/{destinationId}")
    public ResponseEntity<DigitalTwin> getDigitalTwinTelemetry(@PathVariable String destinationId) {
        return ResponseEntity.ok(DigitalTwin.builder()
                .destinationId(destinationId)
                .destinationName(destinationId.contains("taj") ? "Taj Mahal Heritage Sanctuary" : "Charminar Monument Complex")
                .totalVisitorsInside(1840)
                .maxThreshold(3500)
                .crowdPressureIndex(0.52)
                .status("NORMAL")
                .weather(Weather.builder()
                        .condition("Pleasant & Clear")
                        .temperature(29.5)
                        .humidity(48)
                        .windSpeed(12.4)
                        .airQualityIndex(62)
                        .build())
                .zones(List.of(
                        Zone.builder().zoneId("Z1").name("Main Monument Arch").currentOccupancy(420).maxSafeLimit(800).waitTimeMinutes(5).densityLevel("Normal").build(),
                        Zone.builder().zoneId("Z2").name("Heritage Pedestrian Way").currentOccupancy(890).maxSafeLimit(1500).waitTimeMinutes(10).densityLevel("Moderate").build(),
                        Zone.builder().zoneId("Z3").name("Monument Courtyard").currentOccupancy(530).maxSafeLimit(1200).waitTimeMinutes(0).densityLevel("Normal").build()
                ))
                .build());
    }

    @PostMapping("/confusion-analysis")
    public ResponseEntity<?> analyzeConfusionTrajectory(@RequestBody Map<String, Object> payload) {
        double avgSpeed = 3.5;
        if (payload.containsKey("averageSpeedKmh") && payload.get("averageSpeedKmh") instanceof Number) {
            avgSpeed = ((Number) payload.get("averageSpeedKmh")).doubleValue();
        }

        boolean isConfused = avgSpeed < 1.5;
        int confusionScore = isConfused ? 85 : 12;

        return ResponseEntity.ok(Map.of(
                "confusionScore", confusionScore,
                "status", isConfused ? "CONFUSED_OR_LOST" : "ON_TRACK",
                "isErratic", isConfused,
                "indicators", Map.of(
                        "circularityIndex", isConfused ? "Critical (0.88 Loops Detected)" : "Normal (0.04)",
                        "hesitationStops", isConfused ? "4 stops in 2m" : "0 stops",
                        "paceVariance", isConfused ? "Erratic (0.6 km/h)" : "Stable (3.8 km/h)",
                        "orientationEntropy", isConfused ? "180° Direction Inversions" : "Aligned to Main Heritage Corridor"
                ),
                "actionableGuidance", isConfused
                        ? "Proactive Anomaly Detected: Repeated circular path in narrow heritage alleys. Shortest line-of-sight rescue path to main promenade is ready."
                        : "Tourist journey is progressing smoothly along designated heritage corridor."
        ));
    }
}
