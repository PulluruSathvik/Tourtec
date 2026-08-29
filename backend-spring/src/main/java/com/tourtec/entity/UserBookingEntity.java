package com.tourtec.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_bookings")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserBookingEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "booking_type", nullable = false)
    private String bookingType;

    @Column(name = "item_title", nullable = false)
    private String itemTitle;

    @Column(nullable = false)
    private String location;

    @Column(name = "total_amount", nullable = false)
    private BigDecimal totalAmount;

    @Column(name = "booking_status")
    @Builder.Default
    private String bookingStatus = "CONFIRMED";

    @Column(name = "pass_qr_code", columnDefinition = "TEXT")
    private String passQrCode;

    @Column(name = "created_at")
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
