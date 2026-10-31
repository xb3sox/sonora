import React from 'react';
import { usePlayer } from '../context/PlayerContext';
import { playlists, tracks } from '../data';
import { View } from '../types';
import { AlbumArt } from '../components/AlbumArt';
import { TrackRow } from '../components/TrackRow';
import { 
  Play, ArrowLeft, 
  Pause, ListMusic
} from 'lucide-react';

interface PlaylistPageProps {
  playlistId: string;
  onNavigate: (view: View, id?: string) => void;
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
      <div className="p-6 sm:p-8 pb-0">
        <button
          onClick={() => onNavigate('library')}
          className="flex items-center gap-2 text-sm text-sonora-stone hover:text-sonora-bark transition-calm mb-6"
        >
          <ArrowLeft size={16} /> Back to Library
        </button>
      </div>

      {/* Playlist Header */}
      <div className="px-6 sm:px-8 pb-8 flex flex-col md:flex-row items-start gap-6">
        <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-xl flex-shrink-0 shadow-lg overflow-hidden">
          <AlbumArt type="playlist" id={playlist.id} size="xl" className="w-full h-full" />
        </div>
        <div className="flex-1">
          <p className="text-xs font-semibold text-sonora-stone uppercase tracking-wider mb-1">Playlist</p>
          <h1 className="font-display text-3xl font-semibold text-sonora-bark mb-2">{playlist.name}</h1>
          <p className="text-sm text-sonora-earth mb-3">{playlist.description}</p>
          <div className="flex items-center gap-2 text-sm text-sonora-stone mb-4 flex-wrap">
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
      <div className="px-6 sm:px-8 pb-8">
        <div className="space-y-0.5">
          {playlistTracks.map((track, i) => (
            track && <TrackRow key={track.id} track={track} index={i} onNavigate={onNavigate} />
          ))}
        </div>
      </div>
    </div>
  );
}
