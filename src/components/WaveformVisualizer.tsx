import React, { useEffect, useRef } from 'react';

interface WaveformVisualizerProps {
  isPlaying: boolean;
  progress: number;
  className?: string;
}

/**
 * Audio Waveform Visualizer
 * Creates a beautiful waveform visualization that responds to playback
 */
export function WaveformVisualizer({ isPlaying, progress, className = '' }: WaveformVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

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
    const bars = 60;
    const barWidth = width / bars;
    const gap = 2;

    // Generate waveform data (simulated)
    const generateWaveformData = () => {
      const data: number[] = [];
      for (let i = 0; i < bars; i++) {
        // Create a natural-looking waveform
        const base = Math.sin((i / bars) * Math.PI * 2) * 0.3 + 0.5;
        const noise = Math.random() * 0.3;
        const variation = Math.sin(Date.now() / 1000 + i * 0.1) * 0.2;
        data.push(Math.max(0.1, Math.min(1, base + noise + variation)));
      }
      return data;
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      const waveformData = generateWaveformData();
      const progressBars = Math.floor((progress / 100) * bars);

      waveformData.forEach((value, i) => {
        const barHeight = value * height * 0.8;
        const x = i * barWidth;
        const y = (height - barHeight) / 2;

        // Color based on progress
        if (i < progressBars) {
          // Played portion - accent color
          ctx.fillStyle = '#C4956A'; // sonora-accent
          ctx.globalAlpha = 0.9;
        } else {
          // Unplayed portion - subtle color
          ctx.fillStyle = '#9B9285'; // sonora-stone
          ctx.globalAlpha = isPlaying ? 0.4 : 0.3;
        }

        // Draw bar with rounded ends (with fallback for older browsers)
        const radius = Math.min(barWidth / 2 - gap, barHeight / 2);
        const barX = x + gap / 2;
        const barY = y;
        const w = barWidth - gap;
        const h = barHeight;
        
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(barX, barY, w, h, radius);
        } else {
          // Fallback for older browsers
          ctx.moveTo(barX + radius, barY);
          ctx.lineTo(barX + w - radius, barY);
          ctx.quadraticCurveTo(barX + w, barY, barX + w, barY + radius);
          ctx.lineTo(barX + w, barY + h - radius);
          ctx.quadraticCurveTo(barX + w, barY + h, barX + w - radius, barY + h);
          ctx.lineTo(barX + radius, barY + h);
          ctx.quadraticCurveTo(barX, barY + h, barX, barY + h - radius);
          ctx.lineTo(barX, barY + radius);
          ctx.quadraticCurveTo(barX, barY, barX + radius, barY);
        }
        ctx.fill();
      });

      ctx.globalAlpha = 1;

      if (isPlaying) {
        animationRef.current = requestAnimationFrame(draw);
      }
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, progress]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width: '100%', height: '60px' }}
      aria-hidden="true"
    />
  );
}
