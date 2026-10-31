import { useEffect } from 'react';
import { usePlayer } from '../context/PlayerContext';

/**
 * Hook to update the browser tab title with current track info
 * Shows "♪ Track Title - Artist | Sonora" when playing
 */
export function useDocumentTitle() {
  const { state } = usePlayer();
  const { currentTrack, isPlaying } = state;

  useEffect(() => {
    const originalTitle = 'Sonora — Discover Less, Love More';
    
    if (currentTrack && isPlaying) {
      document.title = `♪ ${currentTrack.title} — ${currentTrack.artist} | Sonora`;
    } else if (currentTrack) {
      document.title = `⏸ ${currentTrack.title} — ${currentTrack.artist} | Sonora`;
    } else {
      document.title = originalTitle;
    }

    // Cleanup: restore original title when component unmounts
    return () => {
      document.title = originalTitle;
    };
  }, [currentTrack, isPlaying]);
}
