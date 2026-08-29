package com.tourtec.controller;

import com.tourtec.model.DigitalTwin;
import com.tourtec.model.Weather;
import com.tourtec.model.Zone;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/telemetry")
@CrossOrigin(origins = "*")
public class TelemetryController {

    @GetMapping("/twin/{destinationId}")
    public ResponseEntity<DigitalTwin> getDigitalTwinTelemetry(@PathVariable String destinationId) {
        return ResponseEntity.ok(DigitalTwin.builder()
                .destinationId(destinationId)
                .destinationName("Charminar Monument Complex")
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
                        Zone.builder().zoneId("Z2").name("Laad Bazaar Pedestrian Way").currentOccupancy(890).maxSafeLimit(1500).waitTimeMinutes(10).densityLevel("Moderate").build(),
                        Zone.builder().zoneId("Z3").name("Mecca Masjid Courtyard").currentOccupancy(530).maxSafeLimit(1200).waitTimeMinutes(0).densityLevel("Normal").build()
                ))
                .build());
    }
}
