import React from 'react';
import { usePlayer } from '../context/PlayerContext';
import { playlists, tracks } from '../data';
import { View } from '../types';
import { 
  Play, Clock, Music2, ArrowLeft, 
  Pause, ListMusic
} from 'lucide-react';

interface PlaylistPageProps {
  playlistId: string;
  onNavigate: (view: View) => void;
}

export function PlaylistPage({ playlistId, onNavigate }: PlaylistPageProps) {
  const { play, playAlbum, state } = usePlayer();
  const playlist = playlists.find(p => p.id === playlistId);

  if (!playlist) {
    return (
      <div className="p-8 text-center">
        <p className="text-sonora-stone">Playlist not found</p>
      </div>
    );
  }

  const playlistTracks = playlist.tracks.map(id => tracks.find(t => t.id === id)).filter(Boolean);
  const totalDuration = playlistTracks.reduce((sum, t) => sum + (t?.duration || 0), 0);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Back */}
      <div className="p-8 pb-0">
        <button
          onClick={() => onNavigate('library')}
          className="flex items-center gap-2 text-sm text-sonora-stone hover:text-sonora-bark transition-calm mb-6"
        >
          <ArrowLeft size={16} /> Back to Library
        </button>
      </div>

      {/* Playlist Header */}
      <div className="px-8 pb-8 flex flex-col md:flex-row items-start gap-6">
        <div className="w-48 h-48 rounded-xl bg-gradient-to-br from-sonora-accent/20 to-sonora-sage/20 flex items-center justify-center flex-shrink-0 shadow-lg">
          <ListMusic size={48} className="text-sonora-earth" />
        </div>
        <div className="flex-1">
          <p className="text-xs font-semibold text-sonora-stone uppercase tracking-wider mb-1">Playlist</p>
          <h1 className="font-display text-3xl font-semibold text-sonora-bark mb-2">{playlist.name}</h1>
          <p className="text-sm text-sonora-earth mb-3">{playlist.description}</p>
          <div className="flex items-center gap-2 text-sm text-sonora-stone mb-4">
            <span>{playlistTracks.length} tracks</span>
            <span>·</span>
            <span>{Math.floor(totalDuration / 60)} min</span>
            {playlist.isUserCreated && (
              <>
                <span>·</span>
                <span>Your playlist</span>
              </>
            )}
          </div>
          <button
            onClick={() => playAlbum(playlist.tracks)}
            className="flex items-center gap-2 px-5 py-2.5 bg-sonora-bark text-sonora-cream rounded-full text-sm font-medium hover:bg-sonora-night transition-calm"
          >
            <Play size={16} className="ml-0.5" /> Play
          </button>
        </div>
      </div>

      {/* Track List */}
      <div className="px-8 pb-8">
        <div className="space-y-1">
          {playlistTracks.map((track, i) => {
            if (!track) return null;
            const isCurrentTrack = state.currentTrack?.id === track.id;
            return (
              <button
                key={track.id}
                onClick={() => play(track)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-calm group text-left
                  ${isCurrentTrack ? 'bg-sonora-warm' : 'hover:bg-sonora-warm'}`}
              >
                <span className="w-6 text-center text-xs text-sonora-stone group-hover:hidden">
                  {isCurrentTrack && state.isPlaying ? (
                    <span className="inline-block w-3 h-3 border-2 border-sonora-bark border-t-transparent rounded-full animate-spin" />
                  ) : (
                    i + 1
                  )}
                </span>
                <Play size={14} className="w-6 text-center text-sonora-bark hidden group-hover:block" />
                <div className="w-9 h-9 rounded bg-sonora-sand flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm truncate ${isCurrentTrack ? 'text-sonora-bark font-medium' : 'text-sonora-bark'}`}>
                    {track.title}
                  </p>
                  <p className="text-xs text-sonora-stone truncate">{track.artist}</p>
                </div>
                <span className="text-xs text-sonora-stone hidden md:block">{track.album}</span>
                {track.lossless && (
                  <span className="text-[9px] font-semibold text-sonora-sage bg-sonora-sage/10 px-1 py-0.5 rounded hidden md:block">
                    FLAC
                  </span>
                )}
                <span className="text-xs text-sonora-stone flex items-center gap-1">
                  <Clock size={12} />
                  {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
