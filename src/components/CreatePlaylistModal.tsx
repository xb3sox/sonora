import React, { useState } from 'react';
import { X, Plus, Music2, Check } from 'lucide-react';
import { Track } from '../types';
import { usePlayer } from '../context/PlayerContext';
import { usePlaylists } from '../context/PlaylistContext';
import { AlbumArt } from './AlbumArt';

interface CreatePlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  trackToAdd?: Track | null;
}

export function CreatePlaylistModal({ isOpen, onClose, trackToAdd }: CreatePlaylistModalProps) {
  const { addToast } = usePlayer();
  const { playlists, createPlaylist, addTrackToPlaylist } = usePlaylists();
  const [mode, setMode] = useState<'choose' | 'create'>('choose');
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');

  if (!isOpen) return null;

  const handleCreate = () => {
    if (!newName.trim()) return;
    const trackIds = trackToAdd ? [trackToAdd.id] : [];
    createPlaylist(newName, newDesc, trackIds);
    addToast(`Created playlist "${newName}"`, 'success');
    setNewName('');
    setNewDesc('');
    setMode('choose');
    onClose();
  };

  const handleAddToExisting = (playlistId: string) => {
    const playlist = playlists.find(p => p.id === playlistId);
    if (playlist && trackToAdd) {
      addTrackToPlaylist(playlistId, trackToAdd.id);
      addToast(`Added "${trackToAdd.title}" to "${playlist.name}"`, 'success');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-sonora-bark/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:w-[440px] max-h-[80vh] bg-sonora-cream rounded-t-2xl sm:rounded-2xl shadow-2xl animate-slide-up flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-sonora-sand flex-shrink-0">
          <div className="flex items-center gap-2">
            <Music2 size={18} className="text-sonora-bark" />
            <h2 className="font-display text-lg font-semibold text-sonora-bark">
              {trackToAdd ? `Add to playlist` : 'New Playlist'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-sonora-warm text-sonora-stone hover:text-sonora-bark transition-calm"
          >
            <X size={18} />
          </button>
        </div>

        {/* Track preview */}
        {trackToAdd && (
          <div className="px-5 py-3 border-b border-sonora-sand flex items-center gap-3 flex-shrink-0">
            <AlbumArt type="track" id={trackToAdd.id} size="md" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sonora-bark truncate">{trackToAdd.title}</p>
              <p className="text-xs text-sonora-stone truncate">{trackToAdd.artist}</p>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {mode === 'choose' ? (
            <>
              {/* Create new */}
              <button
                onClick={() => setMode('create')}
                className="w-full flex items-center gap-3 p-3 rounded-xl border-2 border-dashed border-sonora-sand hover:border-sonora-earth transition-calm mb-4"
              >
                <div className="w-9 h-9 rounded-lg bg-sonora-warm flex items-center justify-center">
                  <Plus size={16} className="text-sonora-earth" />
                </div>
                <span className="text-sm font-medium text-sonora-bark">Create new playlist</span>
              </button>

              {/* Existing playlists */}
              <p className="text-xs font-semibold text-sonora-stone uppercase tracking-wider mb-2">
                Or add to existing
              </p>
              <div className="space-y-1">
                {playlists.filter(p => p.isUserCreated).map(playlist => (
                  <button
                    key={playlist.id}
                    onClick={() => handleAddToExisting(playlist.id)}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-sonora-warm transition-calm text-left"
                  >
                    <AlbumArt type="playlist" id={playlist.id} size="md" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-sonora-bark truncate">{playlist.name}</p>
                      <p className="text-xs text-sonora-stone">{playlist.tracks.length} tracks</p>
                    </div>
                    <Plus size={14} className="text-sonora-stone" />
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-sonora-stone uppercase tracking-wider mb-2">
                    Playlist name
                  </label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Sunday Morning"
                    className="w-full px-4 py-2.5 bg-sonora-warm border border-sonora-sand rounded-lg text-sm text-sonora-bark placeholder:text-sonora-stone focus:outline-none focus:border-sonora-earth"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-sonora-stone uppercase tracking-wider mb-2">
                    Description (optional)
                  </label>
                  <textarea
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    placeholder="What's this playlist for?"
                    rows={3}
                    className="w-full px-4 py-2.5 bg-sonora-warm border border-sonora-sand rounded-lg text-sm text-sonora-bark placeholder:text-sonora-stone focus:outline-none focus:border-sonora-earth resize-none"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 mt-6">
                <button
                  onClick={() => setMode('choose')}
                  className="px-4 py-2 text-sm text-sonora-stone hover:text-sonora-bark transition-calm"
                >
                  Back
                </button>
                <button
                  onClick={handleCreate}
                  disabled={!newName.trim()}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-sonora-bark text-sonora-cream rounded-lg text-sm font-medium hover:bg-sonora-night transition-calm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Check size={14} /> Create Playlist
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
