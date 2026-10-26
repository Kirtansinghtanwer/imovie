import React from 'react';
import { IconFilm } from './Icons';

export const EmptyState = ({
  icon: Icon = IconFilm,
  title = "No items found",
  message = "Try adjusting your filters or search terms to find what you are looking for.",
  actionLabel = null,
  onAction = null
}) => {
  return (
    <div className="text-center py-5 px-3 my-4 rounded-4" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px dashed var(--border-strong)' }}>
      <div
        className="d-inline-flex align-items-center justify-content-center p-3 rounded-circle mb-3"
        style={{ backgroundColor: 'rgba(229, 9, 20, 0.1)', color: 'var(--accent-primary)' }}
      >
        <Icon size={40} />
      </div>
      <h4 className="fw-bold text-white mb-2">{title}</h4>
      <p className="text-white-50 mx-auto mb-4" style={{ maxWidth: '420px', fontSize: '0.95rem' }}>
        {message}
      </p>
      {actionLabel && onAction && (
        <button onClick={onAction} className="btn btn-cinema btn-sm">
          {actionLabel}
        </button>
      )}
    </div>
  );
};
