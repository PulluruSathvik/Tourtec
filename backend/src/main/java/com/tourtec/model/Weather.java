package com.tourtec.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Weather {
    private String condition;
    private Double temperature;
    private Integer humidity;
    private Double windSpeed;
    private Integer airQualityIndex;
}
