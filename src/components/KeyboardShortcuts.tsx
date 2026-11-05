import React, { useEffect, useState } from 'react';
import { X, Keyboard } from 'lucide-react';

interface KeyboardShortcutsProps {
  isOpen: boolean;
  onClose: () => void;
}

const shortcuts = [
  { keys: ['Space'], label: 'Play / Pause' },
  { keys: ['←'], label: 'Previous track' },
  { keys: ['→'], label: 'Next track' },
  { keys: ['↑'], label: 'Volume up' },
  { keys: ['↓'], label: 'Volume down' },
  { keys: ['M'], label: 'Mute / Unmute' },
  { keys: ['L'], label: 'Like / Unlike current track' },
  { keys: ['S'], label: 'Toggle shuffle' },
  { keys: ['R'], label: 'Cycle repeat mode' },
  { keys: ['Q'], label: 'Toggle queue' },
  { keys: ['D'], label: 'Deep Listening mode' },
  { keys: ['/'], label: 'Focus search' },
  { keys: ['?'], label: 'Show this help' },
  { keys: ['Esc'], label: 'Close modal / exit' },
];

export function KeyboardShortcuts({ isOpen, onClose }: KeyboardShortcutsProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-sonora-bark/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-sonora-cream rounded-2xl shadow-2xl animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-sonora-sand">
          <div className="flex items-center gap-2">
            <Keyboard size={18} className="text-sonora-bark" />
            <h2 className="font-display text-lg font-semibold text-sonora-bark">Keyboard Shortcuts</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-sonora-warm text-sonora-stone hover:text-sonora-bark transition-calm"
          >
            <X size={18} />
          </button>
        </div>

        {/* Shortcuts */}
        <div className="p-5 max-h-[60vh] overflow-y-auto">
          <div className="space-y-2">
            {shortcuts.map((shortcut, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-2 border-b border-sonora-sand/50 last:border-0"
              >
                <span className="text-sm text-sonora-earth">{shortcut.label}</span>
                <div className="flex items-center gap-1">
                  {shortcut.keys.map((key, j) => (
                    <React.Fragment key={j}>
                      <kbd className="px-2 py-1 bg-sonora-warm border border-sonora-sand rounded text-xs font-mono text-sonora-bark min-w-[24px] text-center">
                        {key}
                      </kbd>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-sonora-sand text-center">
          <p className="text-xs text-sonora-stone">
            Press <kbd className="px-1.5 py-0.5 bg-sonora-warm border border-sonora-sand rounded text-[10px] font-mono">?</kbd> anytime to see this
          </p>
        </div>
      </div>
    </div>
  );
}

export function useKeyboardShortcuts(handlers: {
  onTogglePlay: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onVolumeUp: () => void;
  onVolumeDown: () => void;
  onMute: () => void;
  onLike: () => void;
  onShuffle: () => void;
  onRepeat: () => void;
  onQueue: () => void;
  onDeepListening: () => void;
  onFocusSearch: () => void;
  onShowHelp: () => void;
  onClose: () => void;
}) {
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        if (e.key !== 'Escape' && e.key !== '?') return;
      }

      switch (e.key) {
        case ' ':
          e.preventDefault();
          handlers.onTogglePlay();
          break;
        case 'ArrowRight':
          handlers.onNext();
          break;
        case 'ArrowLeft':
          handlers.onPrevious();
          break;
        case 'ArrowUp':
          e.preventDefault();
          handlers.onVolumeUp();
          break;
        case 'ArrowDown':
          e.preventDefault();
          handlers.onVolumeDown();
          break;
        case 'm':
        case 'M':
          handlers.onMute();
          break;
        case 'l':
        case 'L':
          handlers.onLike();
          break;
        case 's':
        case 'S':
          handlers.onShuffle();
          break;
        case 'r':
        case 'R':
          handlers.onRepeat();
          break;
        case 'q':
        case 'Q':
          handlers.onQueue();
          break;
        case 'd':
        case 'D':
          handlers.onDeepListening();
          break;
        case '/':
          e.preventDefault();
          handlers.onFocusSearch();
          break;
        case '?':
          e.preventDefault();
          setShowHelp(true);
          handlers.onShowHelp();
          break;
        case 'Escape':
          handlers.onClose();
          setShowHelp(false);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlers]);

  return { showHelp, setShowHelp };
}
