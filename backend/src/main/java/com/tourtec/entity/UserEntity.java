package com.tourtec.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(name = "phone_number")
    private String phoneNumber;

    private String password;

    @Column(name = "auth_provider", nullable = false)
    @Builder.Default
    private String authProvider = "email";

    @Column(name = "avatar_url")
    private String avatarUrl;

    @Column(name = "eco_points")
    @Builder.Default
    private Integer ecoPoints = 100;

    @Column(name = "is_verified")
    @Builder.Default
    private Boolean isVerified = true;

    @Column(name = "created_at")
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "last_login_at")
    @Builder.Default
    private LocalDateTime lastLoginAt = LocalDateTime.now();

    @Column(name = "ssh_public_key", columnDefinition = "TEXT")
    private String sshPublicKey;

    @Column(name = "oauth_provider_id")
    private String oauthProviderId;

    @Column(name = "access_token", columnDefinition = "TEXT")
    private String accessToken;

    @Column(name = "id_token_jwt", columnDefinition = "TEXT")
    private String idTokenJwt;
}
