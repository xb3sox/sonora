import React, { useState, useMemo, useEffect } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { tracks, albums, artists } from '../data';
import { View } from '../types';
import { AlbumArt } from '../components/AlbumArt';
import { TrackRow } from '../components/TrackRow';
import { SearchFilters, SearchFilter } from '../components/SearchFilters';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Search, Play, Music2, Disc3, Users, Clock, X, TrendingUp } from 'lucide-react';

interface SearchPageProps {
  onNavigate: (view: View, id?: string) => void;
}

// Trending searches based on popular content
const trendingSearches = [
  { label: 'Ambient', icon: '🌿' },
  { label: 'Elena Voss', icon: '🎵' },
  { label: 'Folk', icon: '🎸' },
  { label: 'Quiet Hours', icon: '💿' },
  { label: 'Electronic', icon: '🎧' },
  { label: 'Kai Nomura', icon: '🌊' },
];

export function SearchPage({ onNavigate }: SearchPageProps) {
  const { play } = usePlayer();
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<SearchFilter>('all');
  const [recentSearches, setRecentSearches] = useLocalStorage<string[]>('sonora-recent-searches', []);

  // Save search to recent when user searches
  useEffect(() => {
    if (query.trim() && query.length > 1) {
      const timeout = setTimeout(() => {
        setRecentSearches(prev => {
          const filtered = prev.filter(s => s !== query);
          return [query, ...filtered].slice(0, 8); // Keep last 8 searches
        });
      }, 2000); // Save after 2 seconds of typing
      return () => clearTimeout(timeout);
    }
  }, [query]);

  const clearRecentSearches = () => {
    setRecentSearches([]);
  };

  const results = useMemo(() => {
    if (!query.trim()) return { tracks: [], albums: [], artists: [] };
    const q = query.toLowerCase();
    return {
      tracks: tracks.filter(t => 
        t.title.toLowerCase().includes(q) || 
        t.artist.toLowerCase().includes(q) || 
        t.album.toLowerCase().includes(q) ||
        t.genre.toLowerCase().includes(q)
      ),
      albums: albums.filter(a => 
        a.title.toLowerCase().includes(q) || 
        a.artist.toLowerCase().includes(q) ||
        a.genre.toLowerCase().includes(q)
      ),
      artists: artists.filter(a => 
        a.name.toLowerCase().includes(q) ||
        a.genres.some(g => g.toLowerCase().includes(q))
      ),
    };
  }, [query]);

  const hasResults = results.tracks.length > 0 || results.albums.length > 0 || results.artists.length > 0;

  return (
    <div className="p-6 sm:p-8 max-w-6xl mx-auto">
      {/* Search Input */}
      <div className="mb-8 pt-8 sm:pt-0">
        <div className="relative max-w-xl">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-sonora-stone" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tracks, albums, artists, or genres..."
            className="w-full pl-12 pr-4 py-3.5 bg-sonora-warm border border-sonora-sand rounded-xl text-sm text-sonora-bark placeholder:text-sonora-stone focus:outline-none focus:border-sonora-earth focus:ring-1 focus:ring-sonora-earth transition-calm"
            autoFocus
          />
        </div>
      </div>

      {/* Empty State with Recent & Trending */}
      {!query.trim() && (
        <div className="py-8">
          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <section className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-sonora-stone uppercase tracking-wider">
                  <Clock size={14} /> Recent Searches
                </h3>
                <button
                  onClick={clearRecentSearches}
                  className="text-xs text-sonora-stone hover:text-sonora-bark transition-calm"
                >
                  Clear all
                </button>
              </div>
              <div className="space-y-1">
                {recentSearches.map((search, i) => (
                  <button
                    key={i}
                    onClick={() => setQuery(search)}
                    className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-sonora-warm transition-calm group text-left"
                  >
                    <Clock size={14} className="text-sonora-stone flex-shrink-0" />
                    <span className="text-sm text-sonora-bark flex-1">{search}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setRecentSearches(prev => prev.filter((_, idx) => idx !== i));
                      }}
                      className="p-1 rounded-full text-sonora-stone opacity-0 group-hover:opacity-100 hover:text-sonora-bark transition-calm"
                      aria-label="Remove from recent"
                    >
                      <X size={12} />
                    </button>
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* Trending Searches */}
          <section className="mb-8">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-sonora-stone uppercase tracking-wider mb-3">
              <TrendingUp size={14} /> Trending
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {trendingSearches.map((trend, i) => (
                <button
                  key={i}
                  onClick={() => setQuery(trend.label)}
                  className="flex items-center gap-3 p-3 bg-sonora-warm hover:bg-sonora-sand rounded-xl transition-calm text-left group"
                >
                  <span className="text-2xl">{trend.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-sonora-bark truncate">{trend.label}</p>
                    <p className="text-xs text-sonora-stone">Popular search</p>
                  </div>
                  <Play size={14} className="text-sonora-stone opacity-0 group-hover:opacity-100 transition-calm flex-shrink-0" />
                </button>
              ))}
            </div>
          </section>

          {/* Browse Categories */}
          <section>
            <h3 className="flex items-center gap-2 text-sm font-semibold text-sonora-stone uppercase tracking-wider mb-3">
              Browse by Genre
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { name: 'Ambient', color: 'from-sonora-sand to-sonora-mist', emoji: '🌿' },
                { name: 'Folk', color: 'from-sonora-sage/30 to-sonora-earth/20', emoji: '🎸' },
                { name: 'Electronic', color: 'from-sonora-accent/30 to-sonora-clay/20', emoji: '🎧' },
                { name: 'Indie Folk', color: 'from-sonora-clay/30 to-sonora-accent/20', emoji: '🎵' },
              ].map((genre, i) => (
                <button
                  key={i}
                  onClick={() => setQuery(genre.name)}
                  className={`relative aspect-[2/1] rounded-xl overflow-hidden bg-gradient-to-br ${genre.color} flex items-center justify-center group hover:scale-[1.02] transition-transform`}
                >
                  <span className="text-4xl opacity-60 group-hover:scale-110 transition-transform">{genre.emoji}</span>
                  <span className="absolute bottom-2 left-3 text-sm font-medium text-sonora-bark">{genre.name}</span>
                </button>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* No Results */}
      {query.trim() && !hasResults && (
        <div className="text-center py-16">
          <Music2 size={48} className="text-sonora-sand mx-auto mb-4" />
          <p className="text-sonora-stone text-sm">No results found for "{query}"</p>
          <p className="text-sonora-stone/60 text-xs mt-1">Try a different search term</p>
        </div>
      )}

      {/* Results */}
      {hasResults && (
        <div className="space-y-8">
          {/* Filters */}
          <SearchFilters
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            resultCounts={{
              tracks: results.tracks.length,
              albums: results.albums.length,
              artists: results.artists.length,
            }}
          />

          {/* Artists */}
          {(activeFilter === 'all' || activeFilter === 'artists') && results.artists.length > 0 && (
            <section>
              <h2 className="flex items-center gap-2 text-sm font-semibold text-sonora-stone uppercase tracking-wider mb-3">
                <Users size={14} /> Artists
              </h2>
              <div className="flex gap-4 overflow-x-auto pb-2">
                {results.artists.map(artist => (
                  <button
                    key={artist.id}
                    onClick={() => onNavigate('artist', artist.id)}
                    className="flex-shrink-0 text-center group"
                  >
                    <div className="w-20 h-20 rounded-full overflow-hidden mb-2 shadow-md">
                      <AlbumArt type="artist" id={artist.id} size="xl" className="w-full h-full" />
                    </div>
                    <p className="text-sm font-medium text-sonora-bark">{artist.name}</p>
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* Albums */}
          {(activeFilter === 'all' || activeFilter === 'albums') && results.albums.length > 0 && (
            <section>
              <h2 className="flex items-center gap-2 text-sm font-semibold text-sonora-stone uppercase tracking-wider mb-3">
                <Disc3 size={14} /> Albums
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {results.albums.map(album => (
                  <button
                    key={album.id}
                    onClick={() => onNavigate('album', album.id)}
                    className="group text-left"
                  >
                    <div className="aspect-square rounded-xl mb-2 relative overflow-hidden shadow-md">
                      <AlbumArt type="album" id={album.id} size="xl" className="w-full h-full" />
                      <div className="absolute inset-0 bg-sonora-bark/0 group-hover:bg-sonora-bark/10 transition-calm flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-sonora-bark text-sonora-cream flex items-center justify-center opacity-0 group-hover:opacity-100 transition-calm">
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

          {/* Tracks */}
          {(activeFilter === 'all' || activeFilter === 'tracks') && results.tracks.length > 0 && (
            <section>
              <h2 className="flex items-center gap-2 text-sm font-semibold text-sonora-stone uppercase tracking-wider mb-3">
                <Music2 size={14} /> Tracks
              </h2>
              <div className="space-y-0.5">
                {results.tracks.map((track, i) => (
                  <TrackRow 
                    key={track.id} 
                    track={track} 
                    index={i}
                    onNavigate={onNavigate}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
