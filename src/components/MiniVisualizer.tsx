import React from 'react';
import { usePlayer } from '../context/PlayerContext';

interface MiniVisualizerProps {
  className?: string;
}

/**
 * Mini audio visualizer for the player bar
 * Shows subtle animated bars when music is playing
 */
export function MiniVisualizer({ className = '' }: MiniVisualizerProps) {
  const { state } = usePlayer();
  const { isPlaying } = state;

  if (!isPlaying) return null;

  return (
    <div className={`flex items-end gap-0.5 h-4 ${className}`} aria-hidden="true">
      <span 
        className="w-0.5 bg-sonora-accent rounded-full animate-pulse" 
        style={{ 
          height: '60%', 
          animationDelay: '0ms',
          animationDuration: '0.8s'
        }} 
      />
      <span 
        className="w-0.5 bg-sonora-accent rounded-full animate-pulse" 
        style={{ 
          height: '100%', 
          animationDelay: '150ms',
          animationDuration: '0.8s'
        }} 
      />
      <span 
        className="w-0.5 bg-sonora-accent rounded-full animate-pulse" 
        style={{ 
          height: '40%', 
          animationDelay: '300ms',
          animationDuration: '0.8s'
        }} 
      />
      <span 
        className="w-0.5 bg-sonora-accent rounded-full animate-pulse" 
        style={{ 
          height: '80%', 
          animationDelay: '450ms',
          animationDuration: '0.8s'
        }} 
      />
    </div>
  );
}
