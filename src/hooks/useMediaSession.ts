import { useEffect } from 'react';
import { usePlayer } from '../context/PlayerContext';

/**
 * Hook to integrate with the browser's Media Session API
 * Provides OS-level playback controls (lock screen, notification center, etc.)
 */
export function useMediaSession() {
  const { state, togglePlay, next, previous, seek } = usePlayer();
  const { currentTrack, isPlaying, progress } = state;

  useEffect(() => {
    if (!('mediaSession' in navigator)) return;
    if (!currentTrack) return;

    // Set metadata - using SVG data URL for artwork since we don't have actual image files
    const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
      <rect width="512" height="512" fill="#3D3428"/>
      <circle cx="256" cy="256" r="120" fill="#C4956A" opacity="0.8"/>
      <circle cx="256" cy="256" r="60" fill="#FAF8F5"/>
    </svg>`;
    
    const artworkUrl = `data:image/svg+xml;base64,${btoa(svgIcon)}`;

    try {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentTrack.title,
        artist: currentTrack.artist,
        album: currentTrack.album,
        artwork: [
          { src: artworkUrl, sizes: '512x512', type: 'image/svg+xml' },
        ],
      });

      // Set playback state
      navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';

      // Set position state
      const currentTime = (progress / 100) * currentTrack.duration;
      try {
        navigator.mediaSession.setPositionState({
          duration: currentTrack.duration,
          playbackRate: 1.0,
          position: currentTime,
        });
      } catch (e) {
        // setPositionState may not be supported in all browsers
      }

      // Set action handlers
      navigator.mediaSession.setActionHandler('play', () => {
        if (!isPlaying) togglePlay();
      });

      navigator.mediaSession.setActionHandler('pause', () => {
        if (isPlaying) togglePlay();
      });

      navigator.mediaSession.setActionHandler('previoustrack', () => {
        previous();
      });

      navigator.mediaSession.setActionHandler('nexttrack', () => {
        next();
      });

      navigator.mediaSession.setActionHandler('seekbackward', (details) => {
        const skipTime = details.seekOffset || 10;
        const newProgress = Math.max(0, progress - (skipTime / currentTrack.duration) * 100);
        seek(newProgress);
      });

      navigator.mediaSession.setActionHandler('seekforward', (details) => {
        const skipTime = details.seekOffset || 10;
        const newProgress = Math.min(100, progress + (skipTime / currentTrack.duration) * 100);
        seek(newProgress);
      });

      navigator.mediaSession.setActionHandler('seekto', (details) => {
        if (details.seekTime !== undefined) {
          const newProgress = (details.seekTime / currentTrack.duration) * 100;
          seek(newProgress);
        }
      });

      navigator.mediaSession.setActionHandler('stop', () => {
        if (isPlaying) togglePlay();
      });
    } catch (error) {
      // MediaSession API may not be fully supported
      console.warn('MediaSession API error:', error);
    }
  }, [currentTrack, isPlaying, progress, togglePlay, next, previous, seek]);
}
