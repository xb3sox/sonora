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

    // Set metadata
    navigator.mediaSession.metadata = new MediaMetadata({
      title: currentTrack.title,
      artist: currentTrack.artist,
      album: currentTrack.album,
      artwork: [
        { src: '/sonora-icon-96.png', sizes: '96x96', type: 'image/png' },
        { src: '/sonora-icon-128.png', sizes: '128x128', type: 'image/png' },
        { src: '/sonora-icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: '/sonora-icon-256.png', sizes: '256x256', type: 'image/png' },
        { src: '/sonora-icon-384.png', sizes: '384x384', type: 'image/png' },
        { src: '/sonora-icon-512.png', sizes: '512x512', type: 'image/png' },
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

  }, [currentTrack, isPlaying, progress, togglePlay, next, previous, seek]);
}
