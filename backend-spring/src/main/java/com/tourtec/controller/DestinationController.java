package com.tourtec.controller;

import com.tourtec.model.Destination;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/destinations")
@CrossOrigin(origins = "*")
public class DestinationController {

    @GetMapping
    public ResponseEntity<List<Destination>> getAllDestinations() {
        return ResponseEntity.ok(List.of(
                Destination.builder()
                        .id("taj-mahal")
                        .name("Taj Mahal")
                        .state("Uttar Pradesh")
                        .description("Iconic 17th-century ivory-white marble mausoleum on the south bank of the Yamuna river.")
                        .image("https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=800&auto=format&fit=crop")
                        .rating(4.9)
                        .reviewCount(124800)
                        .category("Heritage")
                        .crowdLevel("Moderate")
                        .currentVisitors(1420)
                        .capacity(4000)
                        .latitude(27.1751)
                        .longitude(78.0421)
                        .highlights(List.of("UNESCO World Heritage", "Mughal Architecture", "Yamuna View"))
                        .build(),
                Destination.builder()
                        .id("charminar")
                        .name("Charminar & Old City")
                        .state("Telangana")
                        .description("Grand 1591 monument and mosque surrounded by bustling historic bazaars.")
                        .image("https://images.unsplash.com/photo-1589308078059-be1415eab4c3?q=80&w=800&auto=format&fit=crop")
                        .rating(4.8)
                        .reviewCount(85200)
                        .category("Heritage & Culture")
                        .crowdLevel("High")
                        .currentVisitors(3100)
                        .capacity(3500)
                        .latitude(17.3616)
                        .longitude(78.4747)
                        .highlights(List.of("Laad Bazaar Bangles", "Irani Chai", "Mecca Masjid"))
                        .build()
        ));
    }
}
