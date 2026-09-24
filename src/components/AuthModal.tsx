import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  Mail,
  User,
  School,
  Phone,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  KeyRound,
} from 'lucide-react';
import { InstitutionType, BillingTier, UserAccount, InstitutionProfile } from '../types';
import { DEMO_USERS } from '../data/mockData';

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: 'signin' | 'signup';
  selectedPlan?: BillingTier;
  onClose: () => void;
  onAuthSuccess: (user: UserAccount, customInstitution?: Partial<InstitutionProfile>) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode = 'signin',
  selectedPlan,
  onClose,
  onAuthSuccess,
}) => {
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Sign In State
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Sign Up State
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPhone, setSignUpPhone] = useState('');
  const [signUpSchoolName, setSignUpSchoolName] = useState('');
  const [signUpType, setSignUpType] = useState<InstitutionType>('school');
  const [signUpCurrency, setSignUpCurrency] = useState('NGN');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState('');
  const [agreedTerms, setAgreedTerms] = useState(true);

  // Forgot Password State
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  useEffect(() => {
    setMode(initialMode);
    setErrorMsg(null);
    setSuccessMsg(null);
  }, [initialMode, isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Currency symbol helper
  const getCurrencySymbol = (curr: string) => {
    switch (curr) {
      case 'USD':
        return '$';
      case 'GHS':
        return 'GH₵';
      case 'KES':
        return 'KSh';
      default:
        return '₦';
    }
  };

  // Quick Demo Account Sign-in
  const handleQuickDemoSignIn = (demoUser: UserAccount) => {
    setIsLoading(true);
    setErrorMsg(null);
    setTimeout(() => {
      setIsLoading(false);
      onAuthSuccess(demoUser);
      onClose();
    }, 400);
  };

  // Regular Sign In
  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!signInEmail || !signInPassword) {
      setErrorMsg('Please enter both your email and password.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);

      // Check stored custom accounts
      let customUsers: UserAccount[] = [];
      try {
        const stored = localStorage.getItem('edupay_registered_users');
        if (stored) customUsers = JSON.parse(stored);
      } catch (err) {
        console.error(err);
      }

      // Check if matches demo user or stored user
      const matchedDemo = DEMO_USERS.find(
        (u) => u.email.toLowerCase() === signInEmail.trim().toLowerCase()
      );
      const matchedCustom = customUsers.find(
        (u) => u.email.toLowerCase() === signInEmail.trim().toLowerCase()
      );

      const matched = matchedCustom || matchedDemo;

      if (matched) {
        onAuthSuccess(matched);
        onClose();
      } else {
        // Fallback: create dynamic session user so tester can log in with any email
        const newUser: UserAccount = {
          id: `usr_${Date.now()}`,
          fullName: signInEmail.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
          email: signInEmail.trim(),
          phone: '+234 800 000 0000',
          role: 'bursar',
          institutionName: 'Main Campus Academy',
          institutionType: 'school',
          currency: 'NGN',
          currencySymbol: '₦',
          preferredPlan: 'pro',
          createdAt: new Date().toISOString(),
        };
        onAuthSuccess(newUser);
        onClose();
      }
    }, 500);
  };

  // Regular Sign Up
  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!signUpName.trim()) {
      setErrorMsg('Please enter your full administrator name.');
      return;
    }
    if (!signUpSchoolName.trim()) {
      setErrorMsg('Please enter your school or academy name.');
      return;
    }
    if (!signUpEmail.trim() || !signUpEmail.includes('@')) {
      setErrorMsg('Please enter a valid institution email address.');
      return;
    }
    if (signUpPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }
    if (signUpPassword !== signUpConfirmPassword) {
      setErrorMsg('Passwords do not match. Please verify both fields.');
      return;
    }
    if (!agreedTerms) {
      setErrorMsg('Please accept the Terms of Service to proceed.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);

      const symbol = getCurrencySymbol(signUpCurrency);

      const newAccount: UserAccount = {
        id: `usr_${Date.now()}`,
        fullName: signUpName.trim(),
        email: signUpEmail.trim().toLowerCase(),
        phone: signUpPhone.trim() || '+234 800 000 0000',
        role: 'bursar',
        institutionName: signUpSchoolName.trim(),
        institutionType: signUpType,
        currency: signUpCurrency,
        currencySymbol: symbol,
        preferredPlan: selectedPlan || 'pro',
        createdAt: new Date().toISOString(),
      };

      // Save to registered users pool
      try {
        const stored = localStorage.getItem('edupay_registered_users');
        const list: UserAccount[] = stored ? JSON.parse(stored) : [];
        list.push(newAccount);
        localStorage.setItem('edupay_registered_users', JSON.stringify(list));
      } catch (err) {
        console.error(err);
      }

      // Also customize initial institution profile
      const customProfile: Partial<InstitutionProfile> = {
        name: signUpSchoolName.trim(),
        email: signUpEmail.trim().toLowerCase(),
        phone: signUpPhone.trim() || '+234 800 000 0000',
        type: signUpType,
        currency: signUpCurrency,
        currencySymbol: symbol,
        tagline:
          signUpType === 'school'
            ? 'Excellence in Academic Foundations & Moral Leadership'
            : signUpType === 'tutorial_center'
            ? 'Top Scores in WAEC, JAMB & Professional Examinations'
            : 'Industry-Ready Digital & Vocational Skills Academy',
      };

      onAuthSuccess(newAccount, customProfile);
      onClose();
    }, 600);
  };

  // Forgot Password handler
  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail || !forgotEmail.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setForgotSuccess(true);
      setErrorMsg(null);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg my-8 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ribbon */}
        <div className="bg-slate-900 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500 text-sm font-bold text-white shadow-xs">
              EP
            </span>
            <div>
              <h2 className="text-base font-bold tracking-tight">EduPay Ledger</h2>
              <p className="text-xs text-slate-300">
                {mode === 'signin' && 'Sign in to access school fee bursary portal'}
                {mode === 'signup' && 'Create your institution fee management account'}
                {mode === 'forgot' && 'Reset administrator access password'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Mode Selector Tabs (Sign In vs Sign Up) */}
        {mode !== 'forgot' && (
          <div className="flex border-b border-slate-200 bg-slate-50/70 p-1.5">
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setErrorMsg(null);
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors ${
                mode === 'signin'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setErrorMsg(null);
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors ${
                mode === 'signup'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Create Account (Sign Up)
            </button>
          </div>
        )}

        {/* Feedback Messages */}
        <div className="p-6 pt-5">
          {errorMsg && (
            <div className="mb-4 flex items-center gap-2 rounded-lg bg-rose-50 border border-rose-200 p-3 text-xs text-rose-800">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}
          {successMsg && (
            <div className="mb-4 flex items-center gap-2 rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* ===================== SIGN IN FORM ===================== */}
          {mode === 'signin' && (
            <div>
              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Official Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="email"
                      value={signInEmail}
                      onChange={(e) => setSignInEmail(e.target.value)}
                      placeholder="bursar@apexhorizon.edu.ng"
                      className="w-full rounded-lg border border-slate-300 pl-9 pr-3 py-2 text-sm focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-hidden"
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-medium text-slate-700">Password</label>
                    <button
                      type="button"
                      onClick={() => {
                        setMode('forgot');
                        setForgotSuccess(false);
                        setErrorMsg(null);
                      }}
                      className="text-xs text-emerald-600 hover:underline font-medium"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={signInPassword}
                      onChange={(e) => setSignInPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded-lg border border-slate-300 pl-9 pr-10 py-2 text-sm focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-hidden"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-600">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                    />
                    <span>Remember my bursary session</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 rounded-lg bg-emerald-600 py-2.5 px-4 text-sm font-semibold text-white shadow-xs hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-70 transition-colors"
                >
                  {isLoading ? (
                    <span>Authenticating...</span>
                  ) : (
                    <>
                      <span>Sign In to Bursary Dashboard</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Quick Demo Logins Section */}
              <div className="mt-6 pt-5 border-t border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                    Instant Demo Logins (1-Click)
                  </span>
                  <span className="text-[11px] text-slate-400">Pre-seeded accounts</span>
                </div>
                <div className="space-y-1.5">
                  {DEMO_USERS.map((demoUser) => (
                    <button
                      key={demoUser.id}
                      type="button"
                      onClick={() => handleQuickDemoSignIn(demoUser)}
                      className="w-full flex items-center justify-between p-2.5 rounded-lg border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50 transition-colors text-left group"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="h-7 w-7 rounded-md bg-slate-100 group-hover:bg-emerald-100 flex items-center justify-center text-xs font-bold text-slate-700 group-hover:text-emerald-800">
                          {demoUser.role === 'bursar' ? '🏫' : demoUser.role === 'director' ? '📚' : '💻'}
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-slate-900 group-hover:text-emerald-950">
                            {demoUser.fullName}
                          </div>
                          <div className="text-[11px] text-slate-500 truncate max-w-[240px]">
                            {demoUser.institutionName}
                          </div>
                        </div>
                      </div>
                      <span className="text-[11px] font-medium text-emerald-600 group-hover:underline">
                        Sign In →
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ===================== SIGN UP FORM ===================== */}
          {mode === 'signup' && (
            <div>
              <form onSubmit={handleSignUp} className="space-y-3.5">
                {selectedPlan && (
                  <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-2.5 text-xs text-emerald-800 flex items-center justify-between">
                    <span>
                      Selected Plan:{' '}
                      <strong className="capitalize">{selectedPlan} Plan</strong>
                    </span>
                    <span className="text-emerald-700 font-medium">14-Day Free Trial</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Administrator Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        value={signUpName}
                        onChange={(e) => setSignUpName(e.target.value)}
                        placeholder="Dr. Samuel Adeleke"
                        className="w-full rounded-lg border border-slate-300 pl-9 pr-3 py-1.5 text-xs focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-hidden"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Institution Type *
                    </label>
                    <select
                      value={signUpType}
                      onChange={(e) => setSignUpType(e.target.value as InstitutionType)}
                      className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-hidden bg-white"
                    >
                      <option value="school">K-12 Primary &amp; Secondary School</option>
                      <option value="tutorial_center">WAEC / JAMB Tutorial Center</option>
                      <option value="training_academy">Tech &amp; Vocational Academy</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    School or Academy Name *
                  </label>
                  <div className="relative">
                    <School className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      value={signUpSchoolName}
                      onChange={(e) => setSignUpSchoolName(e.target.value)}
                      placeholder="Greenfield Model Academy"
                      className="w-full rounded-lg border border-slate-300 pl-9 pr-3 py-1.5 text-xs focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-hidden"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Official Work Email *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                      <input
                        type="email"
                        value={signUpEmail}
                        onChange={(e) => setSignUpEmail(e.target.value)}
                        placeholder="bursar@greenfield.edu.ng"
                        className="w-full rounded-lg border border-slate-300 pl-9 pr-3 py-1.5 text-xs focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-hidden"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Phone (for SMS/WhatsApp)
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                      <input
                        type="tel"
                        value={signUpPhone}
                        onChange={(e) => setSignUpPhone(e.target.value)}
                        placeholder="+234 803 123 4567"
                        className="w-full rounded-lg border border-slate-300 pl-9 pr-3 py-1.5 text-xs focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-hidden"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-1">
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Currency
                    </label>
                    <select
                      value={signUpCurrency}
                      onChange={(e) => setSignUpCurrency(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-hidden bg-white"
                    >
                      <option value="NGN">NGN (₦)</option>
                      <option value="USD">USD ($)</option>
                      <option value="GHS">GHS (GH₵)</option>
                      <option value="KES">KES (KSh)</option>
                    </select>
                  </div>

                  <div className="sm:col-span-1">
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Password *
                    </label>
                    <input
                      type="password"
                      value={signUpPassword}
                      onChange={(e) => setSignUpPassword(e.target.value)}
                      placeholder="Min 6 chars"
                      className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-hidden"
                      required
                    />
                  </div>

                  <div className="sm:col-span-1">
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Confirm *
                    </label>
                    <input
                      type="password"
                      value={signUpConfirmPassword}
                      onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-hidden"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-start gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={agreedTerms}
                    onChange={(e) => setAgreedTerms(e.target.checked)}
                    className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                  />
                  <label htmlFor="terms" className="text-[11px] text-slate-600">
                    I agree to EduPay&apos;s Terms of Service, NDPR School Data Privacy and Automated
                    Fee Collection policy.
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 rounded-lg bg-emerald-600 py-2.5 px-4 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-70 transition-colors mt-2"
                >
                  {isLoading ? (
                    <span>Creating School Account...</span>
                  ) : (
                    <>
                      <span>Complete Registration &amp; Open Portal</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setMode('signin');
                    setErrorMsg(null);
                  }}
                  className="text-xs text-slate-600 hover:text-emerald-700 font-medium"
                >
                  Already have an account? <span className="text-emerald-600 underline">Sign in</span>
                </button>
              </div>
            </div>
          )}

          {/* ===================== FORGOT PASSWORD ===================== */}
          {mode === 'forgot' && (
            <div>
              {forgotSuccess ? (
                <div className="text-center py-4 space-y-3">
                  <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">Reset Link Sent</h3>
                  <p className="text-xs text-slate-600 max-w-sm mx-auto">
                    We have sent password recovery instructions and a secure one-time PIN to{' '}
                    <strong>{forgotEmail}</strong>.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signin');
                      setErrorMsg(null);
                    }}
                    className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-colors"
                  >
                    Return to Sign In
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotSubmit} className="space-y-4">
                  <div className="text-xs text-slate-600 mb-2">
                    Enter the email registered with your school account and we will send you a reset link.
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Account Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                      <input
                        type="email"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="bursar@apexhorizon.edu.ng"
                        className="w-full rounded-lg border border-slate-300 pl-9 pr-3 py-2 text-sm focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-hidden"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 rounded-lg bg-emerald-600 py-2.5 px-4 text-sm font-semibold text-white shadow-xs hover:bg-emerald-700 disabled:opacity-70 transition-colors"
                  >
                    <KeyRound className="h-4 w-4" />
                    <span>Send Password Reset Instructions</span>
                  </button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setMode('signin');
                        setErrorMsg(null);
                      }}
                      className="text-xs text-slate-600 hover:text-emerald-700 font-medium"
                    >
                      ← Back to Sign In
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Security Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            256-Bit SSL Encrypted &amp; Paystack Certified
          </span>
          <span>NDPR Compliant</span>
        </div>
      </div>
    </div>
  );
};
