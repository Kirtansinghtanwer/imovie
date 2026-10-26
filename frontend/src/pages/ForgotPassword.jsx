import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { IconFilm, IconChevronLeft, IconCheck } from '../components/common/Icons';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
    toast.info(`Password reset link simulated for ${email}. (Demo mode active)`);
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
        <div className="text-center mb-4">
          <Link to="/" className="d-inline-flex align-items-center gap-2 mb-3 text-decoration-none">
            <div
              className="d-flex align-items-center justify-content-center rounded-3"
              style={{
                width: '40px',
                height: '40px',
                background: 'linear-gradient(135deg, #FF2E3B 0%, #E50914 100%)',
                color: '#ffffff'
              }}
            >
              <IconFilm size={22} />
            </div>
            <span className="fw-bold fs-4 text-white">IMovies</span>
          </Link>
          <h4 className="fw-bold text-white mb-1">Reset Password</h4>
          <p className="text-white-50 small mb-0">Enter your email and we'll send you instructions to reset your password</p>
        </div>

        {submitted ? (
          <div className="text-center py-4">
            <div className="d-inline-flex p-3 rounded-circle bg-success bg-opacity-25 text-success mb-3">
              <IconCheck size={32} />
            </div>
            <h5 className="fw-bold text-white mb-2">Check Your Email</h5>
            <p className="text-white-50 small mb-4">
              We have dispatched a demo password reset link to <strong>{email}</strong>.
            </p>
            <Link to="/login" className="btn btn-cinema-secondary btn-sm">
              Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="cinema-label">Registered Email Address:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. alex@imovies.com"
                className="cinema-input form-control text-white"
                required
              />
            </div>

            <button type="submit" className="btn btn-cinema w-100 py-3 fw-bold mb-3">
              Send Reset Instructions
            </button>

            <div className="text-center">
              <Link to="/login" className="text-white-50 small d-inline-flex align-items-center gap-1 text-decoration-none hover-text-white">
                <IconChevronLeft size={14} />
                Return to Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
