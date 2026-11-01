'use client';

import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { ToastMessage } from '../types';

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        maxWidth: 380,
      }}
      aria-live="polite"
    >
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '12px 16px',
              borderRadius: 10,
              background: isSuccess ? '#153a25' : isError ? '#4a1515' : '#1e2e38',
              color: '#ffffff',
              boxShadow: '0 10px 25px rgba(0,0,0,0.25)',
              fontSize: 13,
              fontWeight: 500,
              animation: 'slideIn 0.25s ease-out',
            }}
          >
            {isSuccess && <CheckCircle2 size={18} style={{ color: '#4ade80', flexShrink: 0 }} />}
            {isError && <AlertCircle size={18} style={{ color: '#f87171', flexShrink: 0 }} />}
            {!isSuccess && !isError && (
              <Info size={18} style={{ color: '#60a5fa', flexShrink: 0 }} />
            )}
            <span style={{ flex: 1 }}>{toast.message}</span>
            <button
              onClick={() => onDismiss(toast.id)}
              style={{
                background: 'none',
                border: 'none',
                color: 'rgba(255,255,255,0.7)',
                cursor: 'pointer',
                padding: 2,
                display: 'flex',
              }}
              aria-label="Dismiss toast"
            >
              <X size={15} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
