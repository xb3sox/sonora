import React, { useState, useEffect, useRef } from 'react';
import { usePlayer } from '../context/PlayerContext';
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
  const { state, togglePlay } = usePlayer();
  const [selected, setSelected] = useState<string | null>(null);
  const [remaining, setRemaining] = useState<number | null>(null);
  const intervalRef = useRef<number | null>(null);
  const lastTrackIdRef = useRef<string | null>(null);

  // Handle timer countdown
  useEffect(() => {
    if (remaining !== null && remaining > 0) {
      intervalRef.current = window.setInterval(() => {
        setRemaining(prev => {
          if (prev === null || prev <= 1) {
            // Timer expired - pause playback
            if (intervalRef.current) clearInterval(intervalRef.current);
            if (state.isPlaying) {
              togglePlay();
            }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remaining !== null]);

  // Handle "End of track" mode
  useEffect(() => {
    if (selected === 'track' && state.currentTrack) {
      // Track changed - pause if we were waiting for end of previous track
      if (lastTrackIdRef.current && lastTrackIdRef.current !== state.currentTrack.id) {
        if (state.isPlaying) {
          togglePlay();
        }
        setSelected(null);
        lastTrackIdRef.current = null;
      } else if (!lastTrackIdRef.current) {
        // First track - start watching
        lastTrackIdRef.current = state.currentTrack.id;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.currentTrack?.id, selected]);

  const handleSelect = (optionId: string) => {
    setSelected(optionId);
    if (optionId !== 'track') {
      const option = timerOptions.find(o => o.id === optionId);
      if (option) {
        setRemaining(option.minutes * 60);
      }
    } else {
      setRemaining(null);
      lastTrackIdRef.current = state.currentTrack?.id || null;
    }
  };

  const handleCancel = () => {
    setSelected(null);
    setRemaining(null);
    lastTrackIdRef.current = null;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

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
          {selected === 'track' && remaining === null && (
            <div className="mb-4 p-3 bg-sonora-warm rounded-lg flex items-center justify-between">
              <span className="text-sm text-sonora-earth">Will pause at end of track</span>
              <Moon size={16} className="text-sonora-accent" />
            </div>
          )}
          <div className="space-y-1">
            {timerOptions.map(option => (
              <button
                key={option.id}
                onClick={() => handleSelect(option.id)}
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
              onClick={handleCancel}
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
