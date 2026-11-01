import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { Track, PlayerState } from '../types';
import { tracks } from '../data';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface PlayerContextType {
  state: PlayerState;
  favorites: Set<string>;
  toasts: Toast[];
  showQueue: boolean;
  playbackSpeed: number;
  crossfadeDuration: number;
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
  removeFromQueue: (index: number) => void;
  reorderQueue: (fromIndex: number, toIndex: number) => void;
  toggleFavorite: (trackId: string) => void;
  isFavorite: (trackId: string) => boolean;
  setShowQueue: (show: boolean) => void;
  setPlaybackSpeed: (speed: number) => void;
  setCrossfadeDuration: (duration: number) => void;
  addToast: (message: string, type?: 'success' | 'info' | 'error') => void;
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

  const [favoritesArray, setFavoritesArray] = useLocalStorage<string[]>('sonora-favorites', ['t1', 't6', 't8']);
  const [favorites, setFavorites] = useState<Set<string>>(new Set(favoritesArray));
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [showQueue, setShowQueue] = useState(false);
  const [playbackSpeed, setPlaybackSpeedState] = useLocalStorage<number>('sonora-playback-speed', 1);
  const [crossfadeDuration, setCrossfadeDurationState] = useLocalStorage<number>('sonora-crossfade', 0);

  const intervalRef = useRef<number | null>(null);

  // Auto-advance to next track when current track ends
  useEffect(() => {
    if (state.isPlaying && state.currentTrack) {
      intervalRef.current = window.setInterval(() => {
        setState(prev => {
          const increment = 100 / (prev.currentTrack?.duration || 300);
          const newProgress = prev.progress + increment;
          
          // Track ended - advance to next
          if (newProgress >= 100) {
            // Handle repeat modes
            if (prev.repeat === 'one') {
              return { ...prev, progress: 0 };
            }
            
            // Move to next track in queue
            if (prev.queue.length > 0) {
              const [nextTrack, ...rest] = prev.queue;
              return {
                ...prev,
                currentTrack: nextTrack,
                queue: prev.repeat === 'all' ? [...rest, prev.currentTrack!] : rest,
                progress: 0,
              };
            }
            
            // No more tracks in queue
            return { ...prev, isPlaying: false, progress: 0 };
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

  const addToast = useCallback((message: string, type: 'success' | 'info' | 'error' = 'info') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

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
    addToast(`Added "${track.title}" to queue`, 'success');
  }, [addToast]);

  const removeFromQueue = useCallback((index: number) => {
    setState(prev => ({
      ...prev,
      queue: prev.queue.filter((_, i) => i !== index)
    }));
  }, []);

  const reorderQueue = useCallback((fromIndex: number, toIndex: number) => {
    setState(prev => {
      const newQueue = [...prev.queue];
      const [removed] = newQueue.splice(fromIndex, 1);
      newQueue.splice(toIndex, 0, removed);
      return { ...prev, queue: newQueue };
    });
  }, []);

  const setPlaybackSpeed = useCallback((speed: number) => {
    setPlaybackSpeedState(speed);
    addToast(`Playback speed: ${speed}x`, 'info');
  }, [setPlaybackSpeedState, addToast]);

  const setCrossfadeDuration = useCallback((duration: number) => {
    setCrossfadeDurationState(duration);
    addToast(`Crossfade: ${duration}s`, 'info');
  }, [setCrossfadeDurationState, addToast]);

  const toggleFavorite = useCallback((trackId: string) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(trackId)) {
        next.delete(trackId);
        addToast('Removed from Liked Tracks', 'info');
      } else {
        next.add(trackId);
        addToast('Added to Liked Tracks', 'success');
      }
      // Persist to localStorage
      setFavoritesArray(Array.from(next));
      return next;
    });
  }, [addToast, setFavoritesArray]);

  const isFavorite = useCallback((trackId: string) => {
    return favorites.has(trackId);
  }, [favorites]);

  return (
    <PlayerContext.Provider value={{
      state,
      favorites,
      toasts,
      showQueue,
      playbackSpeed,
      crossfadeDuration,
      play,
      playAlbum,
      togglePlay,
      next,
      previous,
      seek,
      setVolume,
      toggleShuffle,
      toggleRepeat,
      addToQueue,
      removeFromQueue,
      reorderQueue,
      toggleFavorite,
      isFavorite,
      setShowQueue,
      setPlaybackSpeed,
      setCrossfadeDuration,
      addToast,
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
