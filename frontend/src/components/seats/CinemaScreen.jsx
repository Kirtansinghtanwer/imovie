import React from 'react';

export const CinemaScreen = () => {
  return (
    <div className="cinema-screen-container py-3">
      <div className="text-white-50 text-uppercase tracking-wider small fw-semibold mb-2" style={{ letterSpacing: '0.25em', fontSize: '0.75rem' }}>
        Cinema Screen (Curved 4K Laser)
      </div>
      <div className="cinema-screen-bar" />
      <div className="cinema-screen-glow" />
    </div>
  );
};
