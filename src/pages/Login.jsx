import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  BookMarked,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
} from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // If already logged in, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please provide both email and password.');
      return;
    }

    try {
      setIsLoading(true);
      await login(email.trim(), password);
      showToast('Welcome back, Admin! Successfully logged in.', 'success');
      navigate('/dashboard');
    } catch (err) {
      const message =
        err.response?.data?.message || 'Invalid email or password. Please try again.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
        backgroundColor: '#0f172a',
        backgroundImage:
          'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(99, 102, 241, 0.22), transparent 70%), radial-gradient(ellipse 70% 50% at 50% 120%, rgba(49, 46, 129, 0.3), transparent 70%)',
        position: 'relative',
      }}
    >
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .login-spinner {
          animation: spin 0.8s linear infinite;
        }
        .login-input {
          transition: border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
        }
        .login-input:focus {
          outline: none;
          border-color: #6366f1 !important;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.18) !important;
          background-color: #ffffff !important;
        }
        .login-input:disabled {
          background-color: #f8fafc;
          cursor: not-allowed;
          opacity: 0.75;
        }
        .login-submit-btn {
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .login-submit-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, #4338ca, #1e1b4b) !important;
          transform: translateY(-1px);
          box-shadow: 0 8px 20px rgba(79, 70, 229, 0.35) !important;
        }
        .login-submit-btn:active:not(:disabled) {
          transform: translateY(0);
          box-shadow: 0 4px 10px rgba(79, 70, 229, 0.25) !important;
        }
        .login-toggle-btn {
          transition: color 0.15s ease;
        }
        .login-toggle-btn:hover {
          color: #334155 !important;
        }
      `}</style>

      {/* Main Login Card */}
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          padding: '40px 36px',
          boxShadow:
            '0 25px 50px -12px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(255, 255, 255, 0.08)',
          border: '1px solid #e2e8f0',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle Top Accent Strip */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #6366f1 0%, #4f46e5 50%, #312e81 100%)',
          }}
        />

        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          {/* Logo Badge */}
          <div
            style={{
              width: 58,
              height: 58,
              margin: '0 auto 16px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #6366f1, #312e81)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 20px -3px rgba(99, 102, 241, 0.45)',
            }}
          >
            <BookMarked size={30} color="#ffffff" strokeWidth={2.2} />
          </div>

          {/* Security / Portal Pill */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '3px 12px',
              borderRadius: '9999px',
              backgroundColor: '#eef2ff',
              color: '#4338ca',
              fontSize: '0.74rem',
              fontWeight: 600,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              marginBottom: '10px',
            }}
          >
            <ShieldCheck size={13} strokeWidth={2.4} />
            <span>Administrator Portal</span>
          </div>

          {/* Title & Subtitle */}
          <h1
            style={{
              fontSize: '1.7rem',
              fontWeight: 800,
              color: '#0f172a',
              letterSpacing: '-0.025em',
              lineHeight: 1.25,
              margin: '0 0 6px 0',
            }}
          >
            Libra System
          </h1>
          <p
            style={{
              fontSize: '0.88rem',
              color: '#64748b',
              lineHeight: 1.45,
              margin: 0,
            }}
          >
            Digital Library Administration & Catalog Management
          </p>
        </div>

        {/* Error Alert Banner */}
        {error && (
          <div
            role="alert"
            style={{
              padding: '12px 14px',
              borderRadius: '10px',
              backgroundColor: '#fef2f2',
              color: '#991b1b',
              border: '1px solid #fecaca',
              fontSize: '0.86rem',
              lineHeight: 1.4,
              marginBottom: '22px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
            }}
          >
            <AlertCircle
              size={18}
              style={{
                flexShrink: 0,
                marginTop: '1px',
                color: '#dc2626',
              }}
            />
            <span style={{ fontWeight: 500 }}>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} noValidate>
          {/* Email Field */}
          <div className="form-group" style={{ marginBottom: '18px' }}>
            <label
              htmlFor="email"
              style={{
                display: 'block',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: '#1e293b',
                marginBottom: '6px',
              }}
            >
              Admin Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail
                size={18}
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#94a3b8',
                  pointerEvents: 'none',
                }}
              />
              <input
                id="email"
                name="email"
                type="email"
                className="form-input login-input"
                style={{
                  width: '100%',
                  height: '46px',
                  padding: '10px 14px 10px 42px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  backgroundColor: '#ffffff',
                  color: '#0f172a',
                  fontSize: '0.92rem',
                }}
                placeholder="admin@institution.edu"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError('');
                }}
                disabled={isLoading}
                autoComplete="username"
                spellCheck={false}
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label
              htmlFor="password"
              style={{
                display: 'block',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: '#1e293b',
                marginBottom: '6px',
              }}
            >
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock
                size={18}
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#94a3b8',
                  pointerEvents: 'none',
                }}
              />
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                className="form-input login-input"
                style={{
                  width: '100%',
                  height: '46px',
                  padding: '10px 44px 10px 42px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  backgroundColor: '#ffffff',
                  color: '#0f172a',
                  fontSize: '0.92rem',
                }}
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError('');
                }}
                disabled={isLoading}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="login-toggle-btn"
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#94a3b8',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn login-submit-btn"
            style={{
              width: '100%',
              height: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              background: 'linear-gradient(135deg, #4f46e5, #312e81)',
              color: '#ffffff',
              fontSize: '0.95rem',
              fontWeight: 600,
              borderRadius: '10px',
              border: 'none',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.75 : 1,
              boxShadow: '0 4px 14px rgba(79, 70, 229, 0.3)',
            }}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 size={19} className="login-spinner" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <span>Sign In as Administrator</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Professional Security Footer Note inside Card */}
        <div
          style={{
            marginTop: '28px',
            paddingTop: '20px',
            borderTop: '1px solid #f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            color: '#64748b',
            fontSize: '0.78rem',
            textAlign: 'center',
          }}
        >
          <ShieldCheck size={15} style={{ color: '#10b981', flexShrink: 0 }} />
          <span>Restricted Access • Authorized Library Administrators Only</span>
        </div>
      </div>

      {/* Page-level System Footer */}
      <div
        style={{
          marginTop: '24px',
          textAlign: 'center',
          color: '#64748b',
          fontSize: '0.8rem',
        }}
      >
        <p style={{ margin: 0 }}>
          Libra Library Management System &bull; Production Enterprise Edition
        </p>
      </div>
    </div>
  );
};

export default Login;
