import { Code, Share2, Mail, Globe } from 'lucide-react';

export default function LandingFooter() {
  return (
    <footer className="relative" style={{ backgroundColor: 'var(--bg-surface)' }}>
      {/* Gradient divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-20"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company */}
          <div>
            <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
              <span className="bg-gradient-to-r from-indigo-500 to-violet-600 bg-clip-text text-transparent">FinTrack</span>
            </h3>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Smart financial management for everyone. Track, analyze, and optimize your finances.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Product</h4>
            <ul className="space-y-2 text-sm" style={{ color: 'var(--text-muted)' }}>
              <li><a href="#features" className="hover:text-indigo-400 transition-colors">Features</a></li>
              <li><a href="#pricing" className="hover:text-indigo-400 transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Security</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Roadmap</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Company</h4>
            <ul className="space-y-2 text-sm" style={{ color: 'var(--text-muted)' }}>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Connect</h4>
            <div className="flex gap-4">
              <a href="#" className="p-2 rounded-lg transition-colors hover:text-indigo-400" style={{ backgroundColor: 'var(--bg-input)', color: 'var(--text-secondary)' }}>
                <Code size={18} />
              </a>
              <a href="#" className="p-2 rounded-lg transition-colors hover:text-indigo-400" style={{ backgroundColor: 'var(--bg-input)', color: 'var(--text-secondary)' }}>
                <Share2 size={18} />
              </a>
              <a href="#" className="p-2 rounded-lg transition-colors hover:text-indigo-400" style={{ backgroundColor: 'var(--bg-input)', color: 'var(--text-secondary)' }}>
                <Globe size={18} />
              </a>
              <a href="#" className="p-2 rounded-lg transition-colors hover:text-indigo-400" style={{ backgroundColor: 'var(--bg-input)', color: 'var(--text-secondary)' }}>
                <Mail size={18} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div 
          className="pt-8 border-t flex flex-col sm:flex-row justify-between items-center gap-4"
          style={{ borderColor: 'var(--border-subtle)' }}
        >
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            © 2026 FinTrack. All rights reserved.
          </p>
          <div className="flex gap-8 text-sm" style={{ color: 'var(--text-muted)' }}>
            <a href="#" className="hover:text-indigo-400 transition-colors">Privacy</a>
            <a href="#" className="hover:text-indigo-400 transition-colors">Terms</a>
            <a href="#" className="hover:text-indigo-400 transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
