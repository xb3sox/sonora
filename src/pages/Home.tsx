import React from 'react';
import { usePlayer } from '../context/PlayerContext';
import { usePlayCount } from '../context/PlayCountContext';
import { tracks, albums, playlists, recommendations, artists } from '../data';
import { View } from '../types';
import { AlbumArt } from '../components/AlbumArt';
import { TrackRow } from '../components/TrackRow';
import { 
  Play, Headphones, Sparkles, ArrowRight, 
  Disc3, BarChart3, Clock, TrendingUp, Music2
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (view: View, id?: string) => void;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 5) return 'Still up?';
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  if (hour < 21) return 'Good evening';
  return 'Good night';
}

// Generate personalized mixes based on listening patterns
function getMadeForYouMixes() {
  return [
    {
      id: 'mix-daily',
      name: 'Your Daily Mix',
      description: 'Based on your recent listening',
      tracks: ['t1', 't4', 't6', 't8', 't2'],
      gradient: 'from-sonora-accent/30 to-sonora-clay/20',
      icon: '🎵'
    },
    {
      id: 'mix-discover',
      name: 'Discover Weekly',
      description: 'New music tailored to you',
      tracks: ['t5', 't7', 't9', 't11', 't3'],
      gradient: 'from-sonora-sage/30 to-sonora-earth/20',
      icon: '🧭'
    },
    {
      id: 'mix-chill',
      name: 'Chill Vibes',
      description: 'Relax and unwind',
      tracks: ['t1', 't3', 't8', 't10', 't6'],
      gradient: 'from-sonora-mist/40 to-sonora-sand/30',
      icon: '🌿'
    },
    {
      id: 'mix-focus',
      name: 'Deep Focus',
      description: 'Music for concentration',
      tracks: ['t6', 't7', 't12', 't2', 't10'],
      gradient: 'from-sonora-earth/30 to-sonora-bark/20',
      icon: '🎯'
    }
  ];
}

export function HomePage({ onNavigate }: HomePageProps) {
  const { play, playAlbum, state } = usePlayer();
  const { playCounts } = usePlayCount();

  const recentAlbums = albums.slice(0, 4);
  const recentTracks = tracks.slice(0, 6);
  const madeForYouMixes = getMadeForYouMixes();

  // Calculate personalized stats
  const totalPlays = Array.from(playCounts.values()).reduce((sum, count) => sum + count, 0);
  const topTrackId = Array.from(playCounts.entries())
    .sort((a, b) => b[1] - a[1])[0]?.[0];
  const topTrack = topTrackId ? tracks.find(t => t.id === topTrackId) : null;
  const topArtist = topTrack ? artists.find(a => a.id === topTrack.artistId) : null;

  return (
    <div className="p-6 sm:p-8 max-w-6xl mx-auto">
      {/* Enhanced Greeting with Stats */}
      <header className="mb-10 pt-8 sm:pt-0">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-semibold text-sonora-bark mb-2">
              {getGreeting()}
            </h1>
            <p className="text-sonora-stone text-sm sm:text-base">
              {totalPlays > 0 
                ? `You've played ${totalPlays} tracks${topArtist ? `, with ${topArtist.name} leading your rotation` : ''}.`
                : 'Pick up where you left off, or discover something new.'}
            </p>
          </div>
          {state.currentTrack && (
            <button
              onClick={() => state.currentTrack && play(state.currentTrack)}
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-sonora-bark text-sonora-cream rounded-full text-sm font-medium hover:bg-sonora-night transition-calm"
            >
              <Play size={14} />
              Resume
            </button>
          )}
        </div>
      </header>

      {/* Made for You - Personalized Mixes */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-sonora-accent" />
            <h2 className="font-display text-xl font-semibold text-sonora-bark">Made for You</h2>
          </div>
          <button 
            onClick={() => onNavigate('explore')}
            className="text-sm text-sonora-stone hover:text-sonora-bark transition-calm flex items-center gap-1"
          >
            See all <ArrowRight size={14} />
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {madeForYouMixes.map(mix => (
            <button
              key={mix.id}
              onClick={() => playAlbum(mix.tracks)}
              className="group text-left"
            >
              <div className={`aspect-square rounded-xl mb-3 relative overflow-hidden bg-gradient-to-br ${mix.gradient} flex items-center justify-center`}>
                <span className="text-5xl opacity-60 group-hover:scale-110 transition-transform duration-300">{mix.icon}</span>
                <div className="absolute inset-0 bg-sonora-bark/0 group-hover:bg-sonora-bark/10 transition-calm flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-sonora-bark/90 text-sonora-cream flex items-center justify-center opacity-0 group-hover:opacity-100 transition-calm shadow-lg backdrop-blur-sm">
                    <Play size={20} className="ml-0.5" />
                  </div>
                </div>
              </div>
              <p className="text-sm font-medium text-sonora-bark truncate">{mix.name}</p>
              <p className="text-xs text-sonora-stone truncate">{mix.description}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Quick Play Grid */}
      <section className="mb-12">
        <h2 className="font-display text-xl font-semibold text-sonora-bark mb-4">Your Playlists</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {playlists.slice(0, 6).map(playlist => (
            <button
              key={playlist.id}
              onClick={() => onNavigate('playlist', playlist.id)}
              className="flex items-center gap-3 bg-sonora-warm hover:bg-sonora-sand rounded-lg p-3 transition-calm group text-left"
            >
              <AlbumArt type="playlist" id={playlist.id} size="md" />
              <span className="text-sm font-medium text-sonora-bark truncate flex-1">{playlist.name}</span>
              <Play size={14} className="text-sonora-stone opacity-0 group-hover:opacity-100 transition-calm flex-shrink-0" />
            </button>
          ))}
        </div>
      </section>

      {/* Explainable Recommendations */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-sonora-accent" />
            <h2 className="font-display text-xl font-semibold text-sonora-bark">For You</h2>
          </div>
          <button 
            onClick={() => onNavigate('explore')}
            className="text-sm text-sonora-stone hover:text-sonora-bark transition-calm flex items-center gap-1"
          >
            See more <ArrowRight size={14} />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {recommendations.slice(0, 4).map((rec, i) => (
            <div
              key={i}
              className="bg-sonora-warm rounded-xl p-4 hover:bg-sonora-sand transition-calm cursor-pointer group"
              onClick={() => play(rec.track)}
            >
              <div className="flex items-start gap-3">
                <AlbumArt type="track" id={rec.track.id} size="lg" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-sonora-bark truncate">{rec.track.title}</p>
                  <p className="text-xs text-sonora-stone">{rec.track.artist}</p>
                  <div className="mt-2 flex items-start gap-1.5">
                    <Sparkles size={12} className="text-sonora-accent mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-sonora-earth leading-relaxed">{rec.reason}</p>
                  </div>
                  <div className="mt-1.5">
                    <span className="text-[10px] font-semibold text-sonora-sage bg-sonora-sage/10 px-2 py-0.5 rounded-full">
                      {rec.intent}
                    </span>
                  </div>
                </div>
                <button className="opacity-0 group-hover:opacity-100 transition-calm p-2 rounded-full bg-sonora-bark text-sonora-cream flex-shrink-0">
                  <Play size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Albums */}
      <section className="mb-12">
        <h2 className="font-display text-xl font-semibold text-sonora-bark mb-4">Recent Albums</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {recentAlbums.map(album => (
            <button
              key={album.id}
              onClick={() => onNavigate('album', album.id)}
              className="group text-left"
            >
              <div className="aspect-square rounded-xl mb-3 relative overflow-hidden">
                <AlbumArt type="album" id={album.id} size="xl" className="w-full h-full" />
                <div className="absolute inset-0 bg-sonora-bark/0 group-hover:bg-sonora-bark/10 transition-calm flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-sonora-bark text-sonora-cream flex items-center justify-center opacity-0 group-hover:opacity-100 transition-calm shadow-lg">
                    <Play size={16} className="ml-0.5" />
                  </div>
                </div>
              </div>
              <p className="text-sm font-medium text-sonora-bark truncate">{album.title}</p>
              <p className="text-xs text-sonora-stone truncate">{album.artist} · {album.year}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Recently Played */}
      <section className="mb-8">
        <h2 className="font-display text-xl font-semibold text-sonora-bark mb-4">Recently Played</h2>
        <div className="space-y-0.5">
          {recentTracks.map((track, i) => (
            <TrackRow 
              key={track.id} 
              track={track} 
              index={i}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      </section>

      {/* Deep Listening CTA */}
      <section className="mb-8">
        <button
          onClick={() => onNavigate('deep-listening')}
          className="w-full bg-gradient-to-r from-sonora-bark to-sonora-earth rounded-2xl p-8 text-left hover:opacity-95 transition-calm group"
        >
          <div className="flex items-center gap-3 mb-3">
            <Headphones size={24} className="text-sonora-cream animate-breathe" />
            <h3 className="font-display text-xl font-semibold text-sonora-cream">Deep Listening</h3>
          </div>
          <p className="text-sm text-sonora-cream/70 max-w-md">
            Enter a focused listening space. No distractions, no skipping — just you and the music, 
            as the artist intended.
          </p>
          <span className="mt-4 inline-flex items-center gap-1 text-sm text-sonora-accent font-medium">
            Begin session <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </span>
        </button>
      </section>

      {/* New Releases */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-semibold text-sonora-bark">New Releases</h2>
          <button 
            onClick={() => onNavigate('explore')}
            className="text-sm text-sonora-stone hover:text-sonora-bark transition-calm flex items-center gap-1"
          >
            Browse all <ArrowRight size={14} />
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {albums.slice(0, 4).map(album => (
            <button
              key={album.id}
              onClick={() => onNavigate('album', album.id)}
              className="group text-left"
            >
              <div className="aspect-square rounded-xl mb-3 relative overflow-hidden shadow-md">
                <AlbumArt type="album" id={album.id} size="xl" className="w-full h-full" />
                <div className="absolute top-2 left-2">
                  <span className="text-[9px] font-semibold text-sonora-cream bg-sonora-bark/70 backdrop-blur px-2 py-0.5 rounded-full">
                    NEW
                  </span>
                </div>
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

      {/* Your Stats Link */}
      <section className="mb-8">
        <button
          onClick={() => onNavigate('stats')}
          className="w-full bg-sonora-warm rounded-2xl p-6 text-left hover:bg-sonora-sand transition-calm group flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-full bg-sonora-accent/20 flex items-center justify-center flex-shrink-0">
            <BarChart3 size={20} className="text-sonora-accent" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sonora-bark">Your Listening Stats</p>
            <p className="text-xs text-sonora-stone">1,847 minutes · 312 tracks · 14 day streak</p>
          </div>
          <ArrowRight size={16} className="text-sonora-stone group-hover:text-sonora-bark transition-calm group-hover:translate-x-1" />
        </button>
      </section>
    </div>
  );
}
