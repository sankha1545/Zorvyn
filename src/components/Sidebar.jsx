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
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-white/[0.06] ${!sidebarOpen ? 'justify-center' : ''}`}>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-500/25">
          <TrendingUp size={18} className="text-white" />
        </div>
        {sidebarOpen && (
          <div className="overflow-hidden">
            <h1 className="text-base font-bold text-zinc-100 tracking-tight">FinTrack</h1>
            <p className="text-[10px] text-zinc-500 font-medium">Finance Dashboard</p>
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
                  : 'text-zinc-500 hover:bg-white/[0.04] hover:text-zinc-300'
                }
                ${!sidebarOpen ? 'justify-center' : ''}
              `}
            >
              <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          );

          if (!sidebarOpen) {
            return (
              <Tooltip key={item.id}>
                <Tooltip.Trigger>{buttonEl}</Tooltip.Trigger>
                <Tooltip.Content className="bg-zinc-800 text-zinc-200 text-xs px-2 py-1 rounded-lg border border-white/[0.06]">
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
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-zinc-500 hover:bg-white/[0.04] hover:text-zinc-300 transition-all cursor-pointer"
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
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Mobile sidebar drawer */}
      <aside
        className={`
          fixed top-0 left-0 h-full z-50 lg:hidden
          w-64 bg-zinc-950 border-r border-white/[0.06]
          transform transition-transform duration-300 ease-in-out
          ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <button
          onClick={() => setMobileSidebarOpen(false)}
          className="absolute top-4 right-4 p-1 rounded-lg hover:bg-white/[0.04] text-zinc-500 cursor-pointer"
        >
          <X size={18} />
        </button>
        {sidebarContent}
      </aside>

      {/* Desktop sidebar */}
      <aside
        className={`
          hidden lg:flex flex-col flex-shrink-0
          h-screen bg-zinc-950 border-r border-white/[0.06]
          transition-all duration-300 ease-in-out sticky top-0
          ${sidebarOpen ? 'w-56' : 'w-[68px]'}
        `}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
