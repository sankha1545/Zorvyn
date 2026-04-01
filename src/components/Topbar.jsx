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
    <header className="sticky top-0 z-30 w-full border-b border-white/[0.06] bg-zinc-950/80 backdrop-blur-xl">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Left: Mobile menu + Search */}
        <div className="flex items-center gap-3 flex-1">
          <button
            className="lg:hidden text-zinc-400 hover:text-zinc-200 p-1.5 rounded-lg hover:bg-white/[0.04] cursor-pointer"
            onClick={() => setMobileSidebarOpen(true)}
          >
            <Menu size={20} />
          </button>

          <div className="hidden sm:block w-full max-w-xs relative">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                className="w-full bg-white/[0.04] border border-white/[0.06] rounded-xl pl-9 pr-8 py-2 text-sm text-zinc-300 placeholder-zinc-600 outline-none focus:border-indigo-500/50 focus:bg-white/[0.06] transition-all"
              />
              {globalSearch && (
                <button
                  onClick={() => setGlobalSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 cursor-pointer"
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
            <Dropdown.Popover className="bg-zinc-900 border border-white/[0.08] rounded-xl shadow-2xl shadow-black/40 p-1 min-w-[180px]">
              <Dropdown.Menu aria-label="Role switcher">
                <Dropdown.Item
                  id="admin"
                  textValue="Admin"
                  onAction={() => setRole('admin')}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm cursor-pointer transition-colors ${
                    role === 'admin' ? 'bg-indigo-500/10 text-indigo-400' : 'text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200'
                  }`}
                >
                  <Shield size={14} />
                  <div>
                    <div className="font-medium">Admin</div>
                    <div className="text-[10px] text-zinc-500">Full access to all features</div>
                  </div>
                </Dropdown.Item>
                <Dropdown.Item
                  id="viewer"
                  textValue="Viewer"
                  onAction={() => setRole('viewer')}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm cursor-pointer transition-colors ${
                    role === 'viewer' ? 'bg-amber-500/10 text-amber-400' : 'text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200'
                  }`}
                >
                  <Eye size={14} />
                  <div>
                    <div className="font-medium">Viewer</div>
                    <div className="text-[10px] text-zinc-500">Read-only access</div>
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
            className="text-zinc-500 hover:text-zinc-200 p-2 rounded-xl hover:bg-white/[0.04] transition-all cursor-pointer"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Notifications */}
          <button className="text-zinc-500 hover:text-zinc-200 p-2 rounded-xl hover:bg-white/[0.04] transition-all relative cursor-pointer">
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full ring-2 ring-zinc-950" />
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
                  <p className="text-xs font-semibold text-zinc-200 leading-tight">Alex Morgan</p>
                  <p className="text-[10px] text-zinc-500">alex@fintrack.io</p>
                </div>
              </button>
            </Dropdown.Trigger>
            <Dropdown.Popover className="bg-zinc-900 border border-white/[0.08] rounded-xl shadow-2xl shadow-black/40 p-1 min-w-[160px]">
              <Dropdown.Menu aria-label="User menu">
                <Dropdown.Item id="profile" textValue="Profile" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200 cursor-pointer">
                  <User size={14} />
                  Profile
                </Dropdown.Item>
                <Dropdown.Item id="settings" textValue="Settings" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200 cursor-pointer">
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
