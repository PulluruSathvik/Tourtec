package com.tourtec.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/timemachine")
@CrossOrigin(origins = "*")
public class TimeMachineController {

    @GetMapping("/{destinationId}")
    public ResponseEntity<?> getHeritageTimeline(@PathVariable String destinationId) {
        return ResponseEntity.ok(Map.of(
                "destinationId", destinationId,
                "monumentName", destinationId.contains("taj") ? "Taj Mahal (Mausoleum of Love)" : "Charminar & Hyderabad Citadel",
                "currentEra", "2026 AD (Smart Tourism Era)",
                "eras", List.of(
                        Map.of(
                                "year", "1591 AD",
                                "eraTitle", "Foundation & Qutb Shahi Golden Age",
                                "ruler", "Sultan Muhammad Quli Qutb Shah",
                                "architecturalHighlights", "Original stucco arabesque ornamentation, working Persian fountains, and grand wooden gates.",
                                "acousticSecret", "Four minarets served as acoustic watchtowers with sound amplifying geometry.",
                                "soundscape", "royal_drums_and_shehnai"
                        ),
                        Map.of(
                                "year", "1857 AD",
                                "eraTitle", "Victorian & Nizami Splendor",
                                "ruler", "Nizam Asaf Jah V",
                                "architecturalHighlights", "Introduction of vintage street lamps, horse-drawn tramways, and the bustling Laad Bazaar pearl trade.",
                                "acousticSecret", "Underground subterranean passages connecting Charminar to Golconda Fort.",
                                "soundscape", "vintage_bazaar_and_trams"
                        ),
                        Map.of(
                                "year", "1948 AD",
                                "eraTitle", "Post-Independence Heritage Era",
                                "ruler", "Democratic Republic of India",
                                "architecturalHighlights", "Archaeological Survey of India (ASI) scientific conservation and garden restoration.",
                                "acousticSecret", "Preservation of 428-year-old lime mortar acoustic dome.",
                                "soundscape", "independence_herald_and_chimes"
                        ),
                        Map.of(
                                "year", "2026 AD",
                                "eraTitle", "TOURTEC Smart Digital Twin Era",
                                "ruler", "Smart Tourism Board",
                                "architecturalHighlights", "LiDAR laser crowd sensors, solar-powered illumination, and AI voice guidance.",
                                "acousticSecret", "IoT crowd vibration monitors preventing seismic structural wear.",
                                "soundscape", "ambient_smart_city_melody"
                        )
                )
        ));
    }
}
