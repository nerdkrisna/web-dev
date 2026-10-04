import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, loading }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" id="confirm-modal-overlay">
      <div className="modal-content" style={{ maxWidth: '460px' }} id="confirm-modal-box">
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#EF4444' }}>
            <AlertTriangle size={24} />
            <h3 className="modal-title" style={{ fontSize: '1.25rem' }}>{title}</h3>
          </div>
          <button onClick={onCancel} className="btn-icon" aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', margin: '1rem 0' }}>
          {message}
        </p>

        <div className="modal-footer">
          <button
            onClick={onCancel}
            className="btn btn-secondary"
            disabled={loading}
            id="btn-cancel-confirm"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="btn btn-danger"
            disabled={loading}
            id="btn-execute-confirm"
          >
            {loading ? 'Deleting...' : 'Yes, Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
