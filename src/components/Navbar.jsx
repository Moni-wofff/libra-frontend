import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, LogOut, ShieldCheck, User } from 'lucide-react';

const Navbar = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Get current page title based on route
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/' || path === '/dashboard') return 'Dashboard Overview';
    if (path === '/books') return 'Book Catalog & Inventory';
    if (path === '/books/add') return 'Add New Book';
    if (path.startsWith('/books/edit')) return 'Edit Book Record';
    if (path === '/students') return 'Student & Member Directory';
    if (path === '/students/add') return 'Register New Member';
    if (path.startsWith('/students/edit')) return 'Edit Member Information';
    if (path === '/issues/new') return 'Issue Book to Member';
    if (path === '/issues') return 'Issued Books & Return Tracking';
    if (path === '/issues/overdue') return 'Overdue Books Attention';
    return 'Library Administration';
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header
      style={{
        height: 'var(--navbar-height)',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid var(--color-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 32px',
        position: 'sticky',
        top: 0,
        zIndex: 30,
        boxShadow: 'var(--shadow-xs)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          onClick={onToggleSidebar}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 38,
            height: 38,
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)',
            color: 'var(--color-primary)',
            backgroundColor: '#ffffff',
          }}
          aria-label="Toggle navigation menu"
        >
          <Menu size={20} />
        </button>

        <div>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-primary)', letterSpacing: '-0.01em' }}>
            {getPageTitle()}
          </h2>
          <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
            Libra — Library Management System
          </span>
        </div>
      </div>

      {/* Admin Profile & Logout Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '6px 12px',
            backgroundColor: '#f8fafc',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--color-border)',
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              backgroundColor: 'var(--color-accent-light)',
              color: 'var(--color-accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <User size={18} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-primary)', lineHeight: 1.2 }}>
              {user?.name || 'Administrator'}
            </span>
            <span style={{ fontSize: '0.72rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: 3 }}>
              <ShieldCheck size={12} /> Librarian
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
          }}
          title="Sign out of administration"
        >
          <LogOut size={16} />
          <span style={{ display: window.innerWidth > 640 ? 'inline' : 'none' }}>Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
