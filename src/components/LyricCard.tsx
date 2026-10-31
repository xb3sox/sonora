import React, { useRef, useState } from 'react';
import { X, Download, Copy, Check, Headphones } from 'lucide-react';
import { Track } from '../types';

interface LyricCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  track: Track;
  lyricLine: string;
  palette: { primary: string; secondary: string; accent: string };
}

/**
 * Shareable lyric card - creates a beautiful, screenshot-ready card
 * with the current lyric line and track information
 */
export function LyricCardModal({ isOpen, onClose, track, lyricLine, palette }: LyricCardModalProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = async () => {
    // In a real implementation, we'd use html2canvas or similar
    // For now, copy the text
    const text = `"${lyricLine}"\n\n— ${track.title}, ${track.artist}\n\nvia Sonora`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-sonora-night/80 backdrop-blur-md">
      <div className="absolute inset-0" onClick={onClose} />
      
      <div className="relative w-full max-w-md animate-fade-in">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 p-2 rounded-full bg-sonora-cream/10 hover:bg-sonora-cream/20 text-sonora-cream/80 transition-calm"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {/* The Lyric Card */}
        <div
          ref={cardRef}
          className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl"
          style={{
            background: `linear-gradient(135deg, ${palette.primary} 0%, ${palette.secondary} 100%)`,
          }}
        >
          {/* Decorative elements */}
          <div className="absolute inset-0 opacity-20">
            <div 
              className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl"
              style={{ background: palette.accent }}
            />
            <div 
              className="absolute bottom-0 left-0 w-48 h-48 rounded-full blur-3xl"
              style={{ background: palette.primary }}
            />
          </div>

          {/* Noise texture */}
          <div 
            className="absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            }}
          />

          {/* Content */}
          <div className="relative h-full flex flex-col justify-between p-8 text-sonora-cream">
            {/* Top - Quote mark */}
            <div>
              <div className="text-6xl font-display leading-none opacity-30">"</div>
            </div>

            {/* Middle - Lyric */}
            <div className="flex-1 flex items-center">
              <p className="font-display text-3xl sm:text-4xl font-semibold leading-tight tracking-tight">
                {lyricLine}
              </p>
            </div>

            {/* Bottom - Attribution */}
            <div className="space-y-3">
              <div className="h-px bg-sonora-cream/20" />
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-sm font-medium opacity-90">{track.title}</p>
                  <p className="text-xs opacity-60">{track.artist}</p>
                </div>
                <div className="flex items-center gap-1.5 opacity-60">
                  <Headphones size={12} />
                  <span className="text-[10px] uppercase tracking-wider font-medium">Sonora</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-4 flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-sonora-cream/10 hover:bg-sonora-cream/20 rounded-xl text-sonora-cream text-sm font-medium transition-calm backdrop-blur-sm"
          >
            {copied ? (
              <>
                <Check size={16} />
                Copied!
              </>
            ) : (
              <>
                <Copy size={16} />
                Copy Text
              </>
            )}
          </button>
          <button
            onClick={onClose}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-sonora-cream text-sonora-bark rounded-xl text-sm font-medium hover:bg-sonora-cream/90 transition-calm"
          >
            Done
          </button>
        </div>

        <p className="mt-3 text-center text-xs text-sonora-cream/40">
          Share your favorite lyrics with friends
        </p>
      </div>
    </div>
  );
}
