import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  PlusCircle,
  Users,
  UserPlus,
  BookUp,
  ClipboardList,
  AlertTriangle,
  BookMarked,
  Inbox,
  X,
} from 'lucide-react';

const Sidebar = ({ isMobileOpen, setIsMobileOpen }) => {
  const closeSidebarOnMobile = () => {
    if (window.innerWidth <= 1024) {
      setIsMobileOpen(false);
    }
  };

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/requests', label: 'Borrow Requests', icon: Inbox },
    { to: '/books', label: 'Manage Books', icon: BookOpen },
    { to: '/books/add', label: 'Add Book', icon: PlusCircle },
    { to: '/students', label: 'Manage Members', icon: Users },
    { to: '/students/add', label: 'Add Member', icon: UserPlus },
    { to: '/issues/new', label: 'Issue Book', icon: BookUp },
    { to: '/issues', label: 'Issued Books', icon: ClipboardList },
    { to: '/issues/overdue', label: 'Overdue Books', icon: AlertTriangle, isWarning: true },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setIsMobileOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(2px)',
            zIndex: 40,
          }}
        />
      )}

      <aside
        className={`sidebar ${isMobileOpen ? 'open' : ''}`}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          width: 'var(--sidebar-width)',
          backgroundColor: 'var(--color-bg-sidebar)',
          color: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 50,
          transition: 'transform var(--transition-normal)',
          transform: isMobileOpen || window.innerWidth > 1024 ? 'translateX(0)' : 'translateX(-100%)',
          borderRight: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        {/* Brand Header */}
        <div
          style={{
            height: 'var(--navbar-height)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 20px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(135deg, #6366f1, #4338ca)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.35)',
              }}
            >
              <BookMarked size={22} color="#ffffff" />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.2rem', letterSpacing: '-0.02em', color: '#ffffff' }}>
                Libra
              </div>
              <div style={{ fontSize: '0.68rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Library Admin
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsMobileOpen(false)}
            style={{
              display: window.innerWidth <= 1024 ? 'block' : 'none',
              color: '#94a3b8',
              padding: 4,
            }}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav style={{ flex: 1, padding: '20px 14px', overflowY: 'auto' }}>
          <div
            style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: '#64748b',
              padding: '0 12px 10px',
            }}
          >
            Navigation Menu
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={closeSidebarOnMobile}
                  style={({ isActive }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '11px 14px',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.9rem',
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? '#ffffff' : '#cbd5e1',
                    backgroundColor: isActive ? 'var(--color-bg-sidebar-active)' : 'transparent',
                    transition: 'all var(--transition-fast)',
                    boxShadow: isActive ? '0 2px 6px rgba(0, 0, 0, 0.2)' : 'none',
                  })}
                >
                  <Icon
                    size={19}
                    color={item.isWarning ? '#f59e0b' : undefined}
                    style={{ flexShrink: 0 }}
                  />
                  <span style={{ flex: 1 }}>{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* System Info / Bottom Tag */}
        <div
          style={{
            padding: '16px 20px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
          }}
        >
          <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
            System Status: <span style={{ color: '#10b981', fontWeight: 600 }}>Active Online</span>
          </div>
          <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: 2 }}>
            Libra v1.0 • MERN Stack
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
