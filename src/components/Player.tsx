import React, { useState } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { AlbumArt } from './AlbumArt';
import { 
  Play, Pause, SkipBack, SkipForward, 
  Shuffle, Repeat, Repeat1, Volume2, VolumeX,
  Headphones, ListMusic, Heart, Moon, Sliders, Share2, MoreHorizontal
} from 'lucide-react';

interface PlayerBarProps {
  onDeepListening: () => void;
  onOpenSleepTimer: () => void;
  onOpenAudioSettings: () => void;
  onOpenShare: () => void;
  onOpenNowPlaying?: () => void;
}

export function PlayerBar({ onDeepListening, onOpenSleepTimer, onOpenAudioSettings, onOpenShare, onOpenNowPlaying }: PlayerBarProps) {
  const { 
    state, togglePlay, next, previous, seek, setVolume, 
    toggleShuffle, toggleRepeat, toggleFavorite, isFavorite,
    setShowQueue
  } = usePlayer();
  const { currentTrack, isPlaying, progress, volume, shuffle, repeat, queue } = state;
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentTime = currentTrack ? (progress / 100) * currentTrack.duration : 0;

  if (!currentTrack) {
    return (
      <div className="h-20 bg-sonora-warm border-t border-sonora-sand flex items-center justify-center">
        <p className="text-sm text-sonora-stone">Select a track to begin listening</p>
      </div>
    );
  }

  const liked = isFavorite(currentTrack.id);

  return (
    <div className="h-20 bg-sonora-warm border-t border-sonora-sand flex items-center px-4 gap-4">
      {/* Track Info */}
      <div className="flex items-center gap-3 w-56 min-w-0">
        <button 
          onClick={onOpenNowPlaying}
          className="flex-shrink-0 lg:cursor-default"
          aria-label="Open now playing"
        >
          <AlbumArt type="track" id={currentTrack.id} size="md" />
        </button>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-sonora-bark truncate">{currentTrack.title}</p>
          <p className="text-xs text-sonora-stone truncate">{currentTrack.artist}</p>
        </div>
        <button
          onClick={() => toggleFavorite(currentTrack.id)}
          className={`p-1.5 rounded-full transition-calm flex-shrink-0
            ${liked ? 'text-sonora-accent' : 'text-sonora-stone hover:text-sonora-accent'}`}
          aria-label={liked ? 'Unlike' : 'Like'}
        >
          <Heart size={14} fill={liked ? 'currentColor' : 'none'} />
        </button>
        {currentTrack.lossless && (
          <span className="text-[9px] font-semibold text-sonora-sage bg-sonora-sage/10 px-1.5 py-0.5 rounded flex-shrink-0 hidden lg:block">
            LOSSLESS
          </span>
        )}
      </div>

      {/* Controls */}
      <div className="flex-1 flex flex-col items-center gap-1">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={toggleShuffle}
            className={`p-1.5 rounded-full transition-calm hidden sm:block
              ${shuffle ? 'text-sonora-bark' : 'text-sonora-stone hover:text-sonora-earth'}`}
            aria-label="Toggle shuffle"
          >
            <Shuffle size={15} />
          </button>
          <button
            onClick={previous}
            className="p-1.5 text-sonora-earth hover:text-sonora-bark transition-calm"
            aria-label="Previous track"
          >
            <SkipBack size={18} />
          </button>
          <button
            onClick={togglePlay}
            className="w-9 h-9 rounded-full bg-sonora-bark text-sonora-cream flex items-center justify-center hover:bg-sonora-night transition-calm"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
          </button>
          <button
            onClick={next}
            className="p-1.5 text-sonora-earth hover:text-sonora-bark transition-calm"
            aria-label="Next track"
          >
            <SkipForward size={18} />
          </button>
          <button
            onClick={toggleRepeat}
            className={`p-1.5 rounded-full transition-calm hidden sm:block
              ${repeat !== 'off' ? 'text-sonora-bark' : 'text-sonora-stone hover:text-sonora-earth'}`}
            aria-label="Toggle repeat"
          >
            {repeat === 'one' ? <Repeat1 size={15} /> : <Repeat size={15} />}
          </button>
        </div>
        <div className="flex items-center gap-2 w-full max-w-md">
          <span className="text-[11px] text-sonora-stone w-10 text-right tabular-nums">{formatTime(currentTime)}</span>
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={(e) => seek(Number(e.target.value))}
            className="flex-1 h-1 cursor-pointer"
            aria-label="Seek"
          />
          <span className="text-[11px] text-sonora-stone w-10 tabular-nums">{formatTime(currentTrack.duration)}</span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-1.5 sm:gap-2 w-auto sm:w-56 justify-end">
        <button
          onClick={onOpenShare}
          className="p-1.5 text-sonora-stone hover:text-sonora-earth transition-calm hidden md:block"
          aria-label="Share"
          title="Share"
        >
          <Share2 size={16} />
        </button>
        <button
          onClick={onOpenSleepTimer}
          className="p-1.5 text-sonora-stone hover:text-sonora-earth transition-calm hidden sm:block"
          aria-label="Sleep timer"
          title="Sleep timer"
        >
          <Moon size={16} />
        </button>
        <button
          onClick={onOpenAudioSettings}
          className="p-1.5 text-sonora-stone hover:text-sonora-earth transition-calm hidden sm:block"
          aria-label="Audio settings"
          title="Audio settings"
        >
          <Sliders size={16} />
        </button>
        <button
          onClick={() => setShowQueue(true)}
          className={`p-1.5 rounded-full transition-calm relative
            ${queue.length > 0 ? 'text-sonora-bark' : 'text-sonora-stone hover:text-sonora-earth'}`}
          aria-label="View queue"
          title="Queue"
        >
          <ListMusic size={16} />
          {queue.length > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-sonora-accent text-white text-[8px] font-bold rounded-full flex items-center justify-center">
              {queue.length}
            </span>
          )}
        </button>
        <button
          onClick={onDeepListening}
          className="p-1.5 text-sonora-stone hover:text-sonora-bark transition-calm hidden md:block"
          aria-label="Deep Listening mode"
          title="Deep Listening"
        >
          <Headphones size={16} />
        </button>
        <div className="hidden lg:flex items-center gap-2">
          <button
            onClick={() => setVolume(volume === 0 ? 0.75 : 0)}
            className="p-1.5 text-sonora-stone hover:text-sonora-earth transition-calm"
            aria-label="Toggle mute"
          >
            {volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          <input
            type="range"
            min="0"
            max="100"
            value={volume * 100}
            onChange={(e) => setVolume(Number(e.target.value) / 100)}
            className="w-20 h-1 cursor-pointer"
            aria-label="Volume"
          />
        </div>
      </div>
    </div>
  );
}
