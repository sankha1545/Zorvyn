import {
  Dropdown,
  Chip,
  Avatar,
} from '@heroui/react';
import {
  Search,
  Menu,
  Shield,
  Eye,
  Sun,
  Moon,
  Bell,
  User,
  ChevronDown,
  Settings,
  X,
} from 'lucide-react';
import useStore from '../store/useStore';

export default function Topbar() {
  const role = useStore((s) => s.role);
  const setRole = useStore((s) => s.setRole);
  const theme = useStore((s) => s.theme);
  const toggleTheme = useStore((s) => s.toggleTheme);
  const globalSearch = useStore((s) => s.globalSearch);
  const setGlobalSearch = useStore((s) => s.setGlobalSearch);
  const setMobileSidebarOpen = useStore((s) => s.setMobileSidebarOpen);

  return (
    <header 
      className="sticky top-0 z-30 w-full backdrop-blur-xl"
      style={{
        backgroundColor: 'var(--bg-topbar)',
        borderColor: 'var(--border-subtle)',
        borderBottomWidth: '1px',
      }}
    >
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Left: Mobile menu + Search */}
        <div className="flex items-center gap-3 flex-1">
          <button
            className="lg:hidden p-1.5 rounded-lg transition-all cursor-pointer"
            style={{
              color: 'var(--text-secondary)',
            }}
            onMouseEnter={(e) => e.target.style.color = 'var(--text-primary)'}
            onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
            onClick={() => setMobileSidebarOpen(true)}
          >
            <Menu size={20} />
          </button>

          <div className="hidden sm:block w-full max-w-xs relative">
            <div className="relative">
              <Search 
                size={15} 
                className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: 'var(--text-muted)' }}
              />
              <input
                type="text"
                placeholder="Search transactions..."
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                style={{
                  backgroundColor: 'var(--bg-input)',
                  borderColor: 'var(--border-input)',
                  color: 'var(--text-primary)',
                }}
                className="w-full rounded-xl pl-9 pr-8 py-2 text-sm outline-none transition-all"
                onFocus={(e) => {
                  e.target.style.backgroundColor = 'var(--bg-surface)';
                  e.target.style.borderColor = '#6366f1';
                }}
                onBlur={(e) => {
                  e.target.style.backgroundColor = 'var(--bg-input)';
                  e.target.style.borderColor = 'var(--border-input)';
                }}
              />
              {globalSearch && (
                <button
                  onClick={() => setGlobalSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer transition-all"
                  style={{ color: 'var(--text-muted)' }}
                  onMouseEnter={(e) => e.target.style.color = 'var(--text-primary)'}
                  onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right: Role Switcher + Theme + Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Role Switcher */}
          <Dropdown>
            <Dropdown.Trigger>
              <button
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  role === 'admin'
                    ? 'bg-indigo-500/15 text-indigo-400 hover:bg-indigo-500/20'
                    : 'bg-amber-500/15 text-amber-400 hover:bg-amber-500/20'
                }`}
              >
                {role === 'admin' ? <Shield size={14} /> : <Eye size={14} />}
                <span className="hidden sm:inline">{role === 'admin' ? 'Admin' : 'Viewer'}</span>
                <ChevronDown size={12} />
              </button>
            </Dropdown.Trigger>
            <Dropdown.Popover 
              className="rounded-xl shadow-2xl p-1 min-w-[180px]"
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderColor: 'var(--border-subtle)',
                borderWidth: '1px',
              }}
            >
              <Dropdown.Menu aria-label="Role switcher">
                <Dropdown.Item
                  id="admin"
                  textValue="Admin"
                  onAction={() => setRole('admin')}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm cursor-pointer transition-colors ${
                    role === 'admin' ? 'bg-indigo-500/10 text-indigo-400' : 'hover:bg-slate-100 dark:hover:bg-white/[0.04]'
                  }`}
                  style={role !== 'admin' ? { color: 'var(--text-secondary)' } : {}}
                >
                  <Shield size={14} />
                  <div>
                    <div className="font-medium">Admin</div>
                    <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Full access to all features</div>
                  </div>
                </Dropdown.Item>
                <Dropdown.Item
                  id="viewer"
                  textValue="Viewer"
                  onAction={() => setRole('viewer')}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm cursor-pointer transition-colors ${
                    role === 'viewer' ? 'bg-amber-500/10 text-amber-400' : 'hover:bg-slate-100 dark:hover:bg-white/[0.04]'
                  }`}
                  style={role !== 'viewer' ? { color: 'var(--text-secondary)' } : {}}
                >
                  <Eye size={14} />
                  <div>
                    <div className="font-medium">Viewer</div>
                    <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Read-only access</div>
                  </div>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown.Popover>
          </Dropdown>

          {/* View Only Badge */}
          {role === 'viewer' && (
            <Chip className="hidden md:inline-flex bg-amber-500/10 text-amber-400 border-amber-500/20 text-[11px] font-medium px-2 py-0.5 rounded-lg">
              <Chip.Label>View Only</Chip.Label>
            </Chip>
          )}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl transition-all cursor-pointer"
            style={{
              color: 'var(--text-secondary)',
              backgroundColor: 'transparent',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--text-primary)';
              e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--text-secondary)';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Notifications */}
          <button 
            className="p-2 rounded-xl transition-all relative cursor-pointer"
            style={{
              color: 'var(--text-secondary)',
              backgroundColor: 'transparent',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--text-primary)';
              e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--text-secondary)';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full ring-2" style={{ ringColor: 'var(--bg-page)' }} />
          </button>

          {/* User Profile */}
          <Dropdown>
            <Dropdown.Trigger>
              <button className="flex items-center gap-2 outline-none cursor-pointer">
                <Avatar>
                  <Avatar.Fallback className="bg-gradient-to-br from-indigo-500 to-violet-600 text-white text-xs font-medium w-8 h-8 rounded-full flex items-center justify-center">
                    AM
                  </Avatar.Fallback>
                </Avatar>
                <div className="hidden md:block text-left">
                  <p className="text-xs font-semibold leading-tight" style={{ color: 'var(--text-primary)' }}>Alex Morgan</p>
                  <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>alex@fintrack.io</p>
                </div>
              </button>
            </Dropdown.Trigger>
            <Dropdown.Popover 
              className="rounded-xl shadow-2xl p-1 min-w-[160px]"
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderColor: 'var(--border-subtle)',
                borderWidth: '1px',
              }}
            >
              <Dropdown.Menu aria-label="User menu">
                <Dropdown.Item 
                  id="profile" 
                  textValue="Profile" 
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm cursor-pointer transition-colors"
                  style={{
                    color: 'var(--text-secondary)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover)';
                    e.currentTarget.style.color = 'var(--text-primary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                  }}
                >
                  <User size={14} />
                  Profile
                </Dropdown.Item>
                <Dropdown.Item 
                  id="settings" 
                  textValue="Settings" 
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm cursor-pointer transition-colors"
                  style={{
                    color: 'var(--text-secondary)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover)';
                    e.currentTarget.style.color = 'var(--text-primary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                  }}
                >
                  <Settings size={14} />
                  Settings
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown.Popover>
          </Dropdown>
        </div>
      </div>
    </header>
  );
}
