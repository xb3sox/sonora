import React from 'react';
import { usePlayer } from '../context/PlayerContext';
import { AlbumArt } from './AlbumArt';
import { Play, Pause, SkipBack, SkipForward, Gauge } from 'lucide-react';

/**
 * Enhanced player bar with better visual feedback
 * Includes playback speed indicator and improved layout
 */
export function EnhancedPlayerBar() {
  const { state, togglePlay, next, previous, playbackSpeed } = usePlayer();
  const { currentTrack, isPlaying, progress } = state;

  if (!currentTrack) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentTime = (progress / 100) * currentTrack.duration;

  return (
    <div className="bg-sonora-warm border-t border-sonora-sand">
      {/* Progress Bar - Full Width */}
      <div className="h-1 bg-sonora-sand relative">
        <div
          className="h-full bg-gradient-to-r from-sonora-accent to-sonora-clay transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="px-4 py-3 flex items-center gap-4">
        {/* Track Info */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <AlbumArt type="track" id={currentTrack.id} size="md" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sonora-bark truncate">
              {currentTrack.title}
            </p>
            <p className="text-xs text-sonora-stone truncate">
              {currentTrack.artist}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={previous}
            className="p-2 text-sonora-earth hover:text-sonora-bark transition-calm"
            aria-label="Previous track"
          >
            <SkipBack size={18} />
          </button>
          <button
            onClick={togglePlay}
            className="w-10 h-10 rounded-full bg-sonora-bark text-sonora-cream flex items-center justify-center hover:bg-sonora-night transition-calm"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
          </button>
          <button
            onClick={next}
            className="p-2 text-sonora-earth hover:text-sonora-bark transition-calm"
            aria-label="Next track"
          >
            <SkipForward size={18} />
          </button>
        </div>

        {/* Time & Speed */}
        <div className="flex items-center gap-3 flex-1 justify-end">
          <span className="text-xs text-sonora-stone tabular-nums">
            {formatTime(currentTime)} / {formatTime(currentTrack.duration)}
          </span>
          
          {/* Playback Speed Indicator */}
          {playbackSpeed !== 1 && (
            <div className="flex items-center gap-1 px-2 py-1 bg-sonora-accent/10 rounded-full">
              <Gauge size={12} className="text-sonora-accent" />
              <span className="text-xs font-medium text-sonora-accent">
                {playbackSpeed}x
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
