import { Tooltip } from '@heroui/react';
import {
  LayoutDashboard,
  ArrowLeftRight,
  Settings,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  X,
} from 'lucide-react';
import useStore from '../store/useStore';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const activePage = useStore((s) => s.activePage);
  const setActivePage = useStore((s) => s.setActivePage);
  const sidebarOpen = useStore((s) => s.sidebarOpen);
  const toggleSidebar = useStore((s) => s.toggleSidebar);
  const mobileSidebarOpen = useStore((s) => s.mobileSidebarOpen);
  const setMobileSidebarOpen = useStore((s) => s.setMobileSidebarOpen);

  const handleNav = (id) => {
    setActivePage(id);
    setMobileSidebarOpen(false);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full" style={{ backgroundColor: 'var(--bg-sidebar)' }}>
      {/* Logo */}
      <div 
        className={`flex items-center gap-3 px-4 py-5 ${!sidebarOpen ? 'justify-center' : ''}`}
        style={{ 
          borderColor: 'var(--border-subtle)',
          borderBottomWidth: '1px',
        }}
      >
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-500/25">
          <TrendingUp size={18} className="text-white" />
        </div>
        {sidebarOpen && (
          <div className="overflow-hidden">
            <h1 className="text-base font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>FinTrack</h1>
            <p className="text-[10px] font-medium" style={{ color: 'var(--text-muted)' }}>Finance Dashboard</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = activePage === item.id;
          const Icon = item.icon;

          const buttonEl = (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                transition-all duration-200 outline-none cursor-pointer
                ${isActive
                  ? 'bg-indigo-500/15 text-indigo-400 shadow-sm'
                  : ''
                }
                ${!sidebarOpen ? 'justify-center' : ''}
              `}
              style={!isActive ? {
                color: 'var(--text-muted)',
              } : {}}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover)';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'var(--text-muted)';
                }
              }}
            >
              <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          );

          if (!sidebarOpen) {
            return (
              <Tooltip key={item.id}>
                <Tooltip.Trigger>{buttonEl}</Tooltip.Trigger>
                <Tooltip.Content 
                  className="text-xs px-2 py-1 rounded-lg"
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    color: 'var(--text-primary)',
                    borderColor: 'var(--border-subtle)',
                    borderWidth: '1px',
                  }}
                >
                  {item.label}
                </Tooltip.Content>
              </Tooltip>
            );
          }

          return <div key={item.id}>{buttonEl}</div>;
        })}
      </nav>

      {/* Collapse button - desktop only */}
      <div className="hidden lg:block px-3 pb-4">
        <button
          onClick={toggleSidebar}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer"
          style={{
            color: 'var(--text-muted)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover)';
            e.currentTarget.style.color = 'var(--text-secondary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = 'var(--text-muted)';
          }}
        >
          {sidebarOpen ? (
            <>
              <ChevronLeft size={14} />
              <span>Collapse</span>
            </>
          ) : (
            <ChevronRight size={14} />
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden backdrop-blur-sm"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Mobile sidebar drawer */}
      <aside
        className={`
          fixed top-0 left-0 h-full z-50 lg:hidden
          w-64 border-r
          transform transition-transform duration-300 ease-in-out
          ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        style={{ 
          backgroundColor: 'var(--bg-sidebar)',
          borderColor: 'var(--border-subtle)',
        }}
      >
        <button
          onClick={() => setMobileSidebarOpen(false)}
          className="absolute top-4 right-4 p-1 rounded-lg cursor-pointer"
          style={{ 
            color: 'var(--text-muted)',
            backgroundColor: 'transparent',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover)';
            e.currentTarget.style.color = 'var(--text-secondary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = 'var(--text-muted)';
          }}
        >
          <X size={18} />
        </button>
        {sidebarContent}
      </aside>

      {/* Desktop sidebar */}
      <aside
        className={`
          hidden lg:flex flex-col flex-shrink-0
          h-screen border-r sticky top-0
          transition-all duration-300 ease-in-out
          ${sidebarOpen ? 'w-56' : 'w-[68px]'}
        `}
        style={{ 
          backgroundColor: 'var(--bg-sidebar)',
          borderColor: 'var(--border-subtle)',
        }}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
