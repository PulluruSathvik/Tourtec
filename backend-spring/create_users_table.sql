-- ===================================================================
-- TOURTEC INDIA - User Authentication & SSO Database Schema
-- Database: tourtec_db | Target Table: users & user_bookings
-- ===================================================================

-- 1. Create 'users' Table
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone_number VARCHAR(50),
    password VARCHAR(255),
    auth_provider VARCHAR(50) NOT NULL DEFAULT 'email', -- 'google', 'apple', 'phone_otp', 'email'
    avatar_url VARCHAR(500),
    eco_points INTEGER DEFAULT 100,
    is_verified BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index on email for ultra-fast login lookup
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_auth_provider ON users(auth_provider);

-- 2. Create 'user_bookings' Table for Persistent Bookings & FastPasses
CREATE TABLE IF NOT EXISTS user_bookings (
    id BIGSERIAL PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    booking_type VARCHAR(50) NOT NULL, -- 'hotel', 'cab', 'bus', 'fastpass'
    booking_ref VARCHAR(100) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    destination VARCHAR(100) NOT NULL,
    total_amount NUMERIC(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'CONFIRMED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Seed Initial Demo & Verified SSO Users
INSERT INTO users (full_name, email, phone_number, password, auth_provider, avatar_url, eco_points, is_verified)
VALUES 
    ('Sathvik Reddy', 'sathvik.traveler@gmail.com', '+91 98765 43210', 'Password@123', 'google', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop', 375, TRUE),
    ('Apple Explorer', 'tourist.apple@privaterelay.appleid.com', '+91 99887 76655', 'AppleSecure@2026', 'apple', 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=200&auto=format&fit=crop', 200, TRUE),
    ('Priya Sharma', 'priya.sharma@example.com', '+91 91234 56789', 'Priya@2026', 'email', 'https://api.dicebear.com/7.x/avataaars/svg?seed=PriyaSharma', 150, TRUE)
ON CONFLICT (email) DO UPDATE SET
    last_login_at = CURRENT_TIMESTAMP,
    eco_points = EXCLUDED.eco_points;
