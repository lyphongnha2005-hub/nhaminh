import React from 'react';

export interface ToastMessage {
  id: string;
  text: string;
  type?: 'default' | 'success';
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="toast-container" id="toast-notifications-container">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast-item ${toast.type === 'success' ? 'success' : ''}`}
          onClick={() => onDismiss(toast.id)}
          style={{ cursor: 'pointer' }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '1.25rem', color: toast.type === 'success' ? '#a3e635' : '#ebd8c0' }}>
            {toast.type === 'success' ? 'task_alt' : 'info'}
          </span>
          <span style={{ flex: 1 }}>{toast.text}</span>
          <span className="material-symbols-outlined" style={{ fontSize: '1rem', opacity: 0.6 }}>
            close
          </span>
        </div>
      ))}
    </div>
  );
};
