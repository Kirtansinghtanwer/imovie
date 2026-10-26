import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { IconFilm, IconEye, IconEyeOff } from '../components/common/Icons';

export const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    terms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match. Please verify your password confirmation.');
      return;
    }
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long.');
      return;
    }
    if (!formData.terms) {
      toast.warning('Please agree to the Terms of Service to create an account.');
      return;
    }

    setLoading(true);
    const res = await register(formData);
    setLoading(false);
    if (res?.success) {
      navigate('/movies');
    }
  };

  return (
    <div className="container py-5 d-flex align-items-center justify-content-center min-vh-75">
      <div
        className="p-4 p-md-5 rounded-4 shadow-2xl mx-auto"
        style={{
          maxWidth: '500px',
          width: '100%',
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-strong)'
        }}
      >
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
          <h4 className="fw-bold text-white mb-1">Create an Account</h4>
          <p className="text-white-50 small mb-0">Join thousands of cinema lovers enjoying premium ticket bookings</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="cinema-label">Full Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Jordan Miller"
              className="cinema-input form-control text-white"
              required
            />
          </div>

          <div className="mb-3">
            <label className="cinema-label">Email Address:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g. jordan@example.com"
              className="cinema-input form-control text-white"
              required
            />
          </div>

          <div className="mb-3">
            <label className="cinema-label">Mobile Phone Number:</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="e.g. +1 (555) 234-5678"
              className="cinema-input form-control text-white"
              required
            />
          </div>

          <div className="row g-2 mb-3">
            <div className="col-12 col-sm-6">
              <label className="cinema-label">Password:</label>
              <div className="position-relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min 6 chars"
                  className="cinema-input form-control text-white pe-5"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="btn position-absolute top-50 end-0 translate-middle-y me-2 text-white-50 p-1 border-0"
                  tabIndex={-1}
                >
                  {showPassword ? <IconEyeOff size={16} /> : <IconEye size={16} />}
                </button>
              </div>
            </div>

            <div className="col-12 col-sm-6">
              <label className="cinema-label">Confirm Password:</label>
              <input
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter password"
                className="cinema-input form-control text-white"
                required
              />
            </div>
          </div>

          <div className="form-check mb-4">
            <input
              type="checkbox"
              id="terms"
              name="terms"
              checked={formData.terms}
              onChange={handleChange}
              className="form-check-input"
              required
            />
            <label htmlFor="terms" className="form-check-label text-white-50 small">
              I agree to the IMovies Terms of Service and Privacy Policy
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-cinema w-100 py-3 fw-bold mb-3"
          >
            {loading ? 'Creating Account...' : 'Complete Registration'}
          </button>
        </form>

        <div className="text-center text-white-50 small pt-3 border-top border-secondary border-opacity-25">
          Already have an account?{' '}
          <Link to="/login" className="text-danger fw-semibold text-decoration-none">
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
};
