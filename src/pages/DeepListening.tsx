import React, { useState } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { tracks } from '../data';
import { View } from '../types';
import { AlbumArt } from '../components/AlbumArt';
import { 
  ArrowLeft, Headphones, Play, Pause, 
  SkipForward, SkipBack, Info, Disc3
} from 'lucide-react';

interface DeepListeningPageProps {
  onNavigate: (view: View) => void;
}

export function DeepListeningPage({ onNavigate }: DeepListeningPageProps) {
  const { state, togglePlay, next, previous } = usePlayer();
  const { currentTrack, isPlaying, progress } = state;
  const [showCredits, setShowCredits] = useState(false);

  // Auto-select a track for deep listening if none playing
  const track = currentTrack || tracks[0];

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentTime = (progress / 100) * track.duration;

  return (
    <div className="deep-listening-mode min-h-full flex flex-col">
      {/* Top Bar */}
      <div className="flex items-center justify-between p-6">
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 text-sm text-sonora-cream/60 hover:text-sonora-cream transition-calm"
        >
          <ArrowLeft size={16} /> Exit Deep Listening
        </button>
        <div className="flex items-center gap-2 text-sonora-cream/40">
          <Headphones size={16} className="animate-breathe" />
          <span className="text-xs">Deep Listening</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 pb-20">
        {/* Album Art */}
        <div className="w-56 h-56 sm:w-72 sm:h-72 md:w-80 md:h-80 rounded-2xl mb-8 shadow-2xl animate-float overflow-hidden">
          <AlbumArt type="album" id={track.albumId} size="xl" className="w-full h-full" />
        </div>

        {/* Track Info */}
        <div className="text-center mb-8 max-w-md">
          <h1 className="font-display text-2xl md:text-3xl font-semibold text-sonora-cream mb-2">
            {track.title}
          </h1>
          <p className="text-sonora-cream/60 text-sm mb-1">{track.artist}</p>
          <p className="text-sonora-cream/40 text-xs">{track.album} · {track.year}</p>
          {track.lossless && (
            <span className="inline-block mt-2 text-[10px] font-semibold text-sonora-accent bg-sonora-accent/10 px-2 py-0.5 rounded-full">
              Lossless · 24-bit/96kHz
            </span>
          )}
        </div>

        {/* Progress */}
        <div className="w-full max-w-md mb-8">
          <div className="flex items-center gap-3">
            <span className="text-xs text-sonora-cream/40 w-10 text-right tabular-nums">{formatTime(currentTime)}</span>
            <div className="flex-1 h-1 bg-sonora-cream/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-sonora-accent/60 rounded-full transition-all duration-1000"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs text-sonora-cream/40 w-10 tabular-nums">{formatTime(track.duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-6">
          <button
            onClick={previous}
            className="p-3 text-sonora-cream/60 hover:text-sonora-cream transition-calm"
          >
            <SkipBack size={24} />
          </button>
          <button
            onClick={togglePlay}
            className="w-14 h-14 rounded-full bg-sonora-cream/10 backdrop-blur text-sonora-cream flex items-center justify-center hover:bg-sonora-cream/20 transition-calm"
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
          </button>
          <button
            onClick={next}
            className="p-3 text-sonora-cream/60 hover:text-sonora-cream transition-calm"
          >
            <SkipForward size={24} />
          </button>
        </div>

        {/* Credits Toggle */}
        <button
          onClick={() => setShowCredits(!showCredits)}
          className="mt-8 flex items-center gap-2 text-sm text-sonora-cream/40 hover:text-sonora-cream/70 transition-calm"
        >
          <Info size={14} />
          {showCredits ? 'Hide credits' : 'View credits'}
        </button>

        {/* Credits Panel */}
        {showCredits && (
          <div className="mt-4 bg-sonora-cream/5 backdrop-blur rounded-xl p-6 max-w-md w-full">
            <h3 className="text-sm font-semibold text-sonora-cream mb-4 flex items-center gap-2">
              <Info size={14} /> Track Credits
            </h3>
            <div className="space-y-3 text-sm">
              {track.credits.songwriter && (
                <div>
                  <p className="text-sonora-cream/40 text-xs uppercase tracking-wider mb-1">Written by</p>
                  <p className="text-sonora-cream/80">{track.credits.songwriter.join(', ')}</p>
                </div>
              )}
              {track.credits.producer && (
                <div>
                  <p className="text-sonora-cream/40 text-xs uppercase tracking-wider mb-1">Produced by</p>
                  <p className="text-sonora-cream/80">{track.credits.producer}</p>
                </div>
              )}
              {track.credits.engineer && (
                <div>
                  <p className="text-sonora-cream/40 text-xs uppercase tracking-wider mb-1">Engineered by</p>
                  <p className="text-sonora-cream/80">{track.credits.engineer}</p>
                </div>
              )}
              {track.credits.label && (
                <div>
                  <p className="text-sonora-cream/40 text-xs uppercase tracking-wider mb-1">Label</p>
                  <p className="text-sonora-cream/80">{track.credits.label}</p>
                </div>
              )}
              {track.credits.recorded && (
                <div>
                  <p className="text-sonora-cream/40 text-xs uppercase tracking-wider mb-1">Recorded</p>
                  <p className="text-sonora-cream/80">{track.credits.recorded}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Ambient Message */}
      <div className="text-center pb-8">
        <p className="text-xs text-sonora-cream/30 italic">
          "Listen with full attention. Let the music unfold."
        </p>
      </div>
    </div>
  );
}
