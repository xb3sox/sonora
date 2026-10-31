import React from 'react';
import { usePlayer } from '../context/PlayerContext';
import { tracks, albums, playlists, recommendations } from '../data';
import { View } from '../types';
import { AlbumArt } from '../components/AlbumArt';
import { TrackRow } from '../components/TrackRow';
import { 
  Play, Headphones, Sparkles, ArrowRight, 
  Disc3
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

export function HomePage({ onNavigate }: HomePageProps) {
  const { play, playAlbum } = usePlayer();

  const recentAlbums = albums.slice(0, 4);
  const recentTracks = tracks.slice(0, 6);

  return (
    <div className="p-6 sm:p-8 max-w-6xl mx-auto">
      {/* Greeting */}
      <header className="mb-10 pt-8 sm:pt-0">
        <h1 className="font-display text-3xl font-semibold text-sonora-bark mb-2">
          {getGreeting()}
        </h1>
        <p className="text-sonora-stone text-sm">
          Pick up where you left off, or discover something new.
        </p>
      </header>

      {/* Quick Play Grid */}
      <section className="mb-12">
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
    </div>
  );
}
