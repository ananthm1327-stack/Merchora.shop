import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success') => {
    const id = 'toast_' + Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);

    // Auto-remove after 3.5 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      
      {/* Toast Stack Container */}
      <div style={{
        position: 'fixed',
        top: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        pointerEvents: 'none',
        maxWidth: '360px',
        width: '100%'
      }}>
        {toasts.map(toast => {
          // Determine styles based on type
          const theme = {
            success: {
              borderLeft: '4px solid var(--success)',
              icon: <CheckCircle size={18} style={{ color: 'var(--success)' }} />,
              bg: 'var(--bg-secondary)'
            },
            error: {
              borderLeft: '4px solid var(--danger)',
              icon: <AlertCircle size={18} style={{ color: 'var(--danger)' }} />,
              bg: 'var(--bg-secondary)'
            },
            info: {
              borderLeft: '4px solid var(--primary)',
              icon: <Info size={18} style={{ color: 'var(--primary)' }} />,
              bg: 'var(--bg-secondary)'
            }
          }[toast.type] || {
            borderLeft: '4px solid var(--text-tertiary)',
            icon: <Info size={18} />,
            bg: 'var(--bg-secondary)'
          };

          return (
            <div
              key={toast.id}
              className="card glass toast-item"
              style={{
                padding: '14px 18px',
                borderLeft: theme.borderLeft,
                backgroundColor: theme.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                boxShadow: 'var(--shadow-lg)',
                pointerEvents: 'auto',
                animation: 'toast-slide-in 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275) both'
              }}
            >
              <div className="flex align-center gap-sm" style={{ flex: 1 }}>
                {theme.icon}
                <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-primary)', textAlign: 'left', lineHeight: 1.4 }}>
                  {toast.message}
                </span>
              </div>
              <button 
                onClick={() => removeToast(toast.id)}
                style={{ color: 'var(--text-tertiary)', display: 'flex', padding: '2px' }}
              >
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>

      {/* Slide-in Keyframe style */}
      <style>{`
        @keyframes toast-slide-in {
          from { transform: translateX(110%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .toast-item {
          transition: all 0.3s ease;
        }
      `}</style>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
export default ToastProvider;
