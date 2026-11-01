import React, { createContext, useContext, useState, useCallback } from 'react';
import { Playlist } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface PlaylistContextType {
  playlists: Playlist[];
  createPlaylist: (name: string, description: string, trackIds?: string[]) => string;
  deletePlaylist: (id: string) => void;
  addTrackToPlaylist: (playlistId: string, trackId: string) => void;
  removeTrackFromPlaylist: (playlistId: string, trackId: string) => void;
  updatePlaylist: (id: string, updates: Partial<Pick<Playlist, 'name' | 'description'>>) => void;
}

const PlaylistContext = createContext<PlaylistContextType | null>(null);

// Generate a unique ID
function generateId(): string {
  return `playlist-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Default playlists
const defaultPlaylists: Playlist[] = [
  {
    id: 'p1',
    name: 'Morning Calm',
    description: 'Gentle tracks to start your day with intention',
    tracks: ['t1', 't8', 't3', 't6'],
    cover: '',
    isUserCreated: true
  },
  {
    id: 'p2',
    name: 'Deep Focus',
    description: 'Instrumental compositions for sustained concentration',
    tracks: ['t6', 't7', 't12', 't2', 't10'],
    cover: '',
    isUserCreated: true
  },
  {
    id: 'p3',
    name: 'Evening Wind-Down',
    description: 'Soft endings for a peaceful night',
    tracks: ['t9', 't3', 't8', 't1'],
    cover: '',
    isUserCreated: true
  },
  {
    id: 'p4',
    name: 'New Discoveries',
    description: 'Fresh music matched to your listening patterns',
    tracks: ['t4', 't5', 't11', 't7'],
    cover: '',
    isUserCreated: false
  }
];

export function PlaylistProvider({ children }: { children: React.ReactNode }) {
  const [savedPlaylists, setSavedPlaylists] = useLocalStorage<Playlist[]>('sonora-playlists', defaultPlaylists);

  const createPlaylist = useCallback((name: string, description: string, trackIds: string[] = []): string => {
    const id = generateId();
    const newPlaylist: Playlist = {
      id,
      name,
      description,
      tracks: trackIds,
      cover: '',
      isUserCreated: true
    };
    setSavedPlaylists(prev => [...prev, newPlaylist]);
    return id;
  }, [setSavedPlaylists]);

  const deletePlaylist = useCallback((id: string) => {
    setSavedPlaylists(prev => prev.filter(p => p.id !== id));
  }, [setSavedPlaylists]);

  const addTrackToPlaylist = useCallback((playlistId: string, trackId: string) => {
    setSavedPlaylists(prev => prev.map(p => {
      if (p.id === playlistId && !p.tracks.includes(trackId)) {
        return { ...p, tracks: [...p.tracks, trackId] };
      }
      return p;
    }));
  }, [setSavedPlaylists]);

  const removeTrackFromPlaylist = useCallback((playlistId: string, trackId: string) => {
    setSavedPlaylists(prev => prev.map(p => {
      if (p.id === playlistId) {
        return { ...p, tracks: p.tracks.filter(id => id !== trackId) };
      }
      return p;
    }));
  }, [setSavedPlaylists]);

  const updatePlaylist = useCallback((id: string, updates: Partial<Pick<Playlist, 'name' | 'description'>>) => {
    setSavedPlaylists(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, ...updates };
      }
      return p;
    }));
  }, [setSavedPlaylists]);

  return (
    <PlaylistContext.Provider value={{
      playlists: savedPlaylists,
      createPlaylist,
      deletePlaylist,
      addTrackToPlaylist,
      removeTrackFromPlaylist,
      updatePlaylist,
    }}>
      {children}
    </PlaylistContext.Provider>
  );
}

export function usePlaylists() {
  const context = useContext(PlaylistContext);
  if (!context) throw new Error('usePlaylists must be used within PlaylistProvider');
  return context;
}
