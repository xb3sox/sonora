import React, { useEffect, useRef } from 'react';
import { usePlayer } from '../context/PlayerContext';

interface AudioVisualizerProps {
  variant?: 'bars' | 'wave' | 'circle';
  height?: number;
  color?: string;
  className?: string;
}

/**
 * Audio waveform visualizer component
 * Creates a calm, beautiful visualization of audio playback
 */
export function AudioVisualizer({ 
  variant = 'bars', 
  height = 40, 
  color = '#C4956A',
  className = '' 
}: AudioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const { state } = usePlayer();
  const { isPlaying, progress } = state;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Generate fake audio data (in a real app, this would come from Web Audio API)
    const generateAudioData = () => {
      const bars = 64;
      const data = new Array(bars).fill(0);
      
      if (isPlaying) {
        for (let i = 0; i < bars; i++) {
          // Create a smooth, organic waveform
          const base = Math.sin((i / bars) * Math.PI) * 0.5;
          const noise = Math.random() * 0.3;
          const time = Date.now() / 1000;
          const wave = Math.sin(time * 2 + i * 0.1) * 0.2;
          data[i] = Math.max(0.1, Math.min(1, base + noise + wave));
        }
      } else {
        // Gentle idle animation
        const time = Date.now() / 2000;
        for (let i = 0; i < bars; i++) {
          data[i] = 0.1 + Math.sin(time + i * 0.2) * 0.05;
        }
      }
      
      return data;
    };

    // Animation loop
    const animate = () => {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      const data = generateAudioData();
      const barWidth = rect.width / data.length;

      if (variant === 'bars') {
        // Draw bars
        data.forEach((value, i) => {
          const barHeight = value * rect.height;
          const x = i * barWidth;
          const y = rect.height - barHeight;

          ctx.fillStyle = color;
          ctx.globalAlpha = 0.6 + value * 0.4;
          ctx.fillRect(x + 1, y, barWidth - 2, barHeight);
        });
      } else if (variant === 'wave') {
        // Draw smooth wave
        ctx.beginPath();
        ctx.moveTo(0, rect.height / 2);

        data.forEach((value, i) => {
          const x = i * barWidth;
          const y = rect.height / 2 - value * rect.height / 2;
          
          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            const prevX = (i - 1) * barWidth;
            const prevY = rect.height / 2 - data[i - 1] * rect.height / 2;
            const cpX = (prevX + x) / 2;
            ctx.quadraticCurveTo(prevX, prevY, cpX, (prevY + y) / 2);
          }
        });

        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.8;
        ctx.stroke();
      } else if (variant === 'circle') {
        // Draw circular visualizer
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const radius = Math.min(centerX, centerY) * 0.6;

        ctx.beginPath();
        data.forEach((value, i) => {
          const angle = (i / data.length) * Math.PI * 2;
          const r = radius + value * radius * 0.5;
          const x = centerX + Math.cos(angle) * r;
          const y = centerY + Math.sin(angle) * r;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        });
        ctx.closePath();

        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.7;
        ctx.stroke();
      }

      ctx.globalAlpha = 1;
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, variant, color]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width: '100%', height: `${height}px` }}
    />
  );
}
