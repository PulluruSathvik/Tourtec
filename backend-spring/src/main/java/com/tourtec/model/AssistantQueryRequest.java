package com.tourtec.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AssistantQueryRequest {
    private String query;
    private String language;
    private String context;
    private String destinationId;
}
