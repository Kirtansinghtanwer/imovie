import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  IconFilm,
  IconEye,
  IconEyeOff,
  IconShield,
  IconUser,
  IconSparkles
} from '../components/common/Icons';

export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, switchDemoRole } = useAuth();

  const [email, setEmail] = useState('alex@imovies.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await login(email, password);
    setLoading(false);
    if (res?.success) {
      navigate(from, { replace: true });
    }
  };

  const fillDemoCustomer = () => {
    setEmail('alex@imovies.com');
    setPassword('password123');
    switchDemoRole('user');
  };

  const fillDemoAdmin = () => {
    setEmail('admin@imovies.com');
    setPassword('admin123');
    switchDemoRole('admin');
  };

  return (
    <div className="container py-5 d-flex align-items-center justify-content-center min-vh-75">
      <div
        className="p-4 p-md-5 rounded-4 shadow-2xl mx-auto"
        style={{
          maxWidth: '460px',
          width: '100%',
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-strong)'
        }}
      >
        {/* Brand Header */}
        <div className="text-center mb-4">
          <Link to="/" className="d-inline-flex align-items-center gap-2 mb-3 text-decoration-none">
            <div
              className="d-flex align-items-center justify-content-center rounded-3 shadow"
              style={{
                width: '42px',
                height: '42px',
                background: 'linear-gradient(135deg, #FF2E3B 0%, #E50914 100%)',
                color: '#ffffff'
              }}
            >
              <IconFilm size={24} />
            </div>
            <span className="fw-bold fs-3 text-white">IMovies</span>
          </Link>
          <h4 className="fw-bold text-white mb-1">Welcome Back</h4>
          <p className="text-white-50 small mb-0">Sign in to your cinema account to manage bookings & favorites</p>
        </div>

        {/* Demo Quick-Fill Buttons */}
        <div className="p-3 rounded-3 mb-4" style={{ backgroundColor: 'rgba(255, 255, 255, 0.04)', border: '1px solid var(--border-subtle)' }}>
          <div className="d-flex align-items-center justify-content-between mb-2">
            <span className="text-white-50 small fw-bold text-uppercase" style={{ fontSize: '0.7rem' }}>
              <IconSparkles size={12} className="text-warning me-1" />
              Quick Demo Fill
            </span>
            <span className="badge bg-danger rounded-pill px-2 py-0" style={{ fontSize: '0.65rem' }}>Demo Ready</span>
          </div>
          <div className="d-flex gap-2">
            <button
              type="button"
              onClick={fillDemoCustomer}
              className="btn btn-sm btn-cinema-secondary flex-grow-1 d-flex align-items-center justify-content-center gap-1"
              style={{ fontSize: '0.78rem' }}
            >
              <IconUser size={13} />
              Demo Customer
            </button>
            <button
              type="button"
              onClick={fillDemoAdmin}
              className="btn btn-sm btn-outline-danger flex-grow-1 d-flex align-items-center justify-content-center gap-1"
              style={{ fontSize: '0.78rem' }}
            >
              <IconShield size={13} />
              Demo Admin
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="cinema-label">Email Address:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. alex@imovies.com"
              className="cinema-input form-control text-white"
              required
            />
          </div>

          <div className="mb-3">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <label className="cinema-label mb-0">Password:</label>
              <Link to="/forgot-password" className="text-danger small text-decoration-none">
                Forgot password?
              </Link>
            </div>
            <div className="position-relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="cinema-input form-control text-white pe-5"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="btn position-absolute top-50 end-0 translate-middle-y me-2 text-white-50 p-1 border-0"
                tabIndex={-1}
              >
                {showPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
              </button>
            </div>
          </div>

          <div className="form-check mb-4">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="form-check-input"
            />
            <label htmlFor="rememberMe" className="form-check-label text-white-50 small">
              Remember me on this browser
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-cinema w-100 py-3 fw-bold mb-3"
          >
            {loading ? 'Authenticating...' : 'Sign In to IMovies'}
          </button>
        </form>

        <div className="text-center text-white-50 small pt-3 border-top border-secondary border-opacity-25">
          Don't have an IMovies account?{' '}
          <Link to="/register" className="text-danger fw-semibold text-decoration-none">
            Register now
          </Link>
        </div>
      </div>
    </div>
  );
};
