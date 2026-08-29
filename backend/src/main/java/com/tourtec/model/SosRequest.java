package com.tourtec.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SosRequest {
    private Long userId;
    private String userName;
    private String userPhone;
    private Double latitude;
    private Double longitude;
    private String emergencyType; // Medical, Security, Lost
    private String remarks;
}
