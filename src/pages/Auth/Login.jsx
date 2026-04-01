import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Code } from 'lucide-react';

export default function Login({ onLoginSuccess, onSignupClick }) {
  const [email, setEmail] = useState('recruiter@fintrack.io');
  const [password, setPassword] = useState('Demo@12345');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = () => {
    setError('');
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email');
      return;
    }

    setIsLoading(true);
    // Simulate login
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess();
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ backgroundColor: 'var(--bg-page)' }}>
      {/* Animated background */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background: 'radial-gradient(circle at 20% 50%, rgba(99, 102, 241, 0.3) 0%, transparent 50%)',
        }}
      ></div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div
          className="rounded-2xl shadow-2xl p-8 backdrop-blur-xl border"
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderColor: 'var(--border-subtle)',
            animation: 'slideInUp 0.6s ease-out',
          }}
        >
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-center mb-4">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-500 to-violet-600 bg-clip-text text-transparent">
                FinTrack
              </h1>
            </div>
            <h2 className="text-2xl font-bold text-center mb-2" style={{ color: 'var(--text-primary)' }}>
              Welcome Back
            </h2>
            <p className="text-sm text-center" style={{ color: 'var(--text-muted)' }}>
              Sign in to access your dashboard
            </p>
          </div>

          {/* Demo Info */}
          <div
            className="mb-6 p-3 rounded-lg border"
            style={{
              backgroundColor: '#6366f1' + '1a',
              borderColor: '#6366f1' + '40',
            }}
          >
            <p className="text-xs" style={{ color: '#6366f1' }}>
              Demo credentials are pre-filled. Click "Sign In" to continue.
            </p>
          </div>

          {/* Email Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
              Email Address
            </label>
            <div
              className="flex items-center border-2 rounded-lg px-4 py-3 transition-colors"
              style={{
                borderColor: error ? '#ef4444' : 'var(--border-input)',
                backgroundColor: 'var(--bg-input)',
              }}
            >
              <Mail size={18} style={{ color: 'var(--text-muted)' }} />
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                placeholder="Enter your email"
                className="flex-1 ml-3 outline-none bg-transparent text-sm"
                style={{ color: 'var(--text-primary)' }}
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
              Password
            </label>
            <div
              className="flex items-center border-2 rounded-lg px-4 py-3 transition-colors"
              style={{
                borderColor: error ? '#ef4444' : 'var(--border-input)',
                backgroundColor: 'var(--bg-input)',
              }}
            >
              <Lock size={18} style={{ color: 'var(--text-muted)' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                placeholder="Enter your password"
                className="flex-1 ml-3 outline-none bg-transparent text-sm"
                style={{ color: 'var(--text-primary)' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="transition-colors"
                style={{ color: 'var(--text-muted)' }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 rounded-lg text-sm" style={{ backgroundColor: '#ef4444' + '1a', color: '#ef4444' }}>
              {error}
            </div>
          )}

          {/* Sign In Button */}
          <button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full py-3 rounded-lg text-white font-semibold transition-all flex items-center justify-center gap-2 mb-4 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 disabled:opacity-50"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
            {!isLoading && <ArrowRight size={18} />}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1 h-px" style={{ backgroundColor: 'var(--border-subtle)' }}></div>
            <span style={{ color: 'var(--text-muted)' }} className="text-xs">OR</span>
            <div className="flex-1 h-px" style={{ backgroundColor: 'var(--border-subtle)' }}></div>
          </div>

          {/* Social Login */}
          <button
            className="w-full py-3 rounded-lg font-semibold transition-all border-2 mb-6"
            style={{
              borderColor: 'var(--border-subtle)',
              color: 'var(--text-primary)',
              backgroundColor: 'var(--bg-surface-hover)',
            }}
          >
            <Code size={18} className="inline mr-2" />
            Continue with Dev
          </button>

          {/* Sign Up Link */}
          <p style={{ color: 'var(--text-muted)' }} className="text-sm text-center">
            Don't have an account?{' '}
            <button onClick={onSignupClick} className="text-indigo-500 font-semibold hover:text-indigo-400 transition-colors">
              Create one
            </button>
          </p>
        </div>

        <style>{`
          @keyframes slideInUp {
            from {
              opacity: 0;
              transform: translateY(40px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </div>
    </div>
  );
}
