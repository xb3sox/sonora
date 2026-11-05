import React, { useState, useEffect, useCallback } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { tracks, artists } from '../data';
import { Radio, Play, Pause, SkipForward, X } from 'lucide-react';
import { AlbumArt } from './AlbumArt';

interface ArtistRadioProps {
  artistId: string;
  onClose: () => void;
}

/**
 * Artist Radio - Creates a continuous stream of music based on an artist
 * Similar to Spotify's "Artist Radio" or Pandora's stations
 */
export function ArtistRadio({ artistId, onClose }: ArtistRadioProps) {
  const { play, state, togglePlay } = usePlayer();
  const [radioQueue, setRadioQueue] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const artist = artists.find(a => a.id === artistId);

  // Generate radio queue based on artist
  useEffect(() => {
    if (!artist) return;

    // Get tracks by the artist
    const artistTracks = tracks.filter(t => t.artistId === artistId);
    
    // Get similar artists (same genre)
    const similarArtists = artists.filter(a => 
      a.id !== artistId && 
      a.genres.some(g => artist.genres.includes(g))
    );

    // Get tracks from similar artists
    const similarTracks = similarArtists.flatMap(a => 
      tracks.filter(t => t.artistId === a.id)
    );

    // Mix them together (70% artist, 30% similar)
    const queue: string[] = [];
    const artistTrackIds = artistTracks.map(t => t.id);
    const similarTrackIds = similarTracks.map(t => t.id);

    // Create a shuffled queue
    for (let i = 0; i < 20; i++) {
      if (Math.random() < 0.7 && artistTrackIds.length > 0) {
        queue.push(artistTrackIds[Math.floor(Math.random() * artistTrackIds.length)]);
      } else if (similarTrackIds.length > 0) {
        queue.push(similarTrackIds[Math.floor(Math.random() * similarTrackIds.length)]);
      }
    }

    setRadioQueue(queue);
    setCurrentIndex(0);
    
    // Start playing first track
    if (queue.length > 0) {
      const firstTrack = tracks.find(t => t.id === queue[0]);
      if (firstTrack) play(firstTrack);
    }
  }, [artistId, artist, play]);

  // Handle next track - defined before useEffect to avoid stale closure
  const handleNext = useCallback(() => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < radioQueue.length) {
      setCurrentIndex(nextIndex);
      const nextTrack = tracks.find(t => t.id === radioQueue[nextIndex]);
      if (nextTrack) play(nextTrack);
    } else {
      // Regenerate queue if we've reached the end
      onClose();
    }
  }, [currentIndex, radioQueue, play, onClose]);

  // Auto-advance to next track when current ends
  useEffect(() => {
    if (!state.currentTrack || !state.isPlaying) return;

    const checkProgress = setInterval(() => {
      if (state.progress >= 99) {
        handleNext();
      }
    }, 1000);

    return () => clearInterval(checkProgress);
  }, [state.currentTrack, state.isPlaying, state.progress, handleNext]);

  if (!artist) return null;

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-sonora-bark via-sonora-earth to-sonora-bark flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6">
        <div className="flex items-center gap-3">
          <Radio size={24} className="text-sonora-accent animate-pulse" />
          <div>
            <p className="text-xs text-sonora-cream/60 uppercase tracking-wider">Radio</p>
            <p className="text-sm text-sonora-cream font-medium">{artist.name} Radio</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-full bg-sonora-cream/10 text-sonora-cream hover:bg-sonora-cream/20 transition-calm"
        >
          <X size={20} />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        {/* Album Art */}
        {state.currentTrack && (
          <div className="w-64 h-64 md:w-80 md:h-80 rounded-2xl mb-8 shadow-2xl overflow-hidden animate-float">
            <AlbumArt type="album" id={state.currentTrack.albumId} size="xl" className="w-full h-full" />
          </div>
        )}

        {/* Track Info */}
        {state.currentTrack && (
          <div className="text-center mb-8 max-w-md">
            <h2 className="font-display text-2xl md:text-3xl font-semibold text-sonora-cream mb-2">
              {state.currentTrack.title}
            </h2>
            <p className="text-sonora-cream/70">{state.currentTrack.artist}</p>
            <p className="text-xs text-sonora-cream/50 mt-2">
              Track {currentIndex + 1} of {radioQueue.length}
            </p>
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center gap-6">
          <button
            onClick={togglePlay}
            className="w-16 h-16 rounded-full bg-sonora-cream/10 backdrop-blur text-sonora-cream flex items-center justify-center hover:bg-sonora-cream/20 transition-calm"
          >
            {state.isPlaying ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
          </button>
          <button
            onClick={handleNext}
            className="p-3 text-sonora-cream/70 hover:text-sonora-cream transition-calm"
          >
            <SkipForward size={28} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full max-w-md mt-8">
          <div className="h-1 bg-sonora-cream/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-sonora-accent transition-all duration-1000"
              style={{ width: `${state.progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 text-center">
        <p className="text-xs text-sonora-cream/40 italic">
          Based on {artist.name} and similar artists
        </p>
      </div>
    </div>
  );
}
