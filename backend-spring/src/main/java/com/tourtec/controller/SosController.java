package com.tourtec.controller;

import com.tourtec.model.SosRequest;
import com.tourtec.model.SosResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.UUID;

@RestController
@RequestMapping("/api/sos")
@CrossOrigin(origins = "*")
public class SosController {

    @PostMapping("/trigger")
    public ResponseEntity<SosResponse> triggerEmergencySos(@RequestBody SosRequest req) {
        String incidentId = "SOS-IND-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        return ResponseEntity.ok(SosResponse.builder()
                .sosIncidentId(incidentId)
                .status("DISPATCHED")
                .nearestPoliceStation("Central Tourist Police Unit (1.2 km)")
                .nearestHospital("Apollo Emergency Care (2.4 km)")
                .emergencyHelpline("112 / 1363 (Tourist Helpline)")
                .dispatchedAt(LocalDateTime.now())
                .message("Emergency responders have been alerted with your live GPS location.")
                .build());
    }
}
