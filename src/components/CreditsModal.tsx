import React from 'react';
import { X, Music2, User, Disc3, Calendar, MapPin } from 'lucide-react';
import { Track } from '../types';

interface CreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
  track: Track | null;
}

export function CreditsModal({ isOpen, onClose, track }: CreditsModalProps) {
  if (!isOpen || !track) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-sonora-bark/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:w-[480px] max-h-[80vh] bg-sonora-cream rounded-t-2xl sm:rounded-2xl shadow-2xl animate-slide-up flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-sonora-sand flex-shrink-0">
          <div className="flex items-center gap-2">
            <Music2 size={18} className="text-sonora-bark" />
            <h2 className="font-display text-lg font-semibold text-sonora-bark">Track Credits</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-sonora-warm text-sonora-stone hover:text-sonora-bark transition-calm"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Track Info */}
        <div className="px-5 py-4 border-b border-sonora-sand flex-shrink-0">
          <p className="text-lg font-semibold text-sonora-bark">{track.title}</p>
          <p className="text-sm text-sonora-stone">{track.artist} · {track.album}</p>
        </div>

        {/* Credits Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Songwriters */}
          {track.credits.songwriter && track.credits.songwriter.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <User size={16} className="text-sonora-accent" />
                <h3 className="text-sm font-semibold text-sonora-bark uppercase tracking-wider">
                  Songwriters
                </h3>
              </div>
              <div className="space-y-2">
                {track.credits.songwriter.map((writer, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-sonora-warm rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-sonora-sand flex items-center justify-center">
                      <User size={18} className="text-sonora-earth" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-sonora-bark">{writer}</p>
                      <p className="text-xs text-sonora-stone">Songwriter</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Production Credits */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Disc3 size={16} className="text-sonora-accent" />
              <h3 className="text-sm font-semibold text-sonora-bark uppercase tracking-wider">
                Production
              </h3>
            </div>
            <div className="bg-sonora-warm rounded-lg p-4 space-y-3">
              {track.credits.producer && (
                <div className="flex items-start gap-3">
                  <span className="text-xs font-semibold text-sonora-stone uppercase tracking-wider min-w-[80px]">
                    Producer
                  </span>
                  <span className="text-sm text-sonora-bark">{track.credits.producer}</span>
                </div>
              )}
              {track.credits.engineer && (
                <div className="flex items-start gap-3">
                  <span className="text-xs font-semibold text-sonora-stone uppercase tracking-wider min-w-[80px]">
                    Engineer
                  </span>
                  <span className="text-sm text-sonora-bark">{track.credits.engineer}</span>
                </div>
              )}
              {track.credits.label && (
                <div className="flex items-start gap-3">
                  <span className="text-xs font-semibold text-sonora-stone uppercase tracking-wider min-w-[80px]">
                    Label
                  </span>
                  <span className="text-sm text-sonora-bark">{track.credits.label}</span>
                </div>
              )}
            </div>
          </div>

          {/* Recording Info */}
          {track.credits.recorded && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <MapPin size={16} className="text-sonora-accent" />
                <h3 className="text-sm font-semibold text-sonora-bark uppercase tracking-wider">
                  Recording
                </h3>
              </div>
              <div className="bg-sonora-warm rounded-lg p-4">
                <p className="text-sm text-sonora-bark">{track.credits.recorded}</p>
              </div>
            </div>
          )}

          {/* Technical Info */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Music2 size={16} className="text-sonora-accent" />
              <h3 className="text-sm font-semibold text-sonora-bark uppercase tracking-wider">
                Technical
              </h3>
            </div>
            <div className="bg-sonora-warm rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-sonora-stone">Duration</span>
                <span className="text-sm font-medium text-sonora-bark">
                  {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-sonora-stone">Quality</span>
                <span className="text-sm font-medium text-sonora-bark">
                  {track.lossless ? 'Lossless (24-bit/96kHz)' : 'Standard (320kbps)'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-sonora-stone">Genre</span>
                <span className="text-sm font-medium text-sonora-bark">{track.genre}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-sonora-stone">Year</span>
                <span className="text-sm font-medium text-sonora-bark">{track.year}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-sonora-sand text-center flex-shrink-0">
          <p className="text-xs text-sonora-stone italic">
            Supporting artists through transparent credits
          </p>
        </div>
      </div>
    </div>
  );
}
