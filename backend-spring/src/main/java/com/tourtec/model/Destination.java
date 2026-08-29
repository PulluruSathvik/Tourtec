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
public class Destination {
    private String id;
    private String name;
    private String state;
    private String description;
    private String image;
    private Double rating;
    private Integer reviewCount;
    private String category;
    private String crowdLevel; // Low, Moderate, High, Surge
    private Integer currentVisitors;
    private Integer capacity;
    private Double latitude;
    private Double longitude;
    private List<String> highlights;
}
