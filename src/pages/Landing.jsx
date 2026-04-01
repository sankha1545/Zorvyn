import { useState, useEffect } from 'react';
import { ArrowRight, BarChart3, Lock, Zap, TrendingUp, PieChart, Bell } from 'lucide-react';
import LandingNavbar from '../components/Landing/LandingNavbar';
import LandingFooter from '../components/Landing/LandingFooter';

export default function Landing({ onGetStarted, onLogin, onSignup }) {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: BarChart3,
      title: 'Smart Analytics',
      description: 'Real-time insights into your spending patterns and financial trends.',
      color: '#6366f1',
    },
    {
      icon: TrendingUp,
      title: 'Budget Tracking',
      description: 'Set budgets and get alerts when you exceed your limits.',
      color: '#f59e0b',
    },
    {
      icon: Lock,
      title: 'Secure & Private',
      description: 'Your financial data is encrypted and protected with industry standards.',
      color: '#10b981',
    },
    {
      icon: Bell,
      title: 'Smart Notifications',
      description: 'Never miss important financial events with real-time alerts.',
      color: '#8b5cf6',
    },
    {
      icon: PieChart,
      title: 'Visual Reports',
      description: 'Beautiful charts and reports to understand your finances at a glance.',
      color: '#ec4899',
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Instantly access your financial data with our optimized platform.',
      color: '#06b6d4',
    },
  ];

  return (
    <div style={{ backgroundColor: 'var(--bg-page)' }}>
      <LandingNavbar onLoginClick={onLogin} onSignupClick={onSignup} />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Animated background elements */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background: 'radial-gradient(circle at 20% 50%, rgba(99, 102, 241, 0.3) 0%, transparent 50%)',
            transform: `translateY(${scrollY * 0.5}px)`,
          }}
        ></div>
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background: 'radial-gradient(circle at 80% 50%, rgba(139, 92, 246, 0.3) 0%, transparent 50%)',
            transform: `translateY(${scrollY * 0.3}px)`,
          }}
        ></div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div
            className="mb-6 inline-block px-4 py-2 rounded-full border"
            style={{
              borderColor: 'var(--border-subtle)',
              backgroundColor: 'var(--bg-input)',
              animation: 'pulse 2s ease-in-out infinite',
            }}
          >
            <span className="text-sm font-medium bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
              ✨ Welcome to Smart Finance Management
            </span>
          </div>

          <h1
            className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
            style={{
              color: 'var(--text-primary)',
              animation: 'fadeInUp 0.8s ease-out',
            }}
          >
            Take Control of Your{' '}
            <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-500 bg-clip-text text-transparent">
              Finances
            </span>
          </h1>

          <p
            className="text-lg sm:text-xl mb-8 max-w-2xl mx-auto"
            style={{
              color: 'var(--text-muted)',
              animation: 'fadeInUp 0.8s ease-out 0.1s backwards',
            }}
          >
            FinTrack is your intelligent financial companion. Track transactions, analyze spending, and achieve your financial goals with ease.
          </p>

          <div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            style={{ animation: 'fadeInUp 0.8s ease-out 0.2s backwards' }}
          >
            <button
              onClick={onGetStarted}
              className="px-8 py-4 text-lg font-semibold text-white rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 transition-all transform hover:scale-105 shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2"
            >
              Get Started Now
              <ArrowRight size={20} />
            </button>
            <button
              onClick={onLogin}
              className="px-8 py-4 text-lg font-semibold rounded-xl border-2 transition-all transform hover:scale-105"
              style={{
                borderColor: 'var(--border-subtle)',
                color: 'var(--text-primary)',
                backgroundColor: 'var(--bg-surface-hover)',
              }}
            >
              Watch Demo
            </button>
          </div>
        </div>

        {/* Floating cards animation */}
        <div className="absolute bottom-10 left-5 w-40 h-32 rounded-xl p-4 shadow-xl" style={{ backgroundColor: 'var(--bg-surface)', animation: 'float 4s ease-in-out infinite' }}>
          <div className="w-full h-2 bg-gradient-to-r from-indigo-500 to-violet-500 rounded mb-3"></div>
          <div className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>Income</div>
          <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>$5,200</div>
        </div>

        <div className="absolute bottom-32 right-5 w-40 h-32 rounded-xl p-4 shadow-xl" style={{ backgroundColor: 'var(--bg-surface)', animation: 'float 5s ease-in-out infinite 0.5s' }}>
          <div className="w-full h-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded mb-3"></div>
          <div className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>Expenses</div>
          <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>$1,850</div>
        </div>

        <style>{`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes float {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-20px);
            }
          }
          @keyframes pulse {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.5;
            }
          }
        `}</style>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
              Powerful Features
            </h2>
            <p className="text-lg" style={{ color: 'var(--text-muted)' }}>
              Everything you need to manage your finances effectively
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="p-6 rounded-2xl transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer group"
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    animation: `fadeInUp 0.6s ease-out ${index * 0.1}s backwards`,
                  }}
                >
                  <div
                    className="w-14 h-14 rounded-xl mb-4 flex items-center justify-center group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: `${feature.color}20` }}
                  >
                    <Icon size={28} style={{ color: feature.color }} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                    {feature.title}
                  </h3>
                  <p style={{ color: 'var(--text-muted)' }}>{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: 'var(--bg-surface)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl sm:text-5xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
                Why Choose FinTrack?
              </h2>
              <ul className="space-y-4">
                {[
                  'Real-time transaction tracking and analytics',
                  'Beautiful visualizations of your financial data',
                  'Secure and encrypted data storage',
                  'Intuitive and user-friendly interface',
                  'Works seamlessly across all devices',
                  'Free to use with premium features coming soon',
                ].map((item, index) => (
                  <li key={index} className="flex gap-3 items-start">
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center mt-0.5 shrink-0">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <span style={{ color: 'var(--text-primary)' }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl group cursor-pointer">
              <div
                className="absolute inset-0"
                style={{
                  backgroundColor: 'var(--bg-input)',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  opacity: 0.2,
                }}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">📊</div>
                  <p className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                    Professional Grade Analytics
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
            Ready to Take Control?
          </h2>
          <p className="text-xl mb-8" style={{ color: 'var(--text-muted)' }}>
            Join thousands of users who are already managing their finances smarter.
          </p>
          <button
            onClick={onGetStarted}
            className="px-10 py-4 text-lg font-semibold text-white rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 transition-all transform hover:scale-105 shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 mx-auto"
          >
            Get Started Free
            <ArrowRight size={20} />
          </button>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
