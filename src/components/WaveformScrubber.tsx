import React, { useRef, useEffect } from 'react';
import { usePlayer } from '../context/PlayerContext';

interface WaveformScrubberProps {
  onSeek?: (progress: number) => void;
}

export function WaveformScrubber({ onSeek }: WaveformScrubberProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { state, seek } = usePlayer();
  const { progress, currentTrack } = state;

  // Generate waveform data (simulated based on track)
  const generateWaveform = () => {
    const bars = 100;
    const data: number[] = [];
    
    // Use track ID as seed for consistent waveform per track
    const seed = currentTrack ? currentTrack.id.charCodeAt(0) : 42;
    
    for (let i = 0; i < bars; i++) {
      // Create varied waveform based on seed
      const base = Math.sin((i / bars) * Math.PI * 2 + seed) * 0.3 + 0.5;
      const noise = Math.sin(i * seed * 0.1) * 0.2;
      data.push(Math.max(0.2, Math.min(1, base + noise)));
    }
    
    return data;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;
    const waveform = generateWaveform();
    const barWidth = width / waveform.length;
    const gap = 1;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw waveform bars
    waveform.forEach((value, i) => {
      const barHeight = value * height * 0.8;
      const x = i * barWidth;
      const y = (height - barHeight) / 2;
      const progressPercent = (i / waveform.length) * 100;

      // Color based on progress
      if (progressPercent <= progress) {
        ctx.fillStyle = '#C4956A'; // sonora-accent
        ctx.globalAlpha = 0.9;
      } else {
        ctx.fillStyle = '#9B9285'; // sonora-stone
        ctx.globalAlpha = 0.4;
      }

      // Draw bar
      ctx.fillRect(x + gap / 2, y, barWidth - gap, barHeight);
    });

    ctx.globalAlpha = 1;
  }, [progress, currentTrack]);

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const clickProgress = (x / rect.width) * 100;

    if (onSeek) {
      onSeek(clickProgress);
    } else {
      seek(clickProgress);
    }
  };

  return (
    <div className="relative w-full h-12 cursor-pointer group">
      <canvas
        ref={canvasRef}
        onClick={handleClick}
        className="w-full h-full transition-opacity group-hover:opacity-80"
        style={{ width: '100%', height: '100%' }}
      />
      
      {/* Progress indicator line */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-sonora-accent pointer-events-none transition-all duration-100"
        style={{ left: `${progress}%` }}
      >
        <div className="absolute -top-1 -left-1 w-2.5 h-2.5 bg-sonora-accent rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </div>
  );
}
