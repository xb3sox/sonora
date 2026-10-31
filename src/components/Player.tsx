import React from 'react';
import { usePlayer } from '../context/PlayerContext';
import { 
  Play, Pause, SkipBack, SkipForward, 
  Shuffle, Repeat, Repeat1, Volume2, VolumeX,
  Headphones
} from 'lucide-react';

interface PlayerBarProps {
  onDeepListening: () => void;
}

export function PlayerBar({ onDeepListening }: PlayerBarProps) {
  const { state, togglePlay, next, previous, seek, setVolume, toggleShuffle, toggleRepeat } = usePlayer();
  const { currentTrack, isPlaying, progress, volume, shuffle, repeat } = state;

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

  return (
    <div className="h-20 bg-sonora-warm border-t border-sonora-sand flex items-center px-4 gap-4">
      {/* Track Info */}
      <div className="flex items-center gap-3 w-64 min-w-0">
        <div className="w-12 h-12 rounded-lg bg-sonora-sand flex items-center justify-center flex-shrink-0 overflow-hidden">
          {currentTrack.cover ? (
            <img src={currentTrack.cover} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-sonora-accent/30 to-sonora-clay/20 flex items-center justify-center">
              <Headphones size={20} className="text-sonora-earth" />
            </div>
          )}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-sonora-bark truncate">{currentTrack.title}</p>
          <p className="text-xs text-sonora-stone truncate">{currentTrack.artist}</p>
        </div>
        {currentTrack.lossless && (
          <span className="text-[10px] font-semibold text-sonora-sage bg-sonora-sage/10 px-1.5 py-0.5 rounded flex-shrink-0">
            LOSSLESS
          </span>
        )}
      </div>

      {/* Controls */}
      <div className="flex-1 flex flex-col items-center gap-1">
        <div className="flex items-center gap-3">
          <button
            onClick={toggleShuffle}
            className={`p-1.5 rounded-full transition-calm ${shuffle ? 'text-sonora-bark' : 'text-sonora-stone hover:text-sonora-earth'}`}
            aria-label="Toggle shuffle"
          >
            <Shuffle size={16} />
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
            className={`p-1.5 rounded-full transition-calm ${repeat !== 'off' ? 'text-sonora-bark' : 'text-sonora-stone hover:text-sonora-earth'}`}
            aria-label="Toggle repeat"
          >
            {repeat === 'one' ? <Repeat1 size={16} /> : <Repeat size={16} />}
          </button>
        </div>
        <div className="flex items-center gap-2 w-full max-w-md">
          <span className="text-[11px] text-sonora-stone w-10 text-right">{formatTime(currentTime)}</span>
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={(e) => seek(Number(e.target.value))}
            className="flex-1 h-1 cursor-pointer"
            aria-label="Seek"
          />
          <span className="text-[11px] text-sonora-stone w-10">{formatTime(currentTrack.duration)}</span>
        </div>
      </div>

      {/* Volume & Deep Listening */}
      <div className="flex items-center gap-3 w-48 justify-end">
        <button
          onClick={onDeepListening}
          className="p-1.5 text-sonora-stone hover:text-sonora-bark transition-calm"
          aria-label="Deep Listening mode"
          title="Deep Listening"
        >
          <Headphones size={18} />
        </button>
        <button
          onClick={() => setVolume(volume === 0 ? 0.75 : 0)}
          className="p-1.5 text-sonora-stone hover:text-sonora-earth transition-calm"
          aria-label="Toggle mute"
        >
          {volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
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
  );
}
