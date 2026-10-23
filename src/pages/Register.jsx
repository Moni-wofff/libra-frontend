import React, { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  BookMarked,
  Lock,
  Mail,
  User,
  Phone,
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  IdCard,
} from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const { register, isAuthenticated, user } = useAuth();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // If already logged in, redirect
  if (isAuthenticated) {
    return <Navigate to={user?.role === 'admin' ? '/dashboard' : '/user/dashboard'} replace />;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const { name, email, phone, password, confirmPassword } = formData;

    if (!name.trim() || !email.trim() || !password) {
      setError('Please provide your name, email, and password.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters in length.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    try {
      setIsLoading(true);
      await register({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password,
      });
      showToast('Welcome to Libra! Your library membership account is ready.', 'success');
      navigate('/user/dashboard');
    } catch (err) {
      const message =
        err.response?.data?.message || 'Registration failed. Please check your information and try again.';
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
        padding: '32px 16px',
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
        .register-spinner {
          animation: spin 0.8s linear infinite;
        }
        .register-input {
          transition: border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
        }
        .register-input:focus {
          outline: none;
          border-color: #6366f1 !important;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.18) !important;
          background-color: #ffffff !important;
        }
        .register-input:disabled {
          background-color: #f8fafc;
          cursor: not-allowed;
          opacity: 0.75;
        }
        .register-submit-btn {
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .register-submit-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, #4338ca, #1e1b4b) !important;
          transform: translateY(-1px);
          box-shadow: 0 8px 20px rgba(79, 70, 229, 0.35) !important;
        }
        .register-submit-btn:active:not(:disabled) {
          transform: translateY(0);
          box-shadow: 0 4px 10px rgba(79, 70, 229, 0.25) !important;
        }
      `}</style>

      {/* Main Registration Card */}
      <div
        style={{
          width: '100%',
          maxWidth: '480px',
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          padding: '36px 32px',
          boxShadow:
            '0 25px 50px -12px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(255, 255, 255, 0.08)',
          border: '1px solid #e2e8f0',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Top Accent Strip */}
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
        <div style={{ textAlign: 'center', marginBottom: '26px' }}>
          <div
            style={{
              width: 52,
              height: 52,
              margin: '0 auto 12px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #6366f1, #312e81)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 20px -3px rgba(99, 102, 241, 0.45)',
            }}
          >
            <BookMarked size={28} color="#ffffff" strokeWidth={2.2} />
          </div>

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
              marginBottom: '8px',
            }}
          >
            <IdCard size={13} strokeWidth={2.4} />
            <span>Student & Member Registration</span>
          </div>

          <h1
            style={{
              fontSize: '1.6rem',
              fontWeight: 800,
              color: '#0f172a',
              letterSpacing: '-0.025em',
              lineHeight: 1.25,
              margin: '0 0 4px 0',
            }}
          >
            Create Your Account
          </h1>
          <p style={{ fontSize: '0.86rem', color: '#64748b', margin: 0 }}>
            Join the library to search books, track due dates, and borrow titles
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
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
            }}
          >
            <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '1px', color: '#dc2626' }} />
            <span style={{ fontWeight: 500 }}>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate>
          {/* Full Name */}
          <div className="form-group" style={{ marginBottom: '14px' }}>
            <label
              htmlFor="name"
              style={{
                display: 'block',
                fontSize: '0.84rem',
                fontWeight: 600,
                color: '#1e293b',
                marginBottom: '5px',
              }}
            >
              Full Name <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <User
                size={17}
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
                id="name"
                name="name"
                type="text"
                className="form-input register-input"
                style={{
                  width: '100%',
                  height: '44px',
                  padding: '10px 14px 10px 40px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  backgroundColor: '#ffffff',
                  color: '#0f172a',
                  fontSize: '0.9rem',
                }}
                placeholder="e.g. Rahul Sharma"
                value={formData.name}
                onChange={handleChange}
                disabled={isLoading}
                required
              />
            </div>
          </div>

          {/* Email Address */}
          <div className="form-group" style={{ marginBottom: '14px' }}>
            <label
              htmlFor="email"
              style={{
                display: 'block',
                fontSize: '0.84rem',
                fontWeight: 600,
                color: '#1e293b',
                marginBottom: '5px',
              }}
            >
              Email Address <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <Mail
                size={17}
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
                className="form-input register-input"
                style={{
                  width: '100%',
                  height: '44px',
                  padding: '10px 14px 10px 40px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  backgroundColor: '#ffffff',
                  color: '#0f172a',
                  fontSize: '0.9rem',
                }}
                placeholder="student@institution.edu"
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
                autoComplete="email"
                required
              />
            </div>
          </div>

          {/* Phone Number */}
          <div className="form-group" style={{ marginBottom: '14px' }}>
            <label
              htmlFor="phone"
              style={{
                display: 'block',
                fontSize: '0.84rem',
                fontWeight: 600,
                color: '#1e293b',
                marginBottom: '5px',
              }}
            >
              Phone Number
            </label>
            <div style={{ position: 'relative' }}>
              <Phone
                size={17}
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
                id="phone"
                name="phone"
                type="tel"
                className="form-input register-input"
                style={{
                  width: '100%',
                  height: '44px',
                  padding: '10px 14px 10px 40px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  backgroundColor: '#ffffff',
                  color: '#0f172a',
                  fontSize: '0.9rem',
                }}
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Passwords Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '22px' }}>
            {/* Password */}
            <div className="form-group">
              <label
                htmlFor="password"
                style={{
                  display: 'block',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  color: '#1e293b',
                  marginBottom: '5px',
                }}
              >
                Password <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <Lock
                  size={16}
                  style={{
                    position: 'absolute',
                    left: '12px',
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
                  className="form-input register-input"
                  style={{
                    width: '100%',
                    height: '44px',
                    padding: '10px 34px 10px 36px',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                    backgroundColor: '#ffffff',
                    color: '#0f172a',
                    fontSize: '0.9rem',
                  }}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#94a3b8',
                    padding: '4px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="form-group">
              <label
                htmlFor="confirmPassword"
                style={{
                  display: 'block',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  color: '#1e293b',
                  marginBottom: '5px',
                }}
              >
                Confirm <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <Lock
                  size={16}
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#94a3b8',
                    pointerEvents: 'none',
                  }}
                />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  className="form-input register-input"
                  style={{
                    width: '100%',
                    height: '44px',
                    padding: '10px 12px 10px 36px',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                    backgroundColor: '#ffffff',
                    color: '#0f172a',
                    fontSize: '0.9rem',
                  }}
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={isLoading}
                  required
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn register-submit-btn"
            style={{
              width: '100%',
              height: '46px',
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
                <Loader2 size={19} className="register-spinner" />
                <span>Creating Library Card Account...</span>
              </>
            ) : (
              <>
                <span>Complete Registration</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Sign In Link */}
        <div
          style={{
            marginTop: '20px',
            textAlign: 'center',
            fontSize: '0.86rem',
            color: '#64748b',
          }}
        >
          <span>Already have an account? </span>
          <Link
            to="/login"
            style={{
              color: '#4f46e5',
              fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
