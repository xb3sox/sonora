import React from 'react';
import { Gauge } from 'lucide-react';

interface PlaybackSpeedControlProps {
  speed: number;
  onSpeedChange: (speed: number) => void;
}

const speedOptions = [0.5, 0.75, 1, 1.25, 1.5, 2];

/**
 * Playback speed control component
 * Allows users to adjust playback speed from 0.5x to 2x
 */
export function PlaybackSpeedControl({ speed, onSpeedChange }: PlaybackSpeedControlProps) {
  return (
    <div className="flex items-center gap-2">
      <Gauge size={16} className="text-sonora-stone" />
      <div className="flex items-center gap-1">
        {speedOptions.map(option => (
          <button
            key={option}
            onClick={() => onSpeedChange(option)}
            className={`px-2 py-1 rounded text-xs font-medium transition-calm
              ${speed === option
                ? 'bg-sonora-bark text-sonora-cream'
                : 'bg-sonora-warm text-sonora-earth hover:bg-sonora-sand'
              }`}
          >
            {option}x
          </button>
        ))}
      </div>
    </div>
  );
}
