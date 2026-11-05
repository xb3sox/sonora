import React, { useEffect } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { AlbumArt } from './AlbumArt';
import { WaveformVisualizer } from './WaveformVisualizer';
import { X, Play, Pause, SkipBack, SkipForward } from 'lucide-react';

interface FocusModeProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Focus Mode - Distraction-free listening experience
 * Full-screen with minimal controls and beautiful visualizations
 */
export function FocusMode({ isOpen, onClose }: FocusModeProps) {
  const { state, togglePlay, next, previous } = usePlayer();
  const { currentTrack, isPlaying, progress } = state;

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen || !currentTrack) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentTime = (progress / 100) * currentTrack.duration;

  return (
    <div className="fixed inset-0 z-[70] bg-gradient-to-br from-sonora-night via-sonora-bark to-sonora-night flex flex-col">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 p-2 rounded-full bg-sonora-cream/10 hover:bg-sonora-cream/20 text-sonora-cream/80 transition-calm z-10"
        aria-label="Exit focus mode"
      >
        <X size={20} />
      </button>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        {/* Album Art */}
        <div className="w-72 h-72 sm:w-96 sm:h-96 rounded-2xl mb-8 shadow-2xl overflow-hidden animate-float">
          <AlbumArt type="album" id={currentTrack.albumId} size="xl" className="w-full h-full" />
        </div>

        {/* Waveform Visualizer */}
        <div className="w-full max-w-2xl mb-8 opacity-60">
          <WaveformVisualizer isPlaying={isPlaying} progress={progress} />
        </div>

        {/* Track Info */}
        <div className="text-center mb-8 max-w-2xl">
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-sonora-cream mb-3">
            {currentTrack.title}
          </h1>
          <p className="text-lg text-sonora-cream/70 mb-2">{currentTrack.artist}</p>
          <p className="text-sm text-sonora-cream/50">{currentTrack.album} · {currentTrack.year}</p>
        </div>

        {/* Progress Bar */}
        <div className="w-full max-w-2xl mb-4">
          <div className="h-1 bg-sonora-cream/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-sonora-accent to-sonora-clay transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-2 text-xs text-sonora-cream/50 tabular-nums">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(currentTrack.duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-6">
          <button
            onClick={previous}
            className="p-3 text-sonora-cream/70 hover:text-sonora-cream transition-calm"
            aria-label="Previous track"
          >
            <SkipBack size={28} />
          </button>
          <button
            onClick={togglePlay}
            className="w-16 h-16 rounded-full bg-sonora-cream/10 backdrop-blur text-sonora-cream flex items-center justify-center hover:bg-sonora-cream/20 transition-calm"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
          </button>
          <button
            onClick={next}
            className="p-3 text-sonora-cream/70 hover:text-sonora-cream transition-calm"
            aria-label="Next track"
          >
            <SkipForward size={28} />
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 text-center">
        <p className="text-xs text-sonora-cream/30 italic">
          Press ESC to exit focus mode
        </p>
      </div>
    </div>
  );
}
