import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const success = useCallback((msg, duration) => showToast(msg, 'success', duration), [showToast]);
  const error = useCallback((msg, duration) => showToast(msg, 'error', duration), [showToast]);
  const info = useCallback((msg, duration) => showToast(msg, 'info', duration), [showToast]);
  const warning = useCallback((msg, duration) => showToast(msg, 'warning', duration), [showToast]);

  return (
    <ToastContext.Provider value={{ showToast, success, error, info, warning, removeToast }}>
      {children}
      {/* Toast container floating on top right */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-3 max-w-md w-full px-4 pointer-events-none">
        {toasts.map((toast) => {
          let bgColor = 'bg-navy-900 text-white border-navy-700';
          let Icon = Info;
          let iconColor = 'text-accent-500';

          if (toast.type === 'success') {
            bgColor = 'bg-emerald-950 text-white border-emerald-700/60';
            Icon = CheckCircle;
            iconColor = 'text-emerald-400';
          } else if (toast.type === 'error') {
            bgColor = 'bg-rose-950 text-white border-rose-700/60';
            Icon = AlertCircle;
            iconColor = 'text-rose-400';
          } else if (toast.type === 'warning') {
            bgColor = 'bg-amber-950 text-white border-amber-700/60';
            Icon = AlertTriangle;
            iconColor = 'text-amber-400';
          }

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-modal backdrop-blur-md transition-all duration-300 animate-slide-in ${bgColor}`}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${iconColor}`} />
              <div className="flex-1 text-sm font-medium leading-relaxed">{toast.message}</div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
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
