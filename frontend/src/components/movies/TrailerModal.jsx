import React from 'react';
import { IconX } from '../common/Icons';

export const TrailerModal = ({ isOpen, onClose, trailerUrl, movieTitle }) => {
  if (!isOpen) return null;

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.88)',
        backdropFilter: 'blur(8px)',
        zIndex: 1070
      }}
      onClick={onClose}
    >
      <div
        className="position-relative w-100 mx-3 rounded-4 overflow-hidden shadow-2xl"
        style={{
          maxWidth: '900px',
          backgroundColor: '#000000',
          border: '1px solid rgba(255, 255, 255, 0.15)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header bar */}
        <div className="d-flex align-items-center justify-content-between p-3 px-4 bg-dark border-bottom border-secondary border-opacity-25">
          <h5 className="fw-bold mb-0 text-white text-truncate pe-3">
            Official Trailer — {movieTitle}
          </h5>
          <button
            onClick={onClose}
            className="btn btn-sm btn-outline-secondary text-white rounded-circle p-1 d-flex align-items-center justify-content-center"
            style={{ width: '32px', height: '32px' }}
          >
            <IconX size={20} />
          </button>
        </div>

        {/* Video Frame */}
        <div className="ratio ratio-16x9">
          <iframe
            src={`${trailerUrl}?autoplay=1&rel=0`}
            title={`${movieTitle} Official Trailer`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
};
