import React, { useState } from 'react';
import { X, Eye, EyeOff, User, Mail, Phone, Lock, LogOut, ShieldCheck, Loader2, AlertCircle } from 'lucide-react';
import { loginUser, signupUser, googleLoginUser } from '../services/api';
import { handleGoogleSignIn } from '../firebase';

// Official Google Icon Component
const GoogleIcon = () => (
  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
    />
  </svg>
);

export default function CustomerAccountModal({ 
  isOpen, 
  onClose, 
  user,
  onLogin,
  onLogout
}) {
  // Authentication Form Mode: 'signin' | 'signup'
  const [authMode, setAuthMode] = useState('signin');
  const [loading, setLoading] = useState(false);

  // Password Visibility State
  const [showPassword, setShowPassword] = useState(false);

  // Sign In Form State
  const [signInIdentifier, setSignInIdentifier] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [signInErrors, setSignInErrors] = useState({});

  // Sign Up Form State
  const [signUpName, setSignUpName] = useState('');
  const [signUpIdentifier, setSignUpIdentifier] = useState('');
  const [signUpPhone, setSignUpPhone] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpErrors, setSignUpErrors] = useState({});

  if (!isOpen) return null;

  // Helper validation regexes
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9+\s-]{10,15}$/;

  // Reset form inputs & errors when closing modal
  const handleModalClose = () => {
    setSignInIdentifier('');
    setSignInPassword('');
    setSignInErrors({});
    setSignUpName('');
    setSignUpIdentifier('');
    setSignUpPhone('');
    setSignUpPassword('');
    setSignUpErrors({});
    setAuthMode('signin');
    setShowPassword(false);
    setLoading(false);
    onClose();
  };

  // Handle Real Firebase Google Login -> Backend DB & JWT Sync
  const handleGoogleLogin = async () => {
    setLoading(true);
    setSignInErrors({});
    try {
      // 1. Authenticate with Google Popup via Firebase SDK
      const firebaseUser = await handleGoogleSignIn();
      if (firebaseUser) {
        // 2. Call Node.js Backend API to save Google user in Supabase Database
        const dbRes = await googleLoginUser({
          name: firebaseUser.name,
          email: firebaseUser.email,
          avatar: firebaseUser.avatar
        });

        if (dbRes && dbRes.user) {
          localStorage.setItem('jkr_token', dbRes.token || '');
          localStorage.setItem('jkr_user', JSON.stringify(dbRes.user));
          onLogin(dbRes.user, dbRes.token);
          handleModalClose();
        } else {
          throw new Error('Database save failed');
        }
      }
    } catch (err) {
      console.error("Google Auth error:", err);
      if (err.code !== 'auth/popup-closed-by-user') {
        setSignInErrors({ general: err.message || 'Google Auth Error: Could not save to Database.' });
      }
    } finally {
      setLoading(false);
    }
  };

  // Sign In Form Submit
  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    const errors = {};

    if (!signInIdentifier.trim()) {
      errors.identifier = 'Email address is required.';
    } else if (!emailRegex.test(signInIdentifier.trim())) {
      errors.identifier = 'Please enter a valid email address.';
    }

    if (!signInPassword) {
      errors.password = 'Password is required.';
    }

    if (Object.keys(errors).length > 0) {
      setSignInErrors(errors);
      return;
    }

    setLoading(true);
    setSignInErrors({});

    try {
      const res = await loginUser({
        email: signInIdentifier.trim(),
        password: signInPassword
      });

      if (res.token && res.user) {
        localStorage.setItem('jkr_token', res.token);
        localStorage.setItem('jkr_user', JSON.stringify(res.user));
        onLogin(res.user, res.token);
        handleModalClose();
      }
    } catch (err) {
      setSignInErrors({ general: err.message || 'Invalid email or password. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  // Sign Up Form Submit
  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    const errors = {};

    if (!signUpName.trim()) {
      errors.name = 'Full name is required.';
    }

    if (!signUpIdentifier.trim()) {
      errors.identifier = 'Email address is required.';
    } else if (!emailRegex.test(signUpIdentifier.trim())) {
      errors.identifier = 'Please enter a valid email address.';
    }

    if (!signUpPhone.trim()) {
      errors.phone = 'Phone number is required.';
    } else if (!phoneRegex.test(signUpPhone.trim())) {
      errors.phone = 'Please enter a valid phone number (10-15 digits).';
    }

    if (!signUpPassword) {
      errors.password = 'Password is required.';
    } else if (signUpPassword.length < 6) {
      errors.password = 'Password must be at least 6 characters.';
    }

    if (Object.keys(errors).length > 0) {
      setSignUpErrors(errors);
      return;
    }

    setLoading(true);
    setSignUpErrors({});

    try {
      const res = await signupUser({
        name: signUpName.trim(),
        email: signUpIdentifier.trim(),
        phone: signUpPhone.trim(),
        password: signUpPassword
      });

      if (res.token && res.user) {
        localStorage.setItem('jkr_token', res.token);
        localStorage.setItem('jkr_user', JSON.stringify(res.user));
        onLogin(res.user, res.token);
        handleModalClose();
      }
    } catch (err) {
      setSignUpErrors({ general: err.message || 'Registration failed. Email might already be registered.' });
    } finally {
      setLoading(false);
    }
  };

  // First letter of user's name
  const firstLetter = (user?.name || 'User').trim().charAt(0).toUpperCase();

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
      onClick={handleModalClose}
    >
      <div 
        className="bg-white max-w-sm sm:max-w-md w-full rounded-3xl overflow-hidden shadow-2xl border border-gray-200 relative flex flex-col my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleModalClose}
          className="absolute top-4 right-4 z-10 p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ------------------------------------------------------------- */}
        {/* STATE A: NOT LOGGED IN -> BACKEND SIGN IN / SIGN UP FORM       */}
        {/* ------------------------------------------------------------- */}
        {!user ? (
          <div className="p-6 sm:p-8 space-y-5">
            
            {/* Header Title */}
            <div className="text-center">
              <h2 className="font-serif text-2xl font-bold text-[#3b0910]">
                {authMode === 'signin' ? 'Sign In' : 'Create Account'}
              </h2>
            </div>

            {/* Switch Tabs: Sign In / Sign Up */}
            <div className="flex bg-gray-100 p-1 rounded-2xl text-xs font-bold">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('signin');
                  setSignInErrors({});
                }}
                className={`flex-1 py-2.5 rounded-xl transition ${
                  authMode === 'signin'
                    ? 'bg-white text-[#3b0910] shadow-xs'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                Sign In
              </button>

              <button
                type="button"
                onClick={() => {
                  setAuthMode('signup');
                  setSignUpErrors({});
                }}
                className={`flex-1 py-2.5 rounded-xl transition ${
                  authMode === 'signup'
                    ? 'bg-white text-[#3b0910] shadow-xs'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* 1. SIGN IN FORM */}
            {authMode === 'signin' && (
              <form onSubmit={handleSignInSubmit} className="space-y-4" noValidate>
                
                {signInErrors.general && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                    <span>{signInErrors.general}</span>
                  </div>
                )}

                {/* Email Field */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="name@gmail.com"
                      value={signInIdentifier}
                      onChange={(e) => {
                        setSignInIdentifier(e.target.value);
                        if (signInErrors.identifier) setSignInErrors({...signInErrors, identifier: null});
                      }}
                      className={`w-full pl-9 pr-3 py-2.5 text-xs border rounded-xl focus:outline-none transition ${
                        signInErrors.identifier 
                          ? 'border-rose-500 bg-rose-50/50' 
                          : 'border-gray-300 focus:border-[#3b0910]'
                      }`}
                    />
                    <Mail className={`w-4 h-4 absolute left-3 top-3 ${signInErrors.identifier ? 'text-rose-400' : 'text-gray-400'}`} />
                  </div>
                  {signInErrors.identifier && (
                    <p className="text-[11px] text-rose-600 mt-1 font-medium flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 text-rose-600 shrink-0" />
                      {signInErrors.identifier}
                    </p>
                  )}
                </div>

                {/* Password Field with Eye Icon */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Password <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter Password"
                      value={signInPassword}
                      onChange={(e) => {
                        setSignInPassword(e.target.value);
                        if (signInErrors.password) setSignInErrors({...signInErrors, password: null});
                      }}
                      className={`w-full pl-9 pr-10 py-2.5 text-xs border rounded-xl focus:outline-none transition ${
                        signInErrors.password 
                          ? 'border-rose-500 bg-rose-50/50' 
                          : 'border-gray-300 focus:border-[#3b0910]'
                      }`}
                    />
                    <Lock className={`w-4 h-4 absolute left-3 top-3 ${signInErrors.password ? 'text-rose-400' : 'text-gray-400'}`} />
                    
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {signInErrors.password && (
                    <p className="text-[11px] text-rose-600 mt-1 font-medium flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 text-rose-600 shrink-0" />
                      {signInErrors.password}
                    </p>
                  )}
                </div>

                {/* Submit Sign In */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-[#3b0910] hover:bg-[#2b050a] text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sign In'}
                </button>

                {/* Divider */}
                <div className="flex items-center gap-3 my-3">
                  <div className="h-px bg-gray-200 flex-1"></div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">or</span>
                  <div className="h-px bg-gray-200 flex-1"></div>
                </div>

                {/* Google Login Button */}
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="w-full py-2.5 px-4 border border-gray-300 rounded-xl font-bold text-xs text-gray-800 bg-white hover:bg-gray-50 transition flex items-center justify-center gap-3"
                >
                  <GoogleIcon />
                  <span>Continue with Google</span>
                </button>

              </form>
            )}

            {/* 2. SIGN UP FORM */}
            {authMode === 'signup' && (
              <form onSubmit={handleSignUpSubmit} className="space-y-3.5" noValidate>
                
                {signUpErrors.general && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                    <span>{signUpErrors.general}</span>
                  </div>
                )}

                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={signUpName}
                      onChange={(e) => {
                        setSignUpName(e.target.value);
                        if (signUpErrors.name) setSignUpErrors({...signUpErrors, name: null});
                      }}
                      className={`w-full pl-9 pr-3 py-2.5 text-xs border rounded-xl focus:outline-none transition ${
                        signUpErrors.name 
                          ? 'border-rose-500 bg-rose-50/50' 
                          : 'border-gray-300 focus:border-[#3b0910]'
                      }`}
                    />
                    <User className={`w-4 h-4 absolute left-3 top-3 ${signUpErrors.name ? 'text-rose-400' : 'text-gray-400'}`} />
                  </div>
                  {signUpErrors.name && (
                    <p className="text-[11px] text-rose-600 mt-1 font-medium flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 text-rose-600 shrink-0" />
                      {signUpErrors.name}
                    </p>
                  )}
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="name@gmail.com"
                      value={signUpIdentifier}
                      onChange={(e) => {
                        setSignUpIdentifier(e.target.value);
                        if (signUpErrors.identifier) setSignUpErrors({...signUpErrors, identifier: null});
                      }}
                      className={`w-full pl-9 pr-3 py-2.5 text-xs border rounded-xl focus:outline-none transition ${
                        signUpErrors.identifier 
                          ? 'border-rose-500 bg-rose-50/50' 
                          : 'border-gray-300 focus:border-[#3b0910]'
                      }`}
                    />
                    <Mail className={`w-4 h-4 absolute left-3 top-3 ${signUpErrors.identifier ? 'text-rose-400' : 'text-gray-400'}`} />
                  </div>
                  {signUpErrors.identifier && (
                    <p className="text-[11px] text-rose-600 mt-1 font-medium flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 text-rose-600 shrink-0" />
                      {signUpErrors.identifier}
                    </p>
                  )}
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      placeholder="e.g. 9876543210"
                      value={signUpPhone}
                      onChange={(e) => {
                        setSignUpPhone(e.target.value);
                        if (signUpErrors.phone) setSignUpErrors({...signUpErrors, phone: null});
                      }}
                      className={`w-full pl-9 pr-3 py-2.5 text-xs border rounded-xl focus:outline-none transition ${
                        signUpErrors.phone 
                          ? 'border-rose-500 bg-rose-50/50' 
                          : 'border-gray-300 focus:border-[#3b0910]'
                      }`}
                    />
                    <Phone className={`w-4 h-4 absolute left-3 top-3 ${signUpErrors.phone ? 'text-rose-400' : 'text-gray-400'}`} />
                  </div>
                  {signUpErrors.phone && (
                    <p className="text-[11px] text-rose-600 mt-1 font-medium flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 text-rose-600 shrink-0" />
                      {signUpErrors.phone}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Password <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="At least 6 characters"
                      value={signUpPassword}
                      onChange={(e) => {
                        setSignUpPassword(e.target.value);
                        if (signUpErrors.password) setSignUpErrors({...signUpErrors, password: null});
                      }}
                      className={`w-full pl-9 pr-10 py-2.5 text-xs border rounded-xl focus:outline-none transition ${
                        signUpErrors.password 
                          ? 'border-rose-500 bg-rose-50/50' 
                          : 'border-gray-300 focus:border-[#3b0910]'
                      }`}
                    />
                    <Lock className={`w-4 h-4 absolute left-3 top-3 ${signUpErrors.password ? 'text-rose-400' : 'text-gray-400'}`} />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {signUpErrors.password && (
                    <p className="text-[11px] text-rose-600 mt-1 font-medium flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 text-rose-600 shrink-0" />
                      {signUpErrors.password}
                    </p>
                  )}
                </div>

                {/* Submit Sign Up */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-[#3b0910] hover:bg-[#2b050a] text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Account'}
                </button>

                {/* Divider */}
                <div className="flex items-center gap-3 my-2">
                  <div className="h-px bg-gray-200 flex-1"></div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">or</span>
                  <div className="h-px bg-gray-200 flex-1"></div>
                </div>

                {/* Google Login */}
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="w-full py-2.5 px-4 border border-gray-300 rounded-xl font-bold text-xs text-gray-800 bg-white hover:bg-gray-50 transition flex items-center justify-center gap-3"
                >
                  <GoogleIcon />
                  <span>Sign up with Google</span>
                </button>

              </form>
            )}

          </div>
        ) : (
          /* ------------------------------------------------------------- */
          /* STATE B: LOGGED IN -> CLEAN USER DETAILS CARD (NO EDIT FIELDS)  */
          /* ------------------------------------------------------------- */
          <div className="p-6 sm:p-8 space-y-6">
            
            {/* Header User Badge */}
            <div className="flex flex-col items-center text-center space-y-3 pt-2">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-20 h-20 rounded-full object-cover border-4 border-[#d4af37] shadow-md"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#3b0910] to-[#540d17] text-[#f3e5ab] font-bold text-3xl flex items-center justify-center font-serif shadow-md border-2 border-[#d4af37]">
                  {firstLetter}
                </div>
              )}

              <div>
                <h3 className="font-serif text-xl font-bold text-gray-900">{user.name}</h3>
                <span className="inline-flex items-center gap-1 text-emerald-700 text-[11px] font-bold mt-1 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Active Member
                </span>
              </div>
            </div>

            {/* Read-Only Account Info Display */}
            <div className="bg-[#faf6f0] p-4 rounded-2xl border border-[#d4af37]/30 space-y-3.5 text-xs">
              <div className="flex items-center gap-3 text-gray-800">
                <div className="p-2 bg-white rounded-xl shadow-xs border border-gray-200 text-[#3b0910]">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider">Full Name</span>
                  <span className="font-bold text-gray-900 text-xs">{user.name}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-gray-800">
                <div className="p-2 bg-white rounded-xl shadow-xs border border-gray-200 text-[#3b0910]">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider">Email Address</span>
                  <span className="font-medium text-gray-800 text-xs truncate block">{user.email}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-gray-800">
                <div className="p-2 bg-white rounded-xl shadow-xs border border-gray-200 text-[#3b0910]">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider">Phone Number</span>
                  <span className="font-mono text-gray-900 text-xs">{user.phone || 'Not provided'}</span>
                </div>
              </div>
            </div>

            {/* Sign Out Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  localStorage.removeItem('jkr_token');
                  localStorage.removeItem('jkr_user');
                  onLogout();
                  handleModalClose();
                }}
                className="w-full py-3 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-2xl transition flex items-center justify-center gap-2 border border-rose-200 shadow-xs"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
