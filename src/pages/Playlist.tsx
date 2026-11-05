import React, { useState } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { usePlaylists } from '../context/PlaylistContext';
import { tracks, albums } from '../data';
import { View } from '../types';
import { AlbumArt } from '../components/AlbumArt';
import { TrackRow } from '../components/TrackRow';
import { PlaylistCardModal } from '../components/PlaylistCardModal';
import { 
  Play, ArrowLeft, Pause, ListMusic, Clock, Music2, 
  Share2, Edit3, Trash2, Heart
} from 'lucide-react';

interface PlaylistPageProps {
  playlistId: string;
  onNavigate: (view: View, id?: string) => void;
}

export function PlaylistPage({ playlistId, onNavigate }: PlaylistPageProps) {
  const { play, playAlbum, state, toggleFavorite, isFavorite } = usePlayer();
  const { playlists, deletePlaylist } = usePlaylists();
  const playlist = playlists.find(p => p.id === playlistId);
  const [showCardModal, setShowCardModal] = useState(false);

  if (!playlist) {
    return (
      <div className="p-8 text-center">
        <p className="text-sonora-stone">Playlist not found</p>
      </div>
    );
  }

  const playlistTracks = playlist.tracks.map(id => tracks.find(t => t.id === id)).filter(Boolean);
  const totalDuration = playlistTracks.reduce((sum, t) => sum + (t?.duration || 0), 0);
  
  // Get unique artists in playlist
  const uniqueArtists = new Set(playlistTracks.map(t => t?.artist).filter(Boolean));
  
  // Get related albums (albums that appear in the playlist)
  const relatedAlbumIds = new Set(playlistTracks.map(t => t?.albumId).filter(Boolean));
  const relatedAlbums = albums.filter(a => relatedAlbumIds.has(a.id)).slice(0, 4);

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins} min`;
  };

  const isPlaylistPlaying = state.currentTrack && playlist.tracks.includes(state.currentTrack.id);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Back */}
      <div className="p-6 sm:p-8 pb-0">
        <button
          onClick={() => onNavigate('library')}
          className="flex items-center gap-2 text-sm text-sonora-stone hover:text-sonora-bark transition-calm mb-6"
        >
          <ArrowLeft size={16} /> Back to Library
        </button>
      </div>

      {/* Enhanced Playlist Header */}
      <div className="px-6 sm:px-8 pb-8">
        <div className="flex flex-col md:flex-row items-start gap-6 mb-8">
          {/* Playlist Art */}
          <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-2xl flex-shrink-0 shadow-2xl overflow-hidden relative group">
            <AlbumArt type="playlist" id={playlist.id} size="xl" className="w-full h-full" />
            <div className="absolute inset-0 bg-gradient-to-t from-sonora-bark/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-calm" />
          </div>

          {/* Playlist Info */}
          <div className="flex-1">
            <p className="text-xs font-semibold text-sonora-accent uppercase tracking-wider mb-2">Playlist</p>
            <h1 className="font-display text-4xl sm:text-5xl font-semibold text-sonora-bark mb-3">{playlist.name}</h1>
            <p className="text-base text-sonora-earth mb-4">{playlist.description}</p>
            
            {/* Stats */}
            <div className="flex items-center gap-4 text-sm text-sonora-stone mb-6 flex-wrap">
              <span className="flex items-center gap-1.5">
                <Music2 size={14} />
                <span className="font-medium text-sonora-bark">{playlist.tracks.length}</span> tracks
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={14} />
                <span className="font-medium text-sonora-bark">{formatDuration(totalDuration)}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="font-medium text-sonora-bark">{uniqueArtists.size}</span> artists
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={() => playAlbum(playlist.tracks)}
                className="flex items-center gap-2 px-6 py-3 bg-sonora-bark text-sonora-cream rounded-full text-sm font-medium hover:bg-sonora-night transition-calm shadow-lg"
              >
                {isPlaylistPlaying && state.isPlaying ? (
                  <><Pause size={16} /> Pause</>
                ) : (
                  <><Play size={16} className="ml-0.5" /> Play</>
                )}
              </button>
              <button
                onClick={() => toggleFavorite(playlist.id)}
                className={`p-3 rounded-full transition-calm ${
                  isFavorite(playlist.id)
                    ? 'bg-sonora-accent/10 text-sonora-accent'
                    : 'bg-sonora-warm text-sonora-stone hover:text-sonora-accent'
                }`}
                aria-label={isFavorite(playlist.id) ? 'Unlike playlist' : 'Like playlist'}
              >
                <Heart size={18} fill={isFavorite(playlist.id) ? 'currentColor' : 'none'} />
              </button>
              <button
                onClick={() => setShowCardModal(true)}
                className="p-3 rounded-full bg-sonora-warm text-sonora-stone hover:text-sonora-bark transition-calm"
                aria-label="Share playlist"
              >
                <Share2 size={18} />
              </button>
              {playlist.isUserCreated && (
                <>
                  <button
                    className="p-3 rounded-full bg-sonora-warm text-sonora-stone hover:text-sonora-bark transition-calm"
                    aria-label="Edit playlist"
                  >
                    <Edit3 size={18} />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm('Delete this playlist?')) {
                        deletePlaylist(playlist.id);
                        onNavigate('library');
                      }
                    }}
                    className="p-3 rounded-full bg-sonora-warm text-sonora-stone hover:text-red-600 transition-calm"
                    aria-label="Delete playlist"
                  >
                    <Trash2 size={18} />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Related Albums */}
        {relatedAlbums.length > 0 && (
          <section className="mb-8">
            <h2 className="font-display text-xl font-semibold text-sonora-bark mb-4">From these albums</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedAlbums.map(album => (
                <button
                  key={album.id}
                  onClick={() => onNavigate('album', album.id)}
                  className="group text-left"
                >
                  <div className="aspect-square rounded-xl mb-3 relative overflow-hidden shadow-md">
                    <AlbumArt type="album" id={album.id} size="xl" className="w-full h-full" />
                    <div className="absolute inset-0 bg-sonora-bark/0 group-hover:bg-sonora-bark/10 transition-calm flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-sonora-bark text-sonora-cream flex items-center justify-center opacity-0 group-hover:opacity-100 transition-calm shadow-lg">
                        <Play size={16} className="ml-0.5" />
                      </div>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-sonora-bark truncate">{album.title}</p>
                  <p className="text-xs text-sonora-stone truncate">{album.artist}</p>
                </button>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Track List */}
      <div className="px-6 sm:px-8 pb-8">
        <div className="space-y-0.5">
          {playlistTracks.map((track, i) => (
            track && <TrackRow key={track.id} track={track} index={i} onNavigate={onNavigate} />
          ))}
        </div>
      </div>

      {/* Playlist Card Modal */}
      <PlaylistCardModal
        isOpen={showCardModal}
        onClose={() => setShowCardModal(false)}
        playlist={playlist}
      />
    </div>
  );
}
