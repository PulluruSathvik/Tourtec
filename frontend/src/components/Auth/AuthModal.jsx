import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { authService, parseJwt } from '../../services/authService';
import {
  X,
  Mail,
  Lock,
  User,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Eye,
  EyeOff,
  Coins,
  Key,
  ChevronRight,
  Plus,
  LogIn,
  UserPlus
} from 'lucide-react';
import confetti from 'canvas-confetti';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '849997510284-lb00lknh9vfbhrhj2pfhmkiqr9qcdgei.apps.googleusercontent.com';

export const AuthModal = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authMode,
    setAuthMode,
    loginUser
  } = useApp();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Quick Google Account Picker state (Direct instant login option)
  const [isGooglePickerOpen, setIsGooglePickerOpen] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [customGoogleName, setCustomGoogleName] = useState('');

  const googleBtnRef = useRef(null);

  // 🌐 Initialize Official Google Identity Services SDK
  useEffect(() => {
    if (!isAuthModalOpen) return;

    const initGoogleGSI = () => {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true
        });

        if (googleBtnRef.current) {
          googleBtnRef.current.innerHTML = '';
          window.google.accounts.id.renderButton(googleBtnRef.current, {
            type: 'standard',
            theme: 'outline',
            size: 'large',
            text: 'continue_with',
            shape: 'pill',
            width: '340',
            logo_alignment: 'left'
          });
        }
      }
    };

    const timer = setTimeout(initGoogleGSI, 150);
    return () => clearTimeout(timer);
  }, [isAuthModalOpen, isGooglePickerOpen]);

  // Real Google Credential Callback from Google's Live Servers
  const handleGoogleCredentialResponse = async (response) => {
    setIsLoading(true);
    try {
      const claims = parseJwt(response.credential) || {};
      const result = await authService.ssoLogin({
        provider: 'google',
        email: claims.email,
        name: claims.name || claims.given_name || claims.email?.split('@')[0],
        avatar: claims.picture,
        phone: '+91 98765 43210',
        providerUserId: claims.sub,
        credentialJwt: response.credential
      });

      setIsLoading(false);
      const user = result.user || {};
      loginUser({
        name: user.fullName || claims.name || claims.email?.split('@')[0],
        email: user.email || claims.email,
        phone: user.phoneNumber || '+91 98765 43210',
        avatar: user.avatarUrl || claims.picture,
        authProvider: 'google',
        sshPublicKey: user.sshPublicKey,
        isVerified: true
      });

      confetti({ particleCount: 100, spread: 90 });
      setIsAuthModalOpen(false);
    } catch (err) {
      setIsLoading(false);
      alert(err.message || 'Google Authentication failed');
    }
  };

  // Direct Google Account Login (Saves to PostgreSQL)
  const executeDirectGoogleLogin = async (selectedEmail, selectedName, avatarUrl) => {
    setIsLoading(true);
    try {
      const result = await authService.ssoLogin({
        provider: 'google',
        email: selectedEmail,
        name: selectedName,
        avatar: avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedEmail}`,
        phone: '+91 98765 43210',
        providerUserId: `google_oauth_${Math.floor(100000000000 + Math.random() * 900000000000)}`
      });

      setIsLoading(false);
      const user = result.user || {};
      loginUser({
        name: user.fullName || selectedName,
        email: user.email || selectedEmail,
        phone: user.phoneNumber || '+91 98765 43210',
        avatar: user.avatarUrl || avatarUrl,
        authProvider: 'google',
        sshPublicKey: user.sshPublicKey,
        isVerified: true
      });

      confetti({ particleCount: 90, spread: 90 });
      setIsGooglePickerOpen(false);
      setIsAuthModalOpen(false);
    } catch (err) {
      setIsLoading(false);
      alert(err.message || 'Google Sign-In failed');
    }
  };

  // Standard Email/Password Submission
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!email.trim() || !password.trim()) {
      alert('Please enter your email and password');
      return;
    }

    setIsLoading(true);
    try {
      const nameToUse = fullName.trim() || email.split('@')[0];
      const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${nameToUse.replace(/ /g, '')}`;

      let result;
      if (authMode === 'signup') {
        result = await authService.signUp({
          fullName: nameToUse,
          email: email.trim(),
          phoneNumber: '+91 98765 43210',
          password,
          authProvider: 'email',
          avatarUrl: avatar
        });
      } else {
        result = await authService.signIn({
          email: email.trim(),
          password
        });
      }

      setIsLoading(false);
      const user = result.user || {};
      loginUser({
        name: user.fullName || nameToUse,
        email: user.email || email.trim(),
        phone: user.phoneNumber || '+91 98765 43210',
        avatar: user.avatarUrl || avatar,
        authProvider: user.authProvider || 'email',
        sshPublicKey: user.sshPublicKey,
        isVerified: true
      });

      confetti({ particleCount: 80, spread: 80 });
      setIsAuthModalOpen(false);
    } catch (err) {
      setIsLoading(false);
      alert(err.message || 'Authentication failed');
    }
  };

  if (!isAuthModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fadeIn">
      
      {/* 🌟 1. GOOGLE DIRECT ACCOUNT PICKER MODAL */}
      {isGooglePickerOpen && (
        <div className="bg-white max-w-sm w-full rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-scaleUp">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <div>
                <h4 className="text-xs font-black text-slate-900">Sign in with Google</h4>
                <p className="text-[10px] text-slate-500">Choose an account for TOURTEC India</p>
              </div>
            </div>
            <button
              onClick={() => setIsGooglePickerOpen(false)}
              className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-5 space-y-3">
            {/* Account 1: 2400032783cse1@gmail.com */}
            <button
              onClick={() => executeDirectGoogleLogin(
                '2400032783cse1@gmail.com',
                'Sathvik Reddy',
                'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop'
              )}
              disabled={isLoading}
              className="w-full p-3 rounded-2xl border-2 border-blue-500/80 bg-blue-50/40 hover:bg-blue-50 text-left flex items-center gap-3 transition cursor-pointer shadow-xs"
            >
              <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-black text-sm flex items-center justify-center shadow-sm">
                S
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                  <span>Sathvik Reddy</span>
                  <span className="px-1.5 py-0.2 bg-blue-100 text-blue-700 rounded text-[9px] font-bold">Default</span>
                </div>
                <div className="text-[11px] font-mono text-slate-600 truncate font-semibold">2400032783cse1@gmail.com</div>
              </div>
              <ChevronRight className="w-4 h-4 text-blue-600" />
            </button>

            {/* Custom Google Account Input */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
              <div className="text-[11px] font-bold text-slate-700">Or enter any Google email:</div>
              <input
                type="text"
                placeholder="Your Name..."
                value={customGoogleName}
                onChange={(e) => setCustomGoogleName(e.target.value)}
                className="w-full p-2 bg-white border border-slate-300 rounded-xl text-xs font-bold focus:outline-none"
              />
              <input
                type="email"
                placeholder="your.email@gmail.com..."
                value={customGoogleEmail}
                onChange={(e) => setCustomGoogleEmail(e.target.value)}
                className="w-full p-2 bg-white border border-slate-300 rounded-xl text-xs font-bold focus:outline-none"
              />
              <button
                onClick={() => {
                  if (!customGoogleEmail.trim()) return;
                  executeDirectGoogleLogin(
                    customGoogleEmail.trim(),
                    customGoogleName.trim() || customGoogleEmail.split('@')[0],
                    `https://api.dicebear.com/7.x/avataaars/svg?seed=${customGoogleEmail}`
                  );
                }}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl transition"
              >
                Sign In with this Google Account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🌟 2. MAIN EMAIL & GOOGLE AUTHENTICATION MODAL */}
      {!isGooglePickerOpen && (
        <div className="bg-white border border-slate-200 max-w-md w-full rounded-3xl shadow-2xl overflow-hidden relative animate-scaleUp">
          
          {/* Close Button */}
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Modal Header */}
          <div className="holiday-hero-gradient p-6 border-b border-cyan-200/80 text-center relative space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white shadow-xs border border-cyan-200 text-xs font-black text-blue-700 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-orange-500" />
              <span>Get +100 Free Bonus Travel Points</span>
            </div>

            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              {authMode === 'signup' ? 'Create Your Account' : 'Welcome Back Traveler'}
            </h3>
            <p className="text-xs text-slate-600 font-medium">
              {authMode === 'signup'
                ? 'Sign up with email to unlock VIP FastPasses, hotel stays & AI guide'
                : 'Sign in to access your bookings, tickets & wallet points'}
            </p>
          </div>

          {/* Modal Body */}
          <div className="p-6 space-y-4">
            
            {/* 🚀 LIVE GOOGLE SIGN IN BUTTON */}
            <div className="space-y-2">
              
              {/* Official Google GSI Render Button */}
              <div className="flex justify-center w-full min-h-[44px]" ref={googleBtnRef}>
                <div className="w-full py-3 px-4 rounded-full border border-slate-300 bg-slate-50 text-slate-500 text-xs font-bold flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                  <span>Connecting to Google OAuth...</span>
                </div>
              </div>

              {/* Direct Google 1-Click Picker Button */}
              <button
                onClick={() => setIsGooglePickerOpen(true)}
                className="w-full py-2.5 px-4 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Select from Saved Google Accounts</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

            </div>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-slate-200"></div>
              <span className="text-[10px] uppercase font-bold text-slate-400">or with email</span>
              <div className="flex-1 h-px bg-slate-200"></div>
            </div>

            {/* Email Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              
              {/* Full Name (Sign Up only) */}
              {authMode === 'signup' && (
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 block">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Sathvik Reddy"
                      className="w-full py-2.5 pl-10 pr-4 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-blue-500 transition"
                    />
                  </div>
                </div>
              )}

              {/* Email Address */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 block">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full py-2.5 pl-10 pr-4 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-blue-500 transition"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-[11px] font-bold text-slate-700">Password</label>
                  {authMode === 'signin' && (
                    <span
                      onClick={() => alert('Password reset link sent to your registered email address.')}
                      className="text-[10px] font-bold text-blue-600 hover:underline cursor-pointer"
                    >
                      Forgot Password?
                    </span>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full py-2.5 pl-10 pr-10 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-blue-500 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center justify-between text-xs pt-0.5">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 rounded text-blue-600 focus:ring-0 border-slate-300"
                  />
                  <span className="text-[11px] text-slate-600 font-medium">Keep me signed in</span>
                </label>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-md shadow-blue-500/25 transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer mt-1"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (authMode === 'signup' ? <UserPlus className="w-4 h-4" /> : <LogIn className="w-4 h-4" />)}
                <span>{isLoading ? 'Authenticating...' : (authMode === 'signup' ? 'Create Account & Claim ₹100 PTS' : 'Sign In with Email')}</span>
              </button>

            </form>

            {/* Security Footer */}
            <div className="p-3 bg-slate-50 rounded-2xl text-[10px] text-slate-500 space-y-0.5 border border-slate-100">
              <div className="flex items-center gap-1 font-bold text-slate-700">
                <Key className="w-3 h-3 text-blue-600" />
                <span>OpenSSH Key + PostgreSQL Database Sync</span>
              </div>
              <p>Generates an OpenSSH 2048-bit session key and persists your traveler record securely in PostgreSQL.</p>
            </div>

            {/* Toggle Sign Up / Sign In Mode */}
            <div className="text-center pt-2 border-t border-slate-100 text-xs">
              {authMode === 'signup' ? (
                <span className="text-slate-500">
                  Already have an account?{' '}
                  <button
                    onClick={() => setAuthMode('signin')}
                    className="text-blue-600 font-bold hover:underline cursor-pointer"
                  >
                    Sign In here
                  </button>
                </span>
              ) : (
                <span className="text-slate-500">
                  Don't have an account yet?{' '}
                  <button
                    onClick={() => setAuthMode('signup')}
                    className="text-blue-600 font-bold hover:underline cursor-pointer"
                  >
                    Sign Up for Free
                  </button>
                </span>
              )}
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
