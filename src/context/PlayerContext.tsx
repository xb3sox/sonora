import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { Track, PlayerState } from '../types';
import { tracks } from '../data';

interface PlayerContextType {
  state: PlayerState;
  play: (track: Track) => void;
  playAlbum: (trackIds: string[]) => void;
  togglePlay: () => void;
  next: () => void;
  previous: () => void;
  seek: (progress: number) => void;
  setVolume: (volume: number) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  addToQueue: (track: Track) => void;
}

const PlayerContext = createContext<PlayerContextType | null>(null);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<PlayerState>({
    currentTrack: null,
    isPlaying: false,
    progress: 0,
    volume: 0.75,
    queue: [],
    shuffle: false,
    repeat: 'off'
  });

  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (state.isPlaying && state.currentTrack) {
      intervalRef.current = window.setInterval(() => {
        setState(prev => {
          const increment = 100 / (prev.currentTrack?.duration || 300);
          const newProgress = prev.progress + increment;
          if (newProgress >= 100) {
            return { ...prev, progress: 0 };
          }
          return { ...prev, progress: newProgress };
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [state.isPlaying, state.currentTrack]);

  const play = useCallback((track: Track) => {
    setState(prev => ({
      ...prev,
      currentTrack: track,
      isPlaying: true,
      progress: 0
    }));
  }, []);

  const playAlbum = useCallback((trackIds: string[]) => {
    const albumTracks = trackIds.map(id => tracks.find(t => t.id === id)).filter(Boolean) as Track[];
    if (albumTracks.length > 0) {
      setState(prev => ({
        ...prev,
        currentTrack: albumTracks[0],
        queue: albumTracks.slice(1),
        isPlaying: true,
        progress: 0
      }));
    }
  }, []);

  const togglePlay = useCallback(() => {
    setState(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
  }, []);

  const next = useCallback(() => {
    setState(prev => {
      if (prev.queue.length === 0) {
        if (prev.repeat === 'one' && prev.currentTrack) {
          return { ...prev, progress: 0, isPlaying: true };
        }
        return { ...prev, isPlaying: false, progress: 0 };
      }
      const [nextTrack, ...rest] = prev.queue;
      return {
        ...prev,
        currentTrack: nextTrack,
        queue: rest,
        progress: 0,
        isPlaying: true
      };
    });
  }, []);

  const previous = useCallback(() => {
    setState(prev => ({
      ...prev,
      progress: 0
    }));
  }, []);

  const seek = useCallback((progress: number) => {
    setState(prev => ({ ...prev, progress }));
  }, []);

  const setVolume = useCallback((volume: number) => {
    setState(prev => ({ ...prev, volume }));
  }, []);

  const toggleShuffle = useCallback(() => {
    setState(prev => ({ ...prev, shuffle: !prev.shuffle }));
  }, []);

  const toggleRepeat = useCallback(() => {
    setState(prev => ({
      ...prev,
      repeat: prev.repeat === 'off' ? 'all' : prev.repeat === 'all' ? 'one' : 'off'
    }));
  }, []);

  const addToQueue = useCallback((track: Track) => {
    setState(prev => ({
      ...prev,
      queue: [...prev.queue, track]
    }));
  }, []);

  return (
    <PlayerContext.Provider value={{
      state,
      play,
      playAlbum,
      togglePlay,
      next,
      previous,
      seek,
      setVolume,
      toggleShuffle,
      toggleRepeat,
      addToQueue
    }}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) throw new Error('usePlayer must be used within PlayerProvider');
  return context;
}
