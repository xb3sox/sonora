import React from 'react';
import { usePlayer } from '../context/PlayerContext';
import { Check, Info, AlertCircle, X } from 'lucide-react';

export function ToastContainer() {
  const { toasts } = usePlayer();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-24 right-6 z-50 flex flex-col gap-2">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-sm font-medium animate-slide-in
            ${toast.type === 'success' ? 'bg-sonora-bark text-sonora-cream' : ''}
            ${toast.type === 'info' ? 'bg-sonora-earth text-sonora-cream' : ''}
            ${toast.type === 'error' ? 'bg-red-700 text-white' : ''}
          `}
        >
          {toast.type === 'success' && <Check size={14} />}
          {toast.type === 'info' && <Info size={14} />}
          {toast.type === 'error' && <AlertCircle size={14} />}
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
}
