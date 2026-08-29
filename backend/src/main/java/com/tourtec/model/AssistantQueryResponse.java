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
public class AssistantQueryResponse {
    private String responseText;
    private String translatedText;
    private String detectedLanguage;
    private String audioUrl;
    private List<String> suggestions;
}
