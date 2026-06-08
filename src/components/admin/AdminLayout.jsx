import { useState } from 'react';

const NAV = [
  { id: 'dashboard',    label: 'Dashboard',    icon: '▦' },
  { id: 'site',         label: 'Situs & Hero', icon: '🌐' },
  { id: 'about',        label: 'Tentang Saya', icon: '👤' },
  { id: 'projects',     label: 'Proyek',        icon: '📁' },
  { id: 'experience',   label: 'Pengalaman',    icon: '💼' },
  { id: 'skills',       label: 'Keahlian',      icon: '⭐' },
  { id: 'education',    label: 'Pendidikan',    icon: '🎓' },
  { id: 'hobbies',      label: 'Hobi',          icon: '❤' },
  { id: 'publications', label: 'Publikasi',     icon: '📄' },
  { id: 'sections',     label: 'Tata Section',  icon: '⚙' },
  { id: 'settings',     label: 'Pengaturan',    icon: '🔧' },
];

export default function AdminLayout({ active, onNavigate, onLogout, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const title = NAV.find(n => n.id === active)?.label || '';

  return (
    <div className="admin-wrapper">
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{ position: 'fixed', inset: 0, zIndex: 49, background: 'rgba(0,0,0,.5)' }}
        />
      )}
      <aside className={`sidebar${sidebarOpen ? ' open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            Admin Panel
            <span>Portfolio Prizuri Hartadi</span>
          </div>
        </div>
        <nav className="sidebar-nav">
          {NAV.map(n => (
            <button
              key={n.id}
              className={`nav-item${active === n.id ? ' active' : ''}`}
              onClick={() => { onNavigate(n.id); setSidebarOpen(false); }}
            >
              <span>{n.icon}</span> {n.label}
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <button className="btn-cancel" style={{ width: '100%' }} onClick={onLogout}>Keluar</button>
        </div>
      </aside>

      <main className="admin-main">
        <div className="admin-topbar">
          <button className="hamburger" onClick={() => setSidebarOpen(o => !o)}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
          <span className="admin-topbar-title">{title}</span>
          <a href="../" target="_blank" style={{ fontSize: '.78rem', color: 'var(--text-3)' }}>Lihat Website ↗</a>
        </div>
        <div className="admin-content">{children}</div>
      </main>
    </div>
  );
}
