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

        String answer = "Namaste! For your query '" + query + "', TOURTEC recommends exploring top rated heritage sites with low crowd density. Use our dynamic roadmap for the fastest scenic route!";
        
        return ResponseEntity.ok(AssistantQueryResponse.builder()
                .responseText(answer)
                .translatedText(answer)
                .detectedLanguage(lang)
                .audioUrl(null)
                .suggestions(List.of("What is the best time to visit?", "Show nearby local restaurants", "Book a rental cab"))
                .build());
    }
}
