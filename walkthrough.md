# TOURTEC - Production Deployment & Spring Boot Backend Walkthrough

The **TOURTEC Smart Tourism & Intelligence Platform** is fully deployed, operational, and live in the cloud.

---

## 🌟 Live Production Links

* **🌐 Frontend Web App**: [https://tourtec-frontend.onrender.com](https://tourtec-frontend.onrender.com)
* **🍃 Spring Boot Backend API**: [https://tourtec-backend.onrender.com](https://tourtec-backend.onrender.com)
* **🏥 Live Health Check**: [https://tourtec-backend.onrender.com/api/health](https://tourtec-backend.onrender.com/api/health)
* **📂 GitHub Repository**: [https://github.com/PulluruSathvik/Tourtec](https://github.com/PulluruSathvik/Tourtec)

---

## 📋 Deployed System Overview

### 1. Frontend Web App (`frontend/`)
* **Technology**: React 18, Vite, Vanilla CSS + TailwindCSS, Lucide Icons, Leaflet Maps.
* **Features**:
  * 7-Language Indian Multilingual Engine (`English`, `हिंदी`, `తెలుగు`, `தமிழ்`, `ಕನ್ನಡ`, `বাংলা`, `मराठी`).
  * Google OAuth 2.0 Single Sign-On + Email / Password Authentication.
  * Interactive Heritage Map & Live Crowd Density Heatmap.
  * Transport & Rental Booking Hub (Cabs, Buses, EV Shuttles).
  * Hotel Stays & Dining Finder.
  * Dynamic Route & AI Itinerary Generator.

### 2. Backend API Server (`backend/`)
* **Technology**: Spring Boot 3.2.4 (Java 17 / Maven), Spring Data JPA, Hibernate, PostgreSQL Driver.
* **Features**:
  * Resilient `DataSourceConfig` supporting cloud `DATABASE_URL`, local PostgreSQL (`localhost:5433`), and in-memory auto-fallback.
  * Cryptographic OpenSSH RSA 2048-bit Key & JWT ID token generation for user sessions.
  * Complete REST Controllers: `AuthController`, `HealthController`, `DestinationController`, `AlertsController`, `AssistantController`, `SosController`, `RoadmapController`, `FlowDistributionController`, `TelemetryController`, `WalletController`.

### 3. Database (`tourtec-db`)
* **Technology**: PostgreSQL 18 Managed Cloud Database.
* **Tables**: `users` (with OpenSSH keys & OAuth IDs), `user_bookings`.

---

## 🚀 Live Health Check Response:
```json
{
  "timestamp": "2026-08-29T23:48:02.144429720",
  "status": "healthy",
  "app": "TOURTEC Spring Boot API (STS)",
  "version": "2.0.0",
  "database": "connected",
  "userCount": 0
}
```
