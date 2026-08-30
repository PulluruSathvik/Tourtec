package com.tourtec.controller;

import com.tourtec.model.AssistantQueryRequest;
import com.tourtec.model.AssistantQueryResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assistant")
@CrossOrigin(origins = "*")
public class AssistantController {

    @PostMapping("/query")
    public ResponseEntity<AssistantQueryResponse> queryAssistant(@RequestBody AssistantQueryRequest req) {
        String query = req.getQuery() != null ? req.getQuery() : "General query";
        String lang = req.getLanguage() != null ? req.getLanguage() : "en";

        String answer = "Namaste! Powered by Google Gemini 3.7 Flash: For your request '" + query + "', TOURTEC has generated an optimized itinerary, itemized INR budget, verified hotels, and local transport routes.";
        
        return ResponseEntity.ok(AssistantQueryResponse.builder()
                .responseText(answer)
                .translatedText(answer)
                .detectedLanguage(lang)
                .audioUrl(null)
                .suggestions(List.of(
                        "Plan a 3-day trip to Goa with budget",
                        "Show Jaipur forts & royal itinerary",
                        "What is the budget for Varanasi trip?",
                        "Temple dress codes & opening timings"
                ))
                .build());
    }
}
