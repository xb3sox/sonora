import React from 'react';
import { Wifi, WifiOff } from 'lucide-react';

export type AudioQuality = 'standard' | 'high' | 'lossless';

interface AudioQualityIndicatorProps {
  quality: AudioQuality;
  showLabel?: boolean;
}

const qualityConfig = {
  standard: {
    label: '128 kbps',
    color: 'text-sonora-stone',
    bgColor: 'bg-sonora-stone/10',
  },
  high: {
    label: '320 kbps',
    color: 'text-sonora-earth',
    bgColor: 'bg-sonora-earth/10',
  },
  lossless: {
    label: 'Lossless',
    color: 'text-sonora-sage',
    bgColor: 'bg-sonora-sage/10',
  },
};

/**
 * Audio quality indicator component
 * Shows the current streaming quality with visual feedback
 */
export function AudioQualityIndicator({ quality, showLabel = false }: AudioQualityIndicatorProps) {
  const config = qualityConfig[quality];

  return (
    <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded ${config.bgColor}`}>
      <Wifi size={12} className={config.color} />
      {showLabel && (
        <span className={`text-xs font-medium ${config.color}`}>
          {config.label}
        </span>
      )}
    </div>
  );
}
