import { Card, Switch, Separator, Chip } from '@heroui/react';
import { User, Bell, Palette, Shield, Save } from 'lucide-react';
import useStore from '../store/useStore';

export default function Settings() {
  const theme = useStore((s) => s.theme);
  const toggleTheme = useStore((s) => s.toggleTheme);
  const role = useStore((s) => s.role);

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Settings</h2>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>Manage your account and preferences</p>
      </div>

      {/* Profile Settings */}
      <Card 
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderColor: 'var(--border-subtle)',
          borderWidth: '1px',
        }}
      >
        <Card.Header className="flex flex-row gap-3 px-5 pt-5 pb-0">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/15 flex items-center justify-center">
            <User size={18} className="text-indigo-400" />
          </div>
          <div>
            <Card.Title className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Profile Information</Card.Title>
            <Card.Description className="text-xs" style={{ color: 'var(--text-muted)' }}>Update your personal details</Card.Description>
          </div>
        </Card.Header>
        <Card.Content className="px-5 py-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Full Name</label>
              <input
                defaultValue="Alex Morgan"
                className="rounded-xl px-3 py-2 text-sm outline-none transition-all"
                style={{
                  backgroundColor: 'var(--bg-input)',
                  borderColor: 'var(--border-input)',
                  borderWidth: '1px',
                  color: 'var(--text-primary)',
                }}
                onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border-input)'}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Email</label>
              <input
                defaultValue="alex@fintrack.io"
                type="email"
                className="rounded-xl px-3 py-2 text-sm outline-none transition-all"
                style={{
                  backgroundColor: 'var(--bg-input)',
                  borderColor: 'var(--border-input)',
                  borderWidth: '1px',
                  color: 'var(--text-primary)',
                }}
                onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border-input)'}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Phone</label>
              <input
                defaultValue="+1 (555) 123-4567"
                className="rounded-xl px-3 py-2 text-sm outline-none transition-all"
                style={{
                  backgroundColor: 'var(--bg-input)',
                  borderColor: 'var(--border-input)',
                  borderWidth: '1px',
                  color: 'var(--text-primary)',
                }}
                onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border-input)'}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Currency</label>
              <select 
                className="rounded-xl px-3 py-2 text-sm outline-none transition-all"
                style={{
                  backgroundColor: 'var(--bg-input)',
                  borderColor: 'var(--border-input)',
                  borderWidth: '1px',
                  color: 'var(--text-primary)',
                }}
                onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border-input)'}
              >
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
                <option value="JPY">JPY - Japanese Yen</option>
              </select>
            </div>
          </div>
        </Card.Content>
      </Card>

      {/* Appearance */}
      <Card 
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderColor: 'var(--border-subtle)',
          borderWidth: '1px',
        }}
      >
        <Card.Header className="flex flex-row gap-3 px-5 pt-5 pb-0">
          <div className="w-9 h-9 rounded-xl bg-violet-500/15 flex items-center justify-center">
            <Palette size={18} className="text-violet-400" />
          </div>
          <div>
            <Card.Title className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Appearance</Card.Title>
            <Card.Description className="text-xs" style={{ color: 'var(--text-muted)' }}>Customize the look and feel</Card.Description>
          </div>
        </Card.Header>
        <Card.Content className="px-5 py-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Dark Mode</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Toggle between light and dark themes</p>
            </div>
            <Switch defaultSelected={theme === 'dark'} onChange={toggleTheme}>
              <Switch.Thumb />
            </Switch>
          </div>
          <Separator style={{ backgroundColor: 'var(--border-subtle)' }} />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Compact Mode</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Reduce spacing and padding</p>
            </div>
            <Switch>
              <Switch.Thumb />
            </Switch>
          </div>
        </Card.Content>
      </Card>

      {/* Notifications */}
      <Card 
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderColor: 'var(--border-subtle)',
          borderWidth: '1px',
        }}
      >
        <Card.Header className="flex flex-row gap-3 px-5 pt-5 pb-0">
          <div className="w-9 h-9 rounded-xl bg-amber-500/15 flex items-center justify-center">
            <Bell size={18} className="text-amber-400" />
          </div>
          <div>
            <Card.Title className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Notifications</Card.Title>
            <Card.Description className="text-xs" style={{ color: 'var(--text-muted)' }}>Choose what notifications you receive</Card.Description>
          </div>
        </Card.Header>
        <Card.Content className="px-5 py-4 space-y-4">
          {[
            { label: 'Transaction Alerts', desc: 'Get notified for every transaction', on: true },
            { label: 'Budget Warnings', desc: 'Alert when spending exceeds budget', on: true },
            { label: 'Monthly Reports', desc: 'Receive monthly financial summary', on: false },
            { label: 'Security Alerts', desc: 'Suspicious activity notifications', on: false },
          ].map((item, i) => (
            <div key={i}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{item.label}</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{item.desc}</p>
                </div>
                <Switch defaultSelected={item.on}>
                  <Switch.Thumb />
                </Switch>
              </div>
              {i < 3 && <Separator style={{ backgroundColor: 'var(--border-subtle)' }} />}
            </div>
          ))}
        </Card.Content>
      </Card>

      {/* Security */}
      <Card 
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderColor: 'var(--border-subtle)',
          borderWidth: '1px',
        }}
      >
        <Card.Header className="flex flex-row gap-3 px-5 pt-5 pb-0">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/15 flex items-center justify-center">
            <Shield size={18} className="text-emerald-400" />
          </div>
          <div className="flex items-center gap-2">
            <div>
              <Card.Title className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Security & Access</Card.Title>
              <Card.Description className="text-xs" style={{ color: 'var(--text-muted)' }}>Manage your account security</Card.Description>
            </div>
            <Chip className={`text-[11px] font-medium px-2 py-0.5 rounded-lg ${
              role === 'admin'
                ? 'bg-indigo-500/10 text-indigo-400'
                : 'bg-amber-500/10 text-amber-400'
            }`}>
              <Chip.Label>{role === 'admin' ? 'Admin' : 'Viewer'}</Chip.Label>
            </Chip>
          </div>
        </Card.Header>
        <Card.Content className="px-5 py-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Two-Factor Authentication</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Add an extra layer of security</p>
            </div>
            <Switch defaultSelected>
              <Switch.Thumb />
            </Switch>
          </div>
          <Separator style={{ backgroundColor: 'var(--border-subtle)' }} />
          <div>
            <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Current Role</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {role === 'admin'
                ? 'You have full access to create, edit, and delete transactions.'
                : 'You have read-only access. Contact an admin to change your role.'}
            </p>
          </div>
        </Card.Content>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end pb-6">
        <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 shadow-lg shadow-indigo-500/25 transition-all cursor-pointer">
          <Save size={16} />
          Save Changes
        </button>
      </div>
    </div>
  );
}
