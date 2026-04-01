import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, User, Check } from 'lucide-react';

export default function Signup({ onSignupSuccess, onLoginClick }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Name is required');
      return false;
    }
    if (!formData.email.includes('@')) {
      setError('Please enter a valid email');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSignup = () => {
    setError('');
    if (!validateForm()) return;

    setIsLoading(true);
    // Simulate signup
    setTimeout(() => {
      setIsLoading(false);
      onSignupSuccess();
    }, 1500);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ backgroundColor: 'var(--bg-page)' }}>
      {/* Animated background */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background: 'radial-gradient(circle at 80% 50%, rgba(168, 85, 247, 0.3) 0%, transparent 50%)',
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
              Create Account
            </h2>
            <p className="text-sm text-center" style={{ color: 'var(--text-muted)' }}>
              Start managing your finances today
            </p>
          </div>

          {/* Full Name Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
              Full Name
            </label>
            <div
              className="flex items-center border-2 rounded-lg px-4 py-3 transition-colors"
              style={{
                borderColor: error ? '#ef4444' : 'var(--border-input)',
                backgroundColor: 'var(--bg-input)',
              }}
            >
              <User size={18} style={{ color: 'var(--text-muted)' }} />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                className="flex-1 ml-3 outline-none bg-transparent text-sm"
                style={{ color: 'var(--text-primary)' }}
              />
            </div>
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
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                className="flex-1 ml-3 outline-none bg-transparent text-sm"
                style={{ color: 'var(--text-primary)' }}
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="mb-4">
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
                name="password"
                value={formData.password}
                onChange={handleInputChange}
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

          {/* Confirm Password Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
              Confirm Password
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
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm your password"
                className="flex-1 ml-3 outline-none bg-transparent text-sm"
                style={{ color: 'var(--text-primary)' }}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="transition-colors"
                style={{ color: 'var(--text-muted)' }}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 rounded-lg text-sm" style={{ backgroundColor: '#ef4444' + '1a', color: '#ef4444' }}>
              {error}
            </div>
          )}

          {/* Requirements */}
          <div className="mb-6">
            <p className="text-xs font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
              Password Requirements:
            </p>
            <div className="space-y-1 text-xs" style={{ color: 'var(--text-muted)' }}>
              <div className="flex items-center gap-2">
                <Check size={14} style={{ color: formData.password.length >= 6 ? '#10b981' : '#d1d5db' }} />
                At least 6 characters
              </div>
            </div>
          </div>

          {/* Sign Up Button */}
          <button
            onClick={handleSignup}
            disabled={isLoading}
            className="w-full py-3 rounded-lg text-white font-semibold transition-all flex items-center justify-center gap-2 mb-4 bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-600 hover:to-indigo-700 disabled:opacity-50"
          >
            {isLoading ? 'Creating account...' : 'Create Account'}
            {!isLoading && <ArrowRight size={18} />}
          </button>

          {/* Sign In Link */}
          <p style={{ color: 'var(--text-muted)' }} className="text-sm text-center">
            Already have an account?{' '}
            <button onClick={onLoginClick} className="text-indigo-500 font-semibold hover:text-indigo-400 transition-colors">
              Sign in
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
