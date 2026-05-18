import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Shield, Eye, EyeOff, Mail, Lock, User, Phone } from 'lucide-react';

type AuthMode = 'login' | 'signup';
type LoginTab = 'parent' | 'admin';

export default function AuthPage() {
  const { signIn, signUp, t } = useApp();

  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [loginTab, setLoginTab] = useState<LoginTab>('parent');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setFullName('');
    setPhone('');
    setConfirmPassword('');
    setShowPassword(false);
    setShowConfirmPassword(false);
    setError(null);
  };

  const switchToLogin = () => {
    setAuthMode('login');
    resetForm();
  };

  const switchToSignup = () => {
    setAuthMode('signup');
    resetForm();
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError(t('auth_error_fill_fields') || 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const result = await signIn(email, password);
      if (result.error) {
        setError(result.error);
      }
    } catch {
      setError(t('auth_error_unexpected') || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim() || !email.trim() || !phone.trim() || !password.trim() || !confirmPassword.trim()) {
      setError(t('auth_error_fill_fields') || 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError(t('auth_error_password_mismatch') || 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError(t('auth_error_password_length') || 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const result = await signUp(email, password, fullName, phone, 'user');
      if (result.error) {
        setError(result.error);
      }
    } catch {
      setError(t('auth_error_unexpected') || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: Shield,
      title: 'Real-Time Monitoring',
      desc: '"Every click, every message — know what your child encounters online before it becomes a threat."',
    },
    {
      icon: Mail,
      title: 'Instant Alerts',
      desc: '"When danger strikes, seconds matter. Get alerts the moment suspicious activity is detected."',
    },
    {
      icon: Lock,
      title: 'Safe Browsing',
      desc: '"Prevention is better than cure. Shield your child from harmful content before they see it."',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Side - Branding & Illustration (hidden on mobile) */}
      <div className="hidden md:flex md:w-1/2 lg:w-[45%] relative overflow-hidden flex-col justify-center items-center px-12 py-16 bg-gradient-to-br from-teal-700 via-teal-800 to-slate-900">
        {/* Decorative circles */}
        <div className="absolute top-[-80px] left-[-80px] w-64 h-64 rounded-full bg-teal-600/20 blur-2xl" />
        <div className="absolute bottom-[-60px] right-[-60px] w-80 h-80 rounded-full bg-slate-700/30 blur-2xl" />
        <div className="absolute top-1/3 right-10 w-40 h-40 rounded-full bg-teal-500/10 blur-xl" />

        <div className="relative z-10 flex flex-col items-center text-center max-w-md">
          {/* Logo */}
          <div className="mb-8 flex items-center justify-center w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10">
            <Shield className="w-10 h-10 text-teal-300" />
          </div>

          <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">
            NetWatch
          </h1>

          <p className="text-teal-200/80 text-lg mb-12 leading-relaxed">
            Protecting your children in the digital world
          </p>

          {/* Feature Highlights */}
          <div className="w-full space-y-6">
            {features.map((feature, idx) => (
              <div key={idx} className="flex items-start gap-4 text-left">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/5">
                  <feature.icon className="w-5 h-5 text-teal-300" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm">
                    {feature.title}
                  </h3>
                  <p className="text-teal-200/60 text-sm mt-0.5">
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom decorative line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-teal-400/40 to-transparent" />
      </div>

      {/* Right Side - Auth Form */}
      <div className="flex-1 flex flex-col min-h-screen bg-slate-50">
        {/* Mobile Logo (visible only on small screens) */}
        <div className="md:hidden flex items-center justify-center gap-3 pt-10 pb-6 bg-gradient-to-b from-teal-700 to-teal-800">
          <Shield className="w-8 h-8 text-teal-300" />
          <h1 className="text-2xl font-bold text-white tracking-tight">NetWatch</h1>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 py-12 md:py-16">
          <div className="w-full max-w-md">
            {/* Header */}
            <div className="mb-8 text-center md:text-left">
              <h2 className="text-2xl font-bold text-slate-800">
                {authMode === 'login'
                  ? 'Welcome Back to NetWatch'
                  : 'Create Your NetWatch Account'
                }
              </h2>
              <p className="text-slate-500 mt-2">
                {authMode === 'login'
                  ? 'Sign in to access your dashboard'
                  : 'Start protecting your family today'
                }
              </p>
            </div>

            {/* Login/Signup Tab Toggle */}
            <div className="flex mb-6 bg-slate-100 rounded-xl p-1">
              <button
                type="button"
                onClick={switchToLogin}
                className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                  authMode === 'login'
                    ? 'bg-white text-slate-800 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={switchToSignup}
                className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                  authMode === 'signup'
                    ? 'bg-white text-slate-800 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* ===== LOGIN FORM ===== */}
            {authMode === 'login' && (
              <form onSubmit={handleLogin} className="space-y-5">
                {/* Parent / Admin Tabs */}
                <div className="flex border-b border-slate-200">
                  <button
                    type="button"
                    onClick={() => { setLoginTab('parent'); setError(null); }}
                    className={`flex-1 pb-3 text-sm font-medium border-b-2 transition-colors duration-200 ${
                      loginTab === 'parent'
                        ? 'border-teal-600 text-teal-700'
                        : 'border-transparent text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    Parent Login
                  </button>
                  <button
                    type="button"
                    onClick={() => { setLoginTab('admin'); setError(null); }}
                    className={`flex-1 pb-3 text-sm font-medium border-b-2 transition-colors duration-200 ${
                      loginTab === 'admin'
                        ? 'border-teal-600 text-teal-700'
                        : 'border-transparent text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    Admin Login
                  </button>
                </div>

                {/* Admin notice */}
                {loginTab === 'admin' && (
                  <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs">
                    {t('auth_admin_notice')}
                  </div>
                )}

                {/* Email */}
                <div>
                  <label htmlFor="login-email" className="block text-sm font-medium text-slate-700 mb-1.5">
                    {t('auth_email')}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                    <input
                      id="login-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-colors"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="login-password" className="block text-sm font-medium text-slate-700 mb-1.5">
                    {t('auth_password')}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                    <input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-11 py-3 rounded-lg border border-slate-300 bg-white text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-colors"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                    </button>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-semibold text-sm shadow-sm shadow-teal-600/20 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <span>
                      {loginTab === 'admin'
                        ? 'Sign in as Admin'
                        : 'Sign In'
                      }
                    </span>
                  )}
                </button>
              </form>
            )}

            {/* ===== SIGNUP FORM ===== */}
            {authMode === 'signup' && (
              <form onSubmit={handleSignup} className="space-y-4">
                {/* Full Name */}
                <div>
                  <label htmlFor="signup-name" className="block text-sm font-medium text-slate-700 mb-1.5">
                    {t('auth_full_name')}
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                    <input
                      id="signup-name"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-colors"
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="signup-email" className="block text-sm font-medium text-slate-700 mb-1.5">
                    {t('auth_email')}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                    <input
                      id="signup-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-colors"
                      required
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="signup-phone" className="block text-sm font-medium text-slate-700 mb-1.5">
                    {t('auth_phone')}
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                    <input
                      id="signup-phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-colors"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="signup-password" className="block text-sm font-medium text-slate-700 mb-1.5">
                    {t('auth_password')}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                    <input
                      id="signup-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-11 py-3 rounded-lg border border-slate-300 bg-white text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-colors"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label htmlFor="signup-confirm" className="block text-sm font-medium text-slate-700 mb-1.5">
                    {t('auth_confirm_password')}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                    <input
                      id="signup-confirm"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-10 pr-11 py-3 rounded-lg border border-slate-300 bg-white text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-colors"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                    </button>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-semibold text-sm shadow-sm shadow-teal-600/20 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      <span>{t('auth_creating_account') || 'Creating account...'}</span>
                    </>
                  ) : (
                    <span>{t('auth_create_account_btn')}</span>
                  )}
                </button>
              </form>
            )}

            {/* Footer text */}
            <p className="mt-8 text-center text-xs text-slate-400">
              "Your child's safety is our priority. By continuing, you agree to our Terms of Service and Privacy Policy."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
