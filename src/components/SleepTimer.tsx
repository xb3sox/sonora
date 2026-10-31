import React, { useState, useEffect, useRef } from 'react';
import { Moon, X, Check } from 'lucide-react';

interface SleepTimerProps {
  isOpen: boolean;
  onClose: () => void;
}

const timerOptions = [
  { id: '5', label: '5 minutes', minutes: 5 },
  { id: '15', label: '15 minutes', minutes: 15 },
  { id: '30', label: '30 minutes', minutes: 30 },
  { id: '45', label: '45 minutes', minutes: 45 },
  { id: '60', label: '1 hour', minutes: 60 },
  { id: '90', label: '1.5 hours', minutes: 90 },
  { id: 'track', label: 'End of track', minutes: 0 },
];

export function SleepTimer({ isOpen, onClose }: SleepTimerProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [remaining, setRemaining] = useState<number | null>(null);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (selected && selected !== 'track') {
      const option = timerOptions.find(o => o.id === selected);
      if (option) {
        setRemaining(option.minutes * 60);
      }
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [selected]);

  useEffect(() => {
    if (remaining && remaining > 0) {
      intervalRef.current = window.setInterval(() => {
        setRemaining(prev => {
          if (prev === null || prev <= 1) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            // Timer complete - would pause playback in real app
            setSelected(null);
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [remaining !== null]);

  const formatRemaining = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-sonora-bark/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:w-96 bg-sonora-cream rounded-t-2xl sm:rounded-2xl shadow-2xl animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-sonora-sand">
          <div className="flex items-center gap-2">
            <Moon size={18} className="text-sonora-bark" />
            <h2 className="font-display text-lg font-semibold text-sonora-bark">Sleep Timer</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-sonora-warm text-sonora-stone hover:text-sonora-bark transition-calm"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          {remaining !== null && (
            <div className="mb-4 p-3 bg-sonora-warm rounded-lg flex items-center justify-between">
              <span className="text-sm text-sonora-earth">Timer active</span>
              <span className="text-sm font-medium text-sonora-bark tabular-nums">
                {formatRemaining(remaining)}
              </span>
            </div>
          )}
          <div className="space-y-1">
            {timerOptions.map(option => (
              <button
                key={option.id}
                onClick={() => setSelected(option.id)}
                className={`w-full flex items-center justify-between p-3 rounded-lg transition-calm text-left
                  ${selected === option.id
                    ? 'bg-sonora-warm text-sonora-bark'
                    : 'hover:bg-sonora-warm/60 text-sonora-earth'
                  }`}
              >
                <span className="text-sm font-medium">{option.label}</span>
                {selected === option.id && <Check size={16} className="text-sonora-sage" />}
              </button>
            ))}
          </div>
          {selected && (
            <button
              onClick={() => { setSelected(null); setRemaining(null); }}
              className="mt-4 w-full text-sm text-sonora-stone hover:text-sonora-bark transition-calm"
            >
              Cancel timer
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function useSleepTimer() {
  const [isOpen, setIsOpen] = useState(false);
  return { isOpen, open: () => setIsOpen(true), close: () => setIsOpen(false) };
}
