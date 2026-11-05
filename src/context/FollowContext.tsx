import React, { createContext, useContext, useState, useCallback } from 'react';
import { Artist } from '../types';

interface FollowContextType {
  followedArtists: Set<string>;
  followArtist: (artistId: string) => void;
  unfollowArtist: (artistId: string) => void;
  isFollowing: (artistId: string) => boolean;
}

const FollowContext = createContext<FollowContextType | null>(null);

export function FollowProvider({ children }: { children: React.ReactNode }) {
  const [followedArtists, setFollowedArtists] = useState<Set<string>>(new Set(['a1', 'a3']));

  const followArtist = useCallback((artistId: string) => {
    setFollowedArtists(prev => new Set([...prev, artistId]));
  }, []);

  const unfollowArtist = useCallback((artistId: string) => {
    setFollowedArtists(prev => {
      const next = new Set(prev);
      next.delete(artistId);
      return next;
    });
  }, []);

  const isFollowing = useCallback((artistId: string) => {
    return followedArtists.has(artistId);
  }, [followedArtists]);

  return (
    <FollowContext.Provider value={{
      followedArtists,
      followArtist,
      unfollowArtist,
      isFollowing,
    }}>
      {children}
    </FollowContext.Provider>
  );
}

export function useFollow() {
  const context = useContext(FollowContext);
  if (!context) throw new Error('useFollow must be used within FollowProvider');
  return context;
}
