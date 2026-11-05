import React from 'react';
import { usePlayer } from '../context/PlayerContext';
import { useFollow } from '../context/FollowContext';
import { artists, albums, tracks } from '../data';
import { View } from '../types';
import { AlbumArt } from '../components/AlbumArt';
import { TrackRow } from '../components/TrackRow';
import { FollowButton } from '../components/FollowButton';
import { TipButton } from '../components/TipButton';
import { 
  Play, ArrowLeft, Users, BookOpen, Radio, TrendingUp, Disc3
} from 'lucide-react';

// Simulated social proof data
const artistStats: Record<string, { followers: number; monthlyListeners: number }> = {
  a1: { followers: 12453, monthlyListeners: 45230 },
  a2: { followers: 8921, monthlyListeners: 32100 },
  a3: { followers: 15678, monthlyListeners: 58900 },
  a4: { followers: 6234, monthlyListeners: 21500 },
};

function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

interface ArtistPageProps {
  artistId: string;
  onNavigate: (view: View, id?: string) => void;
  onTipArtist?: (artistId: string) => void;
  onOpenArtistRadio?: (artistId: string) => void;
}

export function ArtistPage({ artistId, onNavigate, onTipArtist, onOpenArtistRadio }: ArtistPageProps) {
  const { play, playAlbum } = usePlayer();
  const { followedArtists } = useFollow();
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
  const stats = artistStats[artistId] || { followers: 0, monthlyListeners: 0 };
  
  // Get top tracks (sorted by duration as a proxy for popularity)
  const topTracks = [...artistTracks].sort((a, b) => b.duration - a.duration).slice(0, 5);
  
  // Get related artists (same genre)
  const relatedArtists = artists.filter(a => 
    a.id !== artistId && 
    a.genres.some(g => artist.genres.includes(g))
  ).slice(0, 4);

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
            <div className="flex items-center gap-3 text-sm text-sonora-stone flex-wrap mb-2">
              <span>{artist.genres.join(', ')}</span>
            </div>
            {/* Social Proof Stats */}
            <div className="flex items-center gap-4 text-xs text-sonora-stone mb-3">
              <span className="flex items-center gap-1">
                <Users size={12} />
                <span className="font-medium text-sonora-bark">{formatNumber(stats.followers)}</span> followers
              </span>
              <span className="flex items-center gap-1">
                <TrendingUp size={12} />
                <span className="font-medium text-sonora-bark">{formatNumber(stats.monthlyListeners)}</span> monthly listeners
              </span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => onNavigate('artist-story', artistId)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-sonora-warm hover:bg-sonora-sand rounded-full text-sm font-medium text-sonora-bark transition-calm"
              >
                <BookOpen size={14} /> The Story
              </button>
              {onOpenArtistRadio && (
                <button
                  onClick={() => onOpenArtistRadio(artistId)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-sonora-accent/10 hover:bg-sonora-accent/20 rounded-full text-sm font-medium text-sonora-accent transition-calm"
                >
                  <Radio size={14} /> Start Radio
                </button>
              )}
              <FollowButton artistId={artistId} artistName={artist.name} />
              {onTipArtist && <TipButton onClick={() => onTipArtist(artistId)} />}
            </div>
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

      {/* Top Tracks */}
      <div className="px-6 sm:px-8 mb-8">
        <h2 className="font-display text-xl font-semibold text-sonora-bark mb-4">Popular</h2>
        <div className="space-y-0.5">
          {topTracks.map((track, i) => (
            <TrackRow 
              key={track.id} 
              track={track} 
              index={i}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      </div>

      {/* Related Artists */}
      {relatedArtists.length > 0 && (
        <div className="px-6 sm:px-8 mb-8">
          <h2 className="font-display text-xl font-semibold text-sonora-bark mb-4">Fans also like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relatedArtists.map(related => (
              <button
                key={related.id}
                onClick={() => onNavigate('artist', related.id)}
                className="group text-center"
              >
                <div className="w-full aspect-square max-w-[140px] mx-auto rounded-full overflow-hidden mb-3 shadow-md">
                  <AlbumArt type="artist" id={related.id} size="xl" className="w-full h-full" />
                </div>
                <p className="text-sm font-medium text-sonora-bark">{related.name}</p>
                <p className="text-xs text-sonora-stone">{related.genres[0]}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* All Tracks */}
      <div className="px-6 sm:px-8 pb-8">
        <details className="group">
          <summary className="font-display text-xl font-semibold text-sonora-bark mb-4 cursor-pointer list-none flex items-center gap-2">
            <span>All Tracks ({artistTracks.length})</span>
            <span className="text-sonora-stone group-open:rotate-180 transition-transform">↓</span>
          </summary>
          <div className="space-y-0.5 mt-4">
            {artistTracks.map((track, i) => (
              <TrackRow 
                key={track.id} 
                track={track} 
                index={i}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        </details>
      </div>
    </div>
  );
}
