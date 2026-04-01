import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function LandingNavbar({ onLoginClick, onSignupClick }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 backdrop-blur-xl" style={{ backgroundColor: 'var(--bg-topbar)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-violet-600 bg-clip-text text-transparent">
              FinTrack
            </h1>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <a 
              href="#features" 
              className="text-sm font-medium transition-colors hover:text-indigo-400"
              style={{ color: 'var(--text-secondary)' }}
            >
              Features
            </a>
            <a 
              href="#about" 
              className="text-sm font-medium transition-colors hover:text-indigo-400"
              style={{ color: 'var(--text-secondary)' }}
            >
              About
            </a>
            <a 
              href="#pricing" 
              className="text-sm font-medium transition-colors hover:text-indigo-400"
              style={{ color: 'var(--text-secondary)' }}
            >
              Pricing
            </a>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={onLoginClick}
              className="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
              style={{ color: 'var(--text-primary)', backgroundColor: 'var(--bg-surface-hover)' }}
            >
              Login
            </button>
            <button
              onClick={onSignupClick}
              className="px-6 py-2 text-sm font-medium text-white rounded-lg bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 transition-all shadow-lg shadow-indigo-500/25"
            >
              Get Started
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg transition-colors"
            style={{ color: 'var(--text-secondary)' }}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-gradient-to-b" style={{ backgroundColor: 'var(--bg-surface)' }}>
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href="#features" className="block px-3 py-2 rounded-lg text-sm font-medium transition-colors" style={{ color: 'var(--text-secondary)' }}>Features</a>
              <a href="#about" className="block px-3 py-2 rounded-lg text-sm font-medium transition-colors" style={{ color: 'var(--text-secondary)' }}>About</a>
              <a href="#pricing" className="block px-3 py-2 rounded-lg text-sm font-medium transition-colors" style={{ color: 'var(--text-secondary)' }}>Pricing</a>
              <div className="pt-4 space-y-2 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                <button onClick={onLoginClick} className="w-full px-4 py-2 text-sm font-medium rounded-lg transition-colors" style={{ color: 'var(--text-primary)', backgroundColor: 'var(--bg-surface-hover)' }}>Login</button>
                <button onClick={onSignupClick} className="w-full px-4 py-2 text-sm font-medium text-white rounded-lg bg-gradient-to-r from-indigo-500 to-violet-600">Get Started</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
