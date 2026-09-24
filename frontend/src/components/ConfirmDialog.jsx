import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmDialog = ({
  isOpen,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDestructive = true,
  onConfirm,
  onCancel,
  loading = false
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-navy-950/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-sm rounded-3xl shadow-modal border border-cream-200 overflow-hidden animate-slide-in p-6 space-y-4">
        <div className="flex items-start gap-3">
          <div
            className={`p-2.5 rounded-2xl flex-shrink-0 ${
              isDestructive ? 'bg-rose-100 text-rose-600' : 'bg-brand-100 text-brand-700'
            }`}
          >
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-navy-900 leading-snug">{title}</h3>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">{message}</p>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 rounded-xl border border-cream-300 text-xs font-semibold text-gray-700 hover:bg-cream-100 transition-colors"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`px-4 py-2 rounded-xl text-xs font-semibold text-white shadow-sm transition-all disabled:opacity-50 ${
              isDestructive
                ? 'bg-rose-600 hover:bg-rose-700'
                : 'bg-brand-600 hover:bg-brand-700'
            }`}
          >
            {loading ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
