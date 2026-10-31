import React, { useState } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { tracks, recommendations, genres, artists } from '../data';
import { View } from '../types';
import { AlbumArt } from '../components/AlbumArt';
import { 
  Sparkles, Compass, ArrowRight, Play, 
  Info, Disc3, Users, Music2, SlidersHorizontal
} from 'lucide-react';

interface ExplorePageProps {
  onNavigate: (view: View, id?: string) => void;
}

export function ExplorePage({ onNavigate }: ExplorePageProps) {
  const { play } = usePlayer();
  const [selectedIntent, setSelectedIntent] = useState<string>('all');
  const [selectedGenre, setSelectedGenre] = useState<string>('All');

  const intents = [
    { id: 'all', label: 'All', icon: <Compass size={14} /> },
    { id: 'calm', label: 'Calm & Reflect', icon: <Sparkles size={14} /> },
    { id: 'focus', label: 'Deep Focus', icon: <SlidersHorizontal size={14} /> },
    { id: 'discover', label: 'Discover New', icon: <Disc3 size={14} /> },
    { id: 'connect', label: 'Artist Connection', icon: <Users size={14} /> },
  ];

  const filteredTracks = selectedGenre === 'All' 
    ? tracks 
    : tracks.filter(t => t.genre === selectedGenre);

  return (
    <div className="p-6 sm:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <header className="mb-8 pt-8 sm:pt-0">
        <h1 className="font-display text-3xl font-semibold text-sonora-bark mb-2">
          Explore
        </h1>
        <p className="text-sonora-stone text-sm">
          Discover music with intention. Every recommendation comes with an explanation.
        </p>
      </header>

      {/* Intent Selector */}
      <section className="mb-8">
        <p className="text-xs font-semibold text-sonora-stone uppercase tracking-wider mb-3">
          What are you looking for?
        </p>
        <div className="flex flex-wrap gap-2">
          {intents.map(intent => (
            <button
              key={intent.id}
              onClick={() => setSelectedIntent(intent.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-calm
                ${selectedIntent === intent.id
                  ? 'bg-sonora-bark text-sonora-cream'
                  : 'bg-sonora-warm text-sonora-earth hover:bg-sonora-sand'
                }`}
            >
              {intent.icon}
              {intent.label}
            </button>
          ))}
        </div>
      </section>

      {/* Explainable Recommendations */}
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={18} className="text-sonora-accent" />
          <h2 className="font-display text-xl font-semibold text-sonora-bark">
            Recommended for You
          </h2>
        </div>
        <div className="space-y-3">
          {recommendations.map((rec, i) => (
            <div
              key={i}
              className="bg-sonora-warm rounded-xl p-5 hover:bg-sonora-sand transition-calm group"
            >
              <div className="flex items-start gap-4">
                <AlbumArt type="track" id={rec.track.id} size="lg" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-base font-medium text-sonora-bark">{rec.track.title}</p>
                      <p className="text-sm text-sonora-stone">{rec.track.artist} · {rec.track.album}</p>
                    </div>
                    <button
                      onClick={() => play(rec.track)}
                      className="flex-shrink-0 w-9 h-9 rounded-full bg-sonora-bark text-sonora-cream flex items-center justify-center opacity-0 group-hover:opacity-100 transition-calm"
                    >
                      <Play size={14} className="ml-0.5" />
                    </button>
                  </div>
                  
                  {/* Explanation */}
                  <div className="mt-3 flex items-start gap-2 bg-sonora-cream/50 rounded-lg p-3">
                    <Info size={14} className="text-sonora-accent mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-sonora-earth leading-relaxed">{rec.reason}</p>
                      <div className="mt-2 flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-semibold text-sonora-sage bg-sonora-sage/10 px-2 py-0.5 rounded-full">
                          Intent: {rec.intent}
                        </span>
                        {rec.track.lossless && (
                          <span className="text-[10px] font-semibold text-sonora-accent bg-sonora-accent/10 px-2 py-0.5 rounded-full">
                            Lossless
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Genre Filter & Browse */}
      <section className="mb-10">
        <h2 className="font-display text-xl font-semibold text-sonora-bark mb-4">Browse by Genre</h2>
        <div className="flex flex-wrap gap-2 mb-6">
          {genres.map(genre => (
            <button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              className={`px-3 py-1.5 rounded-full text-sm transition-calm
                ${selectedGenre === genre
                  ? 'bg-sonora-bark text-sonora-cream'
                  : 'bg-sonora-warm text-sonora-earth hover:bg-sonora-sand'
                }`}
            >
              {genre}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredTracks.slice(0, 6).map(track => (
            <button
              key={track.id}
              onClick={() => play(track)}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-sonora-warm transition-calm group text-left"
            >
              <AlbumArt type="track" id={track.id} size="md" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sonora-bark truncate">{track.title}</p>
                <p className="text-xs text-sonora-stone truncate">{track.artist} · {track.genre}</p>
              </div>
              <Play size={14} className="text-sonora-stone opacity-0 group-hover:opacity-100 transition-calm" />
            </button>
          ))}
        </div>
      </section>

      {/* Artists to Connect With */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-semibold text-sonora-bark">Artists to Connect With</h2>
          <button className="text-sm text-sonora-stone hover:text-sonora-bark transition-calm flex items-center gap-1">
            View all <ArrowRight size={14} />
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {artists.map(artist => (
            <button
              key={artist.id}
              onClick={() => onNavigate('artist', artist.id)}
              className="group text-center"
            >
              <div className="w-full aspect-square max-w-[140px] mx-auto rounded-full overflow-hidden mb-3 shadow-md">
                <AlbumArt type="artist" id={artist.id} size="xl" className="w-full h-full" />
              </div>
              <p className="text-sm font-medium text-sonora-bark">{artist.name}</p>
              <p className="text-xs text-sonora-stone">{artist.genres[0]}</p>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
