import React, { useState } from 'react';
import { Navigate, Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  BookMarked,
  LayoutDashboard,
  BookOpen,
  Inbox,
  ClipboardList,
  LogOut,
  User,
  Menu,
  X,
  IdCard,
} from 'lucide-react';

const UserLayout = () => {
  const { isAuthenticated, isLoading, user, logout } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          height: '100vh',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'var(--color-bg-app)',
        }}
      >
        <LoadingSpinner message="Loading your library portal..." size={40} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/user/dashboard', label: 'My Dashboard', icon: LayoutDashboard },
    { to: '/user/books', label: 'Browse Catalog', icon: BookOpen },
    { to: '/user/requests', label: 'Borrow Requests', icon: Inbox },
    { to: '/user/my-books', label: 'My Borrowed Books', icon: ClipboardList },
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--color-bg-app)' }}>
      {/* Header */}
      <header
        style={{
          height: 'var(--navbar-height)',
          backgroundColor: '#ffffff',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          position: 'sticky',
          top: 0,
          zIndex: 40,
          boxShadow: 'var(--shadow-xs)',
        }}
      >
        {/* Brand & Mobile Hamburger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            style={{
              display: window.innerWidth > 768 ? 'none' : 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 36,
              height: 36,
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              backgroundColor: '#ffffff',
              color: 'var(--color-primary)',
              cursor: 'pointer',
            }}
            aria-label="Toggle navigation menu"
          >
            {isMobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(135deg, #6366f1, #4338ca)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 10px rgba(99, 102, 241, 0.35)',
              }}
            >
              <BookMarked size={20} color="#ffffff" />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--color-primary)', lineHeight: 1.1 }}>
                Libra
              </div>
              <div style={{ fontSize: '0.68rem', color: '#6366f1', fontWeight: 600, letterSpacing: '0.04em' }}>
                STUDENT PORTAL
              </div>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav
            style={{
              display: window.innerWidth > 768 ? 'flex' : 'none',
              alignItems: 'center',
              gap: '6px',
              marginLeft: '24px',
            }}
          >
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  style={({ isActive }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 14px',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.88rem',
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? '#4338ca' : '#475569',
                    backgroundColor: isActive ? '#eef2ff' : 'transparent',
                    textDecoration: 'none',
                    transition: 'all 0.15s ease',
                  })}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* User Card & Logout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* Student Membership ID Pill */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              backgroundColor: '#f8fafc',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--color-border)',
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                backgroundColor: '#e0e7ff',
                color: '#4338ca',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <User size={15} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--color-primary)', lineHeight: 1.2 }}>
                {user?.name || 'Student Member'}
              </span>
              <span style={{ fontSize: '0.72rem', color: '#6366f1', display: 'flex', alignItems: 'center', gap: 3 }}>
                <IdCard size={11} /> {user?.student?.membershipId || 'Member'}
              </span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="btn btn-secondary btn-sm"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: '#dc2626',
              borderColor: '#fca5a5',
              padding: '6px 12px',
            }}
            title="Sign out of library portal"
          >
            <LogOut size={15} />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div
          style={{
            backgroundColor: '#ffffff',
            borderBottom: '1px solid var(--color-border)',
            padding: '12px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
          }}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setIsMobileOpen(false)}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.9rem',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? '#4338ca' : '#475569',
                  backgroundColor: isActive ? '#eef2ff' : 'transparent',
                  textDecoration: 'none',
                })}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      )}

      {/* Content Area */}
      <main style={{ flex: 1, padding: '24px 32px', maxWidth: '1400px', width: '100%', margin: '0 auto' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default UserLayout;
