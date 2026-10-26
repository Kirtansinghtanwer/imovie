import React from 'react';

export const SeatLegend = () => {
  return (
    <div
      className="d-flex align-items-center justify-content-center flex-wrap gap-4 py-3 px-4 rounded-4 mb-4"
      style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}
    >
      {/* Available */}
      <div className="d-flex align-items-center gap-2">
        <span
          className="rounded"
          style={{
            width: '22px',
            height: '22px',
            backgroundColor: 'var(--seat-available)',
            border: '1px solid var(--seat-available-border)'
          }}
        />
        <span className="text-white-50 small">Available ($14 - $16)</span>
      </div>

      {/* Selected */}
      <div className="d-flex align-items-center gap-2">
        <span
          className="rounded"
          style={{
            width: '22px',
            height: '22px',
            backgroundColor: 'var(--seat-selected)',
            boxShadow: '0 0 8px rgba(229, 9, 20, 0.8)',
            border: '1px solid #ff4757'
          }}
        />
        <span className="text-white small fw-bold">Selected</span>
      </div>

      {/* Occupied */}
      <div className="d-flex align-items-center gap-2">
        <span
          className="rounded d-flex align-items-center justify-content-center"
          style={{
            width: '22px',
            height: '22px',
            backgroundColor: 'var(--seat-occupied)',
            border: '1px solid #2b2b3b',
            color: '#666677',
            fontSize: '0.7rem'
          }}
        >
          ✕
        </span>
        <span className="text-white-50 small">Occupied (Reserved)</span>
      </div>

      {/* Premium / VIP */}
      <div className="d-flex align-items-center gap-2">
        <span
          className="rounded"
          style={{
            width: '22px',
            height: '22px',
            backgroundColor: 'rgba(245, 158, 11, 0.15)',
            border: '1.5px solid var(--seat-premium)'
          }}
        />
        <span className="text-white-50 small">Premium Recliner (+$6.00)</span>
      </div>
    </div>
  );
};
