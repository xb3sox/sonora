import React from 'react';
import { usePlayer } from '../context/PlayerContext';
import { artists, albums, tracks } from '../data';
import { View } from '../types';
import { AlbumArt } from '../components/AlbumArt';
import { TrackRow } from '../components/TrackRow';
import { 
  Play, ArrowLeft, Users, BookOpen
} from 'lucide-react';

interface ArtistPageProps {
  artistId: string;
  onNavigate: (view: View, id?: string) => void;
}

export function ArtistPage({ artistId, onNavigate }: ArtistPageProps) {
  const { play, playAlbum } = usePlayer();
  const artist = artists.find(a => a.id === artistId);
  
  if (!artist) {
    return (
      <div className="p-8 text-center">
        <p className="text-sonora-stone">Artist not found</p>
      </div>
    );
  }

  const artistAlbums = albums.filter(a => a.artistId === artistId);
  const artistTracks = tracks.filter(t => t.artistId === artistId);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Artist Header */}
      <div className="relative p-6 sm:p-8 pb-6">
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 text-sm text-sonora-stone hover:text-sonora-bark transition-calm mb-6"
        >
          <ArrowLeft size={16} /> Back
        </button>
        
        <div className="flex items-end gap-6">
          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full flex-shrink-0 shadow-lg overflow-hidden">
            <AlbumArt type="artist" id={artist.id} size="xl" className="w-full h-full" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-semibold text-sonora-stone uppercase tracking-wider mb-1">Artist</p>
            <h1 className="font-display text-3xl sm:text-4xl font-semibold text-sonora-bark mb-2">{artist.name}</h1>
            <div className="flex items-center gap-3 text-sm text-sonora-stone flex-wrap mb-3">
              <span>{artist.genres.join(', ')}</span>
              <span>·</span>
              <span>{artistAlbums.length} {artistAlbums.length === 1 ? 'album' : 'albums'}</span>
              <span>·</span>
              <span>{artistTracks.length} tracks</span>
            </div>
            <button
              onClick={() => onNavigate('artist-story', artistId)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-sonora-warm hover:bg-sonora-sand rounded-full text-sm font-medium text-sonora-bark transition-calm"
            >
              <BookOpen size={14} /> The Story
            </button>
          </div>
        </div>
      </div>

      {/* Bio */}
      <div className="px-6 sm:px-8 mb-8">
        <p className="text-sm text-sonora-earth leading-relaxed max-w-2xl">{artist.bio}</p>
      </div>

      {/* Albums */}
      <div className="px-6 sm:px-8 mb-8">
        <h2 className="font-display text-xl font-semibold text-sonora-bark mb-4">Discography</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {artistAlbums.map(album => (
            <button
              key={album.id}
              onClick={() => onNavigate('album', album.id)}
              className="group text-left"
            >
              <div className="aspect-square rounded-xl mb-3 relative overflow-hidden shadow-md">
                <AlbumArt type="album" id={album.id} size="xl" className="w-full h-full" />
                <div className="absolute inset-0 bg-sonora-bark/0 group-hover:bg-sonora-bark/10 transition-calm flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-sonora-bark text-sonora-cream flex items-center justify-center opacity-0 group-hover:opacity-100 transition-calm">
                    <Play size={16} className="ml-0.5" />
                  </div>
                </div>
              </div>
              <p className="text-sm font-medium text-sonora-bark truncate">{album.title}</p>
              <p className="text-xs text-sonora-stone">{album.year} · {album.genre}</p>
            </button>
          ))}
        </div>
      </div>

      {/* All Tracks */}
      <div className="px-6 sm:px-8 pb-8">
        <h2 className="font-display text-xl font-semibold text-sonora-bark mb-4">All Tracks</h2>
        <div className="space-y-0.5">
          {artistTracks.map((track, i) => (
            <TrackRow 
              key={track.id} 
              track={track} 
              index={i}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
