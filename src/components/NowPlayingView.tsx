import React, { useState } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { AlbumArt } from './AlbumArt';
import { 
  X, ChevronDown, Play, Pause, SkipBack, SkipForward,
  Shuffle, Repeat, Repeat1, Heart, Share2, ListMusic,
  Mic2, Info
} from 'lucide-react';

interface NowPlayingViewProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenQueue: () => void;
  onOpenLyrics: () => void;
  onOpenCredits: () => void;
}

export function NowPlayingView({ isOpen, onClose, onOpenQueue, onOpenLyrics, onOpenCredits }: NowPlayingViewProps) {
  const { 
    state, togglePlay, next, previous, seek,
    toggleShuffle, toggleRepeat, toggleFavorite, isFavorite
  } = usePlayer();
  const { currentTrack, isPlaying, progress, shuffle, repeat } = state;

  const [touchStart, setTouchStart] = useState<number | null>(null);

  if (!isOpen || !currentTrack) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentTime = (progress / 100) * currentTrack.duration;
  const liked = isFavorite(currentTrack.id);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientY);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientY;
    const diff = touchEnd - touchStart;
    if (diff > 100) {
      onClose();
    }
    setTouchStart(null);
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-sonora-cream flex flex-col animate-slide-up"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 flex-shrink-0">
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-sonora-warm text-sonora-stone hover:text-sonora-bark transition-calm"
          aria-label="Close"
        >
          <ChevronDown size={24} />
        </button>
        <div className="text-center">
          <p className="text-xs font-semibold text-sonora-stone uppercase tracking-wider">Now Playing</p>
        </div>
        <button
          onClick={onOpenQueue}
          className="p-2 rounded-full hover:bg-sonora-warm text-sonora-stone hover:text-sonora-bark transition-calm"
          aria-label="Queue"
        >
          <ListMusic size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 pb-4 overflow-y-auto">
        {/* Album Art */}
        <div className="w-64 h-64 sm:w-80 sm:h-80 rounded-2xl mb-8 shadow-2xl overflow-hidden">
          <AlbumArt type="album" id={currentTrack.albumId} size="xl" className="w-full h-full" />
        </div>

        {/* Track Info */}
        <div className="text-center mb-6 w-full max-w-md">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0 text-left">
              <h1 className="font-display text-2xl font-semibold text-sonora-bark truncate">
                {currentTrack.title}
              </h1>
              <p className="text-sm text-sonora-stone truncate">{currentTrack.artist}</p>
            </div>
            <button
              onClick={() => toggleFavorite(currentTrack.id)}
              className={`p-2 rounded-full transition-calm flex-shrink-0
                ${liked ? 'text-sonora-accent' : 'text-sonora-stone hover:text-sonora-accent'}`}
            >
              <Heart size={22} fill={liked ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>

        {/* Progress */}
        <div className="w-full max-w-md mb-6">
          <div className="flex items-center gap-3">
            <span className="text-xs text-sonora-stone w-10 text-right tabular-nums">{formatTime(currentTime)}</span>
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={(e) => seek(Number(e.target.value))}
              className="flex-1 h-1.5 cursor-pointer"
              aria-label="Seek"
            />
            <span className="text-xs text-sonora-stone w-10 tabular-nums">{formatTime(currentTrack.duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-6 mb-8">
          <button
            onClick={toggleShuffle}
            className={`p-2 rounded-full transition-calm
              ${shuffle ? 'text-sonora-bark' : 'text-sonora-stone'}`}
          >
            <Shuffle size={20} />
          </button>
          <button
            onClick={previous}
            className="p-2 text-sonora-earth hover:text-sonora-bark transition-calm"
          >
            <SkipBack size={28} />
          </button>
          <button
            onClick={togglePlay}
            className="w-16 h-16 rounded-full bg-sonora-bark text-sonora-cream flex items-center justify-center hover:bg-sonora-night transition-calm"
          >
            {isPlaying ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
          </button>
          <button
            onClick={next}
            className="p-2 text-sonora-earth hover:text-sonora-bark transition-calm"
          >
            <SkipForward size={28} />
          </button>
          <button
            onClick={toggleRepeat}
            className={`p-2 rounded-full transition-calm
              ${repeat !== 'off' ? 'text-sonora-bark' : 'text-sonora-stone'}`}
          >
            {repeat === 'one' ? <Repeat1 size={20} /> : <Repeat size={20} />}
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-6">
          <button
            onClick={onOpenLyrics}
            className="flex flex-col items-center gap-1 text-sonora-stone hover:text-sonora-bark transition-calm"
          >
            <Mic2 size={18} />
            <span className="text-[10px]">Lyrics</span>
          </button>
          <button
            onClick={onOpenCredits}
            className="flex flex-col items-center gap-1 text-sonora-stone hover:text-sonora-bark transition-calm"
          >
            <Info size={18} />
            <span className="text-[10px]">Credits</span>
          </button>
          <button
            className="flex flex-col items-center gap-1 text-sonora-stone hover:text-sonora-bark transition-calm"
          >
            <Share2 size={18} />
            <span className="text-[10px]">Share</span>
          </button>
        </div>

        {/* Lossless Badge */}
        {currentTrack.lossless && (
          <div className="mt-6">
            <span className="text-[10px] font-semibold text-sonora-sage bg-sonora-sage/10 px-3 py-1 rounded-full">
              Lossless · 24-bit/96kHz
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
