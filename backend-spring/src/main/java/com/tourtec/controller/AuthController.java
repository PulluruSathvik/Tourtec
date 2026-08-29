package com.tourtec.controller;

import com.tourtec.entity.UserEntity;
import com.tourtec.model.AuthResponse;
import com.tourtec.model.SignInRequest;
import com.tourtec.model.SignUpRequest;
import com.tourtec.model.SsoAuthRequest;
import com.tourtec.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    /**
     * Standard User Sign Up with Email & Password
     * Stores user in the 'users' database table
     */
    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signUp(@RequestBody SignUpRequest request) {
        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(new AuthResponse(false, "Email is required", null, null));
        }

        String email = request.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            return ResponseEntity.badRequest().body(new AuthResponse(false, "An account with this email already exists", null, null));
        }

        String fullName = request.getFullName() != null && !request.getFullName().trim().isEmpty()
                ? request.getFullName().trim()
                : email.split("@")[0];

        String avatarUrl = request.getAvatarUrl() != null && !request.getAvatarUrl().isEmpty()
                ? request.getAvatarUrl()
                : "https://api.dicebear.com/7.x/avataaars/svg?seed=" + fullName.replace(" ", "");

        UserEntity newUser = new UserEntity(
                fullName,
                email,
                request.getPhoneNumber() != null ? request.getPhoneNumber().trim() : "+91 98765 43210",
                request.getPassword(),
                request.getAuthProvider() != null ? request.getAuthProvider() : "email",
                avatarUrl
        );
        newUser.setEcoPoints(100); // 100 PTS Welcome Bonus

        UserEntity savedUser = userRepository.save(newUser);
        String token = "TTEC_JWT_" + UUID.randomUUID().toString().replace("-", "");

        return ResponseEntity.ok(new AuthResponse(true, "Registration successful! +100 Travel Points awarded.", token, savedUser));
    }

    /**
     * Standard User Sign In with Email & Password
     */
    @PostMapping("/signin")
    public ResponseEntity<AuthResponse> signIn(@RequestBody SignInRequest request) {
        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(new AuthResponse(false, "Email is required", null, null));
        }

        String email = request.getEmail().trim().toLowerCase();
        Optional<UserEntity> userOpt = userRepository.findByEmail(email);

        if (userOpt.isEmpty()) {
            // Auto-provision demo account if logging in for first time
            UserEntity demoUser = new UserEntity(
                    email.split("@")[0],
                    email,
                    "+91 98765 43210",
                    request.getPassword(),
                    "email",
                    "https://api.dicebear.com/7.x/avataaars/svg?seed=" + email
            );
            demoUser.setEcoPoints(275);
            UserEntity saved = userRepository.save(demoUser);
            String token = "TTEC_JWT_" + UUID.randomUUID().toString().replace("-", "");
            return ResponseEntity.ok(new AuthResponse(true, "Signed in successfully!", token, saved));
        }

        UserEntity user = userOpt.get();
        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);

        String token = "TTEC_JWT_" + UUID.randomUUID().toString().replace("-", "");
        return ResponseEntity.ok(new AuthResponse(true, "Signed in successfully!", token, user));
    }

    /**
     * Single Sign-On (SSO): Google, Apple, and Phone OTP
     * Automatically registers or updates existing user record in 'users' table
     */
    @PostMapping("/sso")
    public ResponseEntity<AuthResponse> handleSso(@RequestBody SsoAuthRequest request) {
        String email = request.getEmail() != null && !request.getEmail().trim().isEmpty()
                ? request.getEmail().trim().toLowerCase()
                : "tourist." + UUID.randomUUID().toString().substring(0, 6) + "@tourtec.in";

        String provider = request.getProvider() != null ? request.getProvider().toLowerCase() : "google";
        Optional<UserEntity> existingUser = userRepository.findByEmail(email);

        UserEntity user;
        if (existingUser.isPresent()) {
            user = existingUser.get();
            user.setLastLoginAt(LocalDateTime.now());
            if (request.getName() != null && !request.getName().isEmpty()) user.setFullName(request.getName());
            if (request.getAvatar() != null && !request.getAvatar().isEmpty()) user.setAvatarUrl(request.getAvatar());
            user = userRepository.save(user);
        } else {
            String name = request.getName() != null && !request.getName().isEmpty()
                    ? request.getName()
                    : (provider.equals("google") ? "Google Tourist" : "Apple Tourist");

            String avatar = request.getAvatar() != null && !request.getAvatar().isEmpty()
                    ? request.getAvatar()
                    : "https://api.dicebear.com/7.x/avataaars/svg?seed=" + name.replace(" ", "");

            user = new UserEntity(
                    name,
                    email,
                    request.getPhone() != null ? request.getPhone() : "+91 98765 43210",
                    "SSO_AUTH_SECURE",
                    provider,
                    avatar
            );
            user.setEcoPoints(100);
            user = userRepository.save(user);
        }

        String token = "TTEC_SSO_TOKEN_" + UUID.randomUUID().toString().replace("-", "");
        return ResponseEntity.ok(new AuthResponse(true, "SSO Authentication Successful via " + provider.toUpperCase(), token, user));
    }

    /**
     * List all registered travelers stored in the 'users' table
     */
    @GetMapping("/users")
    public ResponseEntity<List<UserEntity>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    /**
     * Get single user by ID
     */
    @GetMapping("/user/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        Optional<UserEntity> user = userRepository.findById(id);
        if (user.isPresent()) {
            return ResponseEntity.ok(user.get());
        }
        return ResponseEntity.notFound().build();
    }
}
