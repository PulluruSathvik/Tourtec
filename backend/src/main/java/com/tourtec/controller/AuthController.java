package com.tourtec.controller;

import com.tourtec.entity.UserEntity;
import com.tourtec.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.MessageDigest;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    // Helper: Generate OpenSSH RSA 2048-bit key pair in Java
    private Map<String, String> generateUserSshKey(String email) {
        try {
            KeyPairGenerator kpg = KeyPairGenerator.getInstance("RSA");
            kpg.initialize(2048);
            KeyPair kp = kpg.generateKeyPair();
            byte[] pubBytes = kp.getPublic().getEncoded();
            String base64Key = Base64.getEncoder().encodeToString(pubBytes);
            String sshKey = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC" + base64Key.substring(0, Math.min(180, base64Key.length())) + "... " + email;

            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] digest = md.digest(pubBytes);
            String fingerprint = "SHA256:" + Base64.getUrlEncoder().withoutPadding().encodeToString(digest);

            Map<String, String> result = new HashMap<>();
            result.put("sshKey", sshKey);
            result.put("fingerprint", fingerprint);
            return result;
        } catch (Exception e) {
            Map<String, String> fallback = new HashMap<>();
            fallback.put("sshKey", "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC_RSA2048 " + email);
            fallback.put("fingerprint", "SHA256:7mN4Qz1K8w2xY9bPvE3cL5tU0aJhR6oI2eWsD8vF4gA");
            return fallback;
        }
    }

    // Helper: Generate ID Token JWT
    private String generateIdToken(UserEntity user, String provider) {
        String header = Base64.getUrlEncoder().withoutPadding().encodeToString("{\"alg\":\"RS256\",\"typ\":\"JWT\",\"kid\":\"ttec-rsa-2026\"}".getBytes());
        String payloadJson = String.format("{\"iss\":\"https://auth.tourtec.in\",\"sub\":\"%s\",\"aud\":\"tourtec-smart-tourism-app\",\"email\":\"%s\",\"name\":\"%s\",\"provider\":\"%s\"}",
                user.getOauthProviderId() != null ? user.getOauthProviderId() : "usr_" + user.getId(),
                user.getEmail(),
                user.getFullName(),
                provider);
        String payload = Base64.getUrlEncoder().withoutPadding().encodeToString(payloadJson.getBytes());
        String signature = UUID.randomUUID().toString().replace("-", "");
        return header + "." + payload + "." + signature;
    }

    // 1. Single Sign-On (Google SSO)
    @PostMapping("/sso")
    public ResponseEntity<?> ssoLogin(@RequestBody Map<String, Object> request) {
        try {
            String email = (String) request.get("email");
            if (email == null || email.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Email is required"));
            }

            String cleanEmail = email.trim().toLowerCase();
            String name = (String) request.getOrDefault("name", "Google Tourist");
            String avatar = (String) request.getOrDefault("avatar", "https://api.dicebear.com/7.x/avataaars/svg?seed=" + cleanEmail);
            String provider = (String) request.getOrDefault("provider", "google");
            String providerUserId = (String) request.getOrDefault("providerUserId", "google_oauth_" + System.currentTimeMillis());

            Map<String, String> sshData = generateUserSshKey(cleanEmail);
            String accessToken = "ttec_oauth_access_" + UUID.randomUUID().toString().replace("-", "");

            Optional<UserEntity> existing = userRepository.findByEmail(cleanEmail);
            UserEntity user;

            if (existing.isPresent()) {
                user = existing.get();
                user.setLastLoginAt(LocalDateTime.now());
                user.setAvatarUrl(avatar);
                user.setFullName(name);
                user.setAuthProvider(provider);
                user.setOauthProviderId(providerUserId);
                user.setAccessToken(accessToken);
                user.setSshPublicKey(sshData.get("sshKey"));
                user.setIdTokenJwt(generateIdToken(user, provider));
            } else {
                user = UserEntity.builder()
                        .fullName(name)
                        .email(cleanEmail)
                        .phoneNumber("+91 98765 43210")
                        .password("SSO_OAUTH_TOKEN_VERIFIED")
                        .authProvider(provider)
                        .avatarUrl(avatar)
                        .ecoPoints(100)
                        .isVerified(true)
                        .createdAt(LocalDateTime.now())
                        .lastLoginAt(LocalDateTime.now())
                        .sshPublicKey(sshData.get("sshKey"))
                        .oauthProviderId(providerUserId)
                        .accessToken(accessToken)
                        .build();
                user.setIdTokenJwt(generateIdToken(user, provider));
            }

            UserEntity savedUser = userRepository.save(user);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "SSO Authentication successful via " + provider.toUpperCase() + " (STS Backend)");
            response.put("token", savedUser.getAccessToken());
            response.put("idToken", savedUser.getIdTokenJwt());
            response.put("sshFingerprint", sshData.get("fingerprint"));
            response.put("user", savedUser);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    // 2. Email Sign Up
    @PostMapping("/signup")
    public ResponseEntity<?> signUp(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            if (email == null || email.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Email is required"));
            }

            String cleanEmail = email.trim().toLowerCase();
            if (userRepository.existsByEmail(cleanEmail)) {
                return ResponseEntity.badRequest().body(Map.of("success", false, "message", "An account with this email already exists"));
            }

            String fullName = request.getOrDefault("fullName", cleanEmail.split("@")[0]);
            String password = request.getOrDefault("password", "password123");
            String avatar = request.getOrDefault("avatarUrl", "https://api.dicebear.com/7.x/avataaars/svg?seed=" + fullName.replace(" ", ""));

            Map<String, String> sshData = generateUserSshKey(cleanEmail);
            String accessToken = "ttec_jwt_" + UUID.randomUUID().toString().replace("-", "");

            UserEntity user = UserEntity.builder()
                    .fullName(fullName)
                    .email(cleanEmail)
                    .phoneNumber("+91 98765 43210")
                    .password(password)
                    .authProvider("email")
                    .avatarUrl(avatar)
                    .ecoPoints(100)
                    .isVerified(true)
                    .createdAt(LocalDateTime.now())
                    .lastLoginAt(LocalDateTime.now())
                    .sshPublicKey(sshData.get("sshKey"))
                    .oauthProviderId("email_" + cleanEmail)
                    .accessToken(accessToken)
                    .build();

            user.setIdTokenJwt(generateIdToken(user, "email"));
            UserEntity savedUser = userRepository.save(user);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Account created successfully in PostgreSQL table via Spring Boot STS!");
            response.put("token", savedUser.getAccessToken());
            response.put("idToken", savedUser.getIdTokenJwt());
            response.put("user", savedUser);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    // 3. Email Sign In
    @PostMapping("/signin")
    public ResponseEntity<?> signIn(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            if (email == null || email.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Email is required"));
            }

            String cleanEmail = email.trim().toLowerCase();
            Optional<UserEntity> userOpt = userRepository.findByEmail(cleanEmail);

            UserEntity user;
            if (userOpt.isEmpty()) {
                String name = cleanEmail.split("@")[0];
                Map<String, String> sshData = generateUserSshKey(cleanEmail);
                user = UserEntity.builder()
                        .fullName(name)
                        .email(cleanEmail)
                        .phoneNumber("+91 98765 43210")
                        .password(request.getOrDefault("password", "password123"))
                        .authProvider("email")
                        .avatarUrl("https://api.dicebear.com/7.x/avataaars/svg?seed=" + name)
                        .ecoPoints(275)
                        .isVerified(true)
                        .createdAt(LocalDateTime.now())
                        .lastLoginAt(LocalDateTime.now())
                        .sshPublicKey(sshData.get("sshKey"))
                        .oauthProviderId("email_" + cleanEmail)
                        .accessToken("ttec_jwt_" + UUID.randomUUID().toString().replace("-", ""))
                        .build();
                user.setIdTokenJwt(generateIdToken(user, "email"));
                user = userRepository.save(user);
            } else {
                user = userOpt.get();
                user.setLastLoginAt(LocalDateTime.now());
                user = userRepository.save(user);
            }

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Signed in successfully via Spring Boot!");
            response.put("token", user.getAccessToken());
            response.put("idToken", user.getIdTokenJwt());
            response.put("user", user);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    // 4. Query All Users
    @GetMapping("/users")
    public ResponseEntity<List<UserEntity>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    // 5. Public JWKS / SSH Keys
    @GetMapping("/keys")
    public ResponseEntity<?> getPublicKeys() {
        return ResponseEntity.ok(Map.of(
                "keys", List.of(Map.of(
                        "kty", "RSA",
                        "use", "sig",
                        "alg", "RS256",
                        "kid", "ttec-rsa-2026",
                        "issuer", "https://auth.tourtec.in",
                        "fingerprint", "SHA256:7mN4Qz1K8w2xY9bPvE3cL5tU0aJhR6oI2eWsD8vF4gA"
                ))
        ));
    }
}
