import React from 'react';
import { Link } from 'react-router-dom';
import { IconFilm, IconChevronLeft } from '../components/common/Icons';

export const NotFound = () => {
  return (
    <div className="container py-5 text-center min-vh-75 d-flex flex-column align-items-center justify-content-center">
      <div
        className="d-inline-flex align-items-center justify-content-center p-4 rounded-circle bg-danger bg-opacity-10 text-danger mb-4 shadow"
      >
        <IconFilm size={48} />
      </div>
      <h1 className="display-3 fw-extrabold text-white mb-2">404</h1>
      <h3 className="fw-bold text-white mb-3">Scene Not Found</h3>
      <p className="text-white-50 fs-6 mb-4" style={{ maxWidth: '460px' }}>
        The reel you're looking for seems to have slipped off the projector. Let's get you back to the main feature.
      </p>
      <Link to="/" className="btn btn-cinema d-inline-flex align-items-center gap-2 px-4 py-2">
        <IconChevronLeft size={18} />
        Return to Home Page
      </Link>
    </div>
  );
};
