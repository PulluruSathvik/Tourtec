// Frontend Authentication & Backend Table API Client

const API_BASE = import.meta.env.VITE_API_URL || '';

export function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

export const authService = {
  /**
   * Send Real SMS OTP to Indian Mobile
   */
  async sendPhoneOtp({ phone, name }) {
    try {
      const res = await fetch(`${API_BASE}/api/auth/otp/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, name })
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to dispatch SMS OTP');
      }

      return await res.json();
    } catch (err) {
      console.warn('SMS dispatch error:', err.message);
      throw err;
    }
  },

  /**
   * Verify Real SMS OTP
   */
  async verifyPhoneOtp({ phone, otp, name }) {
    try {
      const res = await fetch(`${API_BASE}/api/auth/otp/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp, name })
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'OTP verification failed');
      }

      return await res.json();
    } catch (err) {
      console.warn('OTP verify error:', err.message);
      throw err;
    }
  },

  /**
   * Register a new user in the backend 'users' table
   */
  async signUp({ fullName, email, phoneNumber, password, authProvider = 'email', avatarUrl }) {
    try {
      const res = await fetch(`${API_BASE}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, phoneNumber, password, authProvider, avatarUrl })
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Registration failed');
      }

      return await res.json();
    } catch (err) {
      console.warn('Backend API error:', err.message);
      throw err;
    }
  },

  /**
   * Sign In an existing user from backend 'users' table
   */
  async signIn({ email, password }) {
    try {
      const res = await fetch(`${API_BASE}/api/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Sign in failed');
      }

      return await res.json();
    } catch (err) {
      console.warn('Backend API error:', err.message);
      throw err;
    }
  },

  /**
   * Single Sign-On (Google SSO)
   */
  async ssoLogin({ provider, email, name, avatar, phone, providerUserId, credentialJwt }) {
    try {
      const res = await fetch(`${API_BASE}/api/auth/sso`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider, email, name, avatar, phone, providerUserId, credentialJwt })
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'SSO failed');
      }

      return await res.json();
    } catch (err) {
      console.warn('Backend API error:', err.message);
      throw err;
    }
  },

  /**
   * Verify Real Google Identity Services Credential JWT
   */
  async verifyGoogleCredential(credentialToken) {
    const claims = parseJwt(credentialToken) || {};
    return await this.ssoLogin({
      provider: 'google',
      email: claims.email,
      name: claims.name || claims.given_name || claims.email?.split('@')[0],
      avatar: claims.picture,
      providerUserId: claims.sub,
      credentialJwt: credentialToken
    });
  },

  /**
   * Get all registered users from backend table
   */
  async getAllUsers() {
    try {
      const res = await fetch(`${API_BASE}/api/auth/users`);
      if (res.ok) return await res.json();
      return [];
    } catch (e) {
      return [];
    }
  }
};
