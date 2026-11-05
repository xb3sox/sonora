import React, { useRef, useState } from 'react';
import { X, Download, Copy, Check, Music2, ListMusic } from 'lucide-react';
import { Playlist } from '../types';
import { tracks } from '../data';
import { getPlaylistGradient } from '../data';

interface PlaylistCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  playlist: Playlist | null;
}

/**
 * Shareable playlist card - creates a beautiful, screenshot-ready card
 * with the playlist info and top tracks
 */
export function PlaylistCardModal({ isOpen, onClose, playlist }: PlaylistCardModalProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen || !playlist) return null;

  const playlistTracks = playlist.tracks
    .map(id => tracks.find(t => t.id === id))
    .filter(Boolean)
    .slice(0, 5);

  const handleCopy = async () => {
    const trackList = playlistTracks.map(t => `• ${t?.title} - ${t?.artist}`).join('\n');
    const text = `${playlist.name}\n${playlist.description}\n\n${trackList}\n\nvia Sonora`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const gradient = getPlaylistGradient(playlist.id);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-sonora-night/80 backdrop-blur-md">
      <div className="absolute inset-0" onClick={onClose} />
      
      <div className="relative w-full max-w-md animate-fade-in">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 p-2 rounded-full bg-sonora-cream/10 hover:bg-sonora-cream/20 text-sonora-cream/80 transition-calm"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {/* The Playlist Card */}
        <div
          ref={cardRef}
          className="relative rounded-2xl overflow-hidden shadow-2xl"
          style={{
            background: `linear-gradient(135deg, var(--tw-gradient-stops))`,
          }}
        >
          <div className={`bg-gradient-to-br ${gradient} p-8`}>
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <ListMusic size={16} className="text-sonora-cream/80" />
                  <span className="text-xs text-sonora-cream/80 uppercase tracking-wider font-medium">Playlist</span>
                </div>
                <h2 className="font-display text-3xl font-semibold text-sonora-cream mb-2">
                  {playlist.name}
                </h2>
                <p className="text-sm text-sonora-cream/70">
                  {playlist.description}
                </p>
              </div>
            </div>

            {/* Track List */}
            <div className="space-y-2 mb-6">
              {playlistTracks.map((track, i) => (
                track && (
                  <div key={track.id} className="flex items-center gap-3 text-sonora-cream/90">
                    <span className="text-xs text-sonora-cream/50 w-5 text-right">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{track.title}</p>
                      <p className="text-xs text-sonora-cream/60 truncate">{track.artist}</p>
                    </div>
                  </div>
                )
              ))}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-sonora-cream/20">
              <div className="flex items-center gap-2 text-sonora-cream/60">
                <Music2 size={14} />
                <span className="text-xs">{playlist.tracks.length} tracks</span>
              </div>
              <div className="flex items-center gap-1.5 text-sonora-cream/60">
                <span className="text-xs uppercase tracking-wider font-medium">Sonora</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-4 flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-sonora-cream/10 hover:bg-sonora-cream/20 rounded-xl text-sonora-cream text-sm font-medium transition-calm backdrop-blur-sm"
          >
            {copied ? (
              <>
                <Check size={16} />
                Copied!
              </>
            ) : (
              <>
                <Copy size={16} />
                Copy Details
              </>
            )}
          </button>
          <button
            onClick={onClose}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-sonora-cream text-sonora-bark rounded-xl text-sm font-medium hover:bg-sonora-cream/90 transition-calm"
          >
            Done
          </button>
        </div>

        <p className="mt-3 text-center text-xs text-sonora-cream/40">
          Share your playlist with friends
        </p>
      </div>
    </div>
  );
}
