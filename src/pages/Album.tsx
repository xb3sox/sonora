import React from 'react';
import { usePlayer } from '../context/PlayerContext';
import { albums, tracks } from '../data';
import { View } from '../types';
import { AlbumArt } from '../components/AlbumArt';
import { TrackRow } from '../components/TrackRow';
import { 
  Play, Clock, ArrowLeft, 
  Pause, Info
} from 'lucide-react';

interface AlbumPageProps {
  albumId: string;
  onNavigate: (view: View, id?: string) => void;
}

export function AlbumPage({ albumId, onNavigate }: AlbumPageProps) {
  const { play, playAlbum, state } = usePlayer();
  const album = albums.find(a => a.id === albumId);

  if (!album) {
    return (
      <div className="p-8 text-center">
        <p className="text-sonora-stone">Album not found</p>
      </div>
    );
  }

  const albumTracks = album.tracks.map(id => tracks.find(t => t.id === id)).filter(Boolean);
  const totalDuration = albumTracks.reduce((sum, t) => sum + (t?.duration || 0), 0);
  const isAlbumPlaying = state.currentTrack && album.tracks.includes(state.currentTrack.id);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Back */}
      <div className="p-6 sm:p-8 pb-0">
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 text-sm text-sonora-stone hover:text-sonora-bark transition-calm mb-6"
        >
          <ArrowLeft size={16} /> Back
        </button>
      </div>

      {/* Album Header */}
      <div className="px-6 sm:px-8 pb-8 flex flex-col md:flex-row items-start gap-6">
        <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-xl flex-shrink-0 shadow-lg overflow-hidden">
          <AlbumArt type="album" id={album.id} size="xl" className="w-full h-full" />
        </div>
        <div className="flex-1">
          <p className="text-xs font-semibold text-sonora-stone uppercase tracking-wider mb-1">Album</p>
          <h1 className="font-display text-3xl font-semibold text-sonora-bark mb-2">{album.title}</h1>
          <div className="flex items-center gap-2 text-sm text-sonora-stone mb-3 flex-wrap">
            <button 
              onClick={() => onNavigate('artist', album.artistId)}
              className="font-medium text-sonora-earth hover:text-sonora-bark transition-calm"
            >
              {album.artist}
            </button>
            <span>·</span>
            <span>{album.year}</span>
            <span>·</span>
            <span>{albumTracks.length} tracks</span>
            <span>·</span>
            <span>{Math.floor(totalDuration / 60)} min</span>
          </div>
          {album.description && (
            <p className="text-sm text-sonora-earth leading-relaxed mb-4 max-w-lg">{album.description}</p>
          )}
          <div className="flex items-center gap-3">
            <button
              onClick={() => playAlbum(album.tracks)}
              className="flex items-center gap-2 px-5 py-2.5 bg-sonora-bark text-sonora-cream rounded-full text-sm font-medium hover:bg-sonora-night transition-calm"
            >
              {isAlbumPlaying && state.isPlaying ? (
                <><Pause size={16} /> Pause</>
              ) : (
                <><Play size={16} className="ml-0.5" /> Play Album</>
              )}
            </button>
            <span className="text-[10px] font-semibold text-sonora-sage bg-sonora-sage/10 px-2 py-1 rounded-full">
              All tracks lossless
            </span>
          </div>
        </div>
      </div>

      {/* Track List */}
      <div className="px-6 sm:px-8 pb-8">
        <div className="space-y-0.5">
          {albumTracks.map((track, i) => (
            track && <TrackRow key={track.id} track={track} index={i} showAlbum={false} />
          ))}
        </div>
      </div>

      {/* Album Credits */}
      <div className="px-6 sm:px-8 pb-8">
        <div className="bg-sonora-warm rounded-xl p-6">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-sonora-bark mb-4">
            <Info size={14} /> Album Credits
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            {albumTracks[0]?.credits.producer && (
              <div>
                <p className="text-xs text-sonora-stone uppercase tracking-wider mb-1">Producer</p>
                <p className="text-sonora-earth">{albumTracks[0].credits.producer}</p>
              </div>
            )}
            {albumTracks[0]?.credits.engineer && (
              <div>
                <p className="text-xs text-sonora-stone uppercase tracking-wider mb-1">Engineer</p>
                <p className="text-sonora-earth">{albumTracks[0].credits.engineer}</p>
              </div>
            )}
            {albumTracks[0]?.credits.label && (
              <div>
                <p className="text-xs text-sonora-stone uppercase tracking-wider mb-1">Label</p>
                <p className="text-sonora-earth">{albumTracks[0].credits.label}</p>
              </div>
            )}
            {albumTracks[0]?.credits.recorded && (
              <div>
                <p className="text-xs text-sonora-stone uppercase tracking-wider mb-1">Recorded</p>
                <p className="text-sonora-earth">{albumTracks[0].credits.recorded}</p>
              </div>
            )}
            {albumTracks[0]?.credits.songwriter && (
              <div className="md:col-span-2">
                <p className="text-xs text-sonora-stone uppercase tracking-wider mb-1">Songwriters</p>
                <p className="text-sonora-earth">{albumTracks[0].credits.songwriter.join(', ')}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
