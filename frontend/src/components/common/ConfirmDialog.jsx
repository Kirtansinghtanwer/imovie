import React from 'react';
import { IconShield, IconX } from './Icons';

export const ConfirmDialog = ({
  isOpen,
  title = "Confirm Action",
  message = "Are you sure you want to proceed? This action cannot be undone.",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger",
  onConfirm,
  onCancel
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(6px)',
        zIndex: 1060
      }}
    >
      <div
        className="cinema-modal p-4 rounded-4 shadow-lg mx-3"
        style={{
          backgroundColor: 'var(--bg-modal)',
          border: '1px solid var(--border-strong)',
          maxWidth: '440px',
          width: '100%'
        }}
      >
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div className="d-flex align-items-center gap-2">
            <div
              className={`p-2 rounded-3 ${variant === 'danger' ? 'bg-danger text-white' : 'bg-warning text-dark'}`}
            >
              <IconShield size={20} />
            </div>
            <h5 className="fw-bold mb-0 text-white">{title}</h5>
          </div>
          <button
            onClick={onCancel}
            className="btn btn-sm text-white-50 p-1 hover-text-white"
          >
            <IconX size={20} />
          </button>
        </div>

        <p className="text-white-50 mb-4" style={{ fontSize: '0.925rem', lineHeight: 1.6 }}>
          {message}
        </p>

        <div className="d-flex align-items-center justify-content-end gap-2">
          <button
            type="button"
            className="btn btn-cinema-secondary btn-sm"
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className={`btn btn-${variant} btn-sm fw-semibold px-3`}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
