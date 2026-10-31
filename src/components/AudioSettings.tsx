import React, { useState } from 'react';
import { X, Sliders, Waves } from 'lucide-react';

interface AudioSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const eqPresets = [
  { id: 'flat', label: 'Flat', bands: [0, 0, 0, 0, 0] },
  { id: 'warm', label: 'Warm', bands: [2, 1, 0, -1, -2] },
  { id: 'bright', label: 'Bright', bands: [-2, -1, 0, 1, 2] },
  { id: 'vocal', label: 'Vocal', bands: [-1, 1, 3, 1, -1] },
  { id: 'bass', label: 'Bass Boost', bands: [4, 2, 0, 0, 0] },
  { id: 'classical', label: 'Classical', bands: [2, 1, 0, 1, 2] },
];

const freqLabels = ['60Hz', '250Hz', '1kHz', '4kHz', '12kHz'];

export function AudioSettings({ isOpen, onClose }: AudioSettingsProps) {
  const [selectedPreset, setSelectedPreset] = useState('flat');
  const [crossfade, setCrossfade] = useState(0);
  const [gapless, setGapless] = useState(true);
  const [volumeNorm, setVolumeNorm] = useState(true);

  if (!isOpen) return null;

  const currentBands = eqPresets.find(p => p.id === selectedPreset)?.bands || [0, 0, 0, 0, 0];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-sonora-bark/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:w-[480px] max-h-[85vh] bg-sonora-cream rounded-t-2xl sm:rounded-2xl shadow-2xl animate-slide-up overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-sonora-cream flex items-center justify-between p-5 border-b border-sonora-sand z-10">
          <div className="flex items-center gap-2">
            <Sliders size={18} className="text-sonora-bark" />
            <h2 className="font-display text-lg font-semibold text-sonora-bark">Audio Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-sonora-warm text-sonora-stone hover:text-sonora-bark transition-calm"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-6">
          {/* Equalizer */}
          <section>
            <h3 className="text-sm font-semibold text-sonora-bark mb-3">Equalizer</h3>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {eqPresets.map(preset => (
                <button
                  key={preset.id}
                  onClick={() => setSelectedPreset(preset.id)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-calm
                    ${selectedPreset === preset.id
                      ? 'bg-sonora-bark text-sonora-cream'
                      : 'bg-sonora-warm text-sonora-earth hover:bg-sonora-sand'
                    }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
            {/* Visual EQ */}
            <div className="bg-sonora-warm rounded-xl p-4">
              <div className="flex items-end justify-between gap-2 h-24">
                {currentBands.map((value, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full flex flex-col items-center justify-end h-16">
                      <div
                        className={`w-6 rounded-sm transition-all duration-300 ${
                          value >= 0 ? 'bg-sonora-accent' : 'bg-sonora-earth'
                        }`}
                        style={{ height: `${Math.abs(value) * 12 + 8}px` }}
                      />
                    </div>
                    <span className="text-[9px] text-sonora-stone">{freqLabels[i]}</span>
                    <span className="text-[9px] text-sonora-stone tabular-nums">
                      {value > 0 ? '+' : ''}{value}dB
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Crossfade */}
          <section>
            <h3 className="text-sm font-semibold text-sonora-bark mb-3">Crossfade</h3>
            <div className="bg-sonora-warm rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-sonora-earth">Duration</span>
                <span className="text-sm font-medium text-sonora-bark tabular-nums">{crossfade}s</span>
              </div>
              <input
                type="range"
                min="0"
                max="12"
                value={crossfade}
                onChange={(e) => setCrossfade(Number(e.target.value))}
                className="w-full"
              />
              <p className="text-xs text-sonora-stone mt-2">
                {crossfade === 0 ? 'No crossfade between tracks' : `Smooth ${crossfade}s transition between tracks`}
              </p>
            </div>
          </section>

          {/* Playback Options */}
          <section>
            <h3 className="text-sm font-semibold text-sonora-bark mb-3">Playback</h3>
            <div className="bg-sonora-warm rounded-xl divide-y divide-sonora-sand">
              <div className="flex items-center justify-between p-4">
                <div>
                  <p className="text-sm font-medium text-sonora-bark">Gapless Playback</p>
                  <p className="text-xs text-sonora-stone">Seamless transitions between tracks</p>
                </div>
                <button
                  onClick={() => setGapless(!gapless)}
                  className={`w-11 h-6 rounded-full transition-calm relative ${gapless ? 'bg-sonora-bark' : 'bg-sonora-sand'}`}
                >
                  <div className="w-5 h-5 rounded-full bg-white shadow-sm absolute top-0.5 transition-calm"
                    style={{ left: gapless ? '22px' : '2px' }}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between p-4">
                <div>
                  <p className="text-sm font-medium text-sonora-bark">Volume Normalization</p>
                  <p className="text-xs text-sonora-stone">Even volume across tracks</p>
                </div>
                <button
                  onClick={() => setVolumeNorm(!volumeNorm)}
                  className={`w-11 h-6 rounded-full transition-calm relative ${volumeNorm ? 'bg-sonora-bark' : 'bg-sonora-sand'}`}
                >
                  <div className="w-5 h-5 rounded-full bg-white shadow-sm absolute top-0.5 transition-calm"
                    style={{ left: volumeNorm ? '22px' : '2px' }}
                  />
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
