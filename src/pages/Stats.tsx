import React from 'react';
import { usePlayer } from '../context/PlayerContext';
import { tracks, albums, artists } from '../data';
import { AlbumArt } from '../components/AlbumArt';
import { 
  BarChart3, Clock, Music2, Heart, 
  TrendingUp, Disc3, Users, Sparkles
} from 'lucide-react';

// Simulated listening stats (in a real app these would come from backend)
const listeningStats = {
  totalMinutes: 1847,
  totalTracks: 312,
  topGenres: [
    { name: 'Ambient', minutes: 612, percentage: 33 },
    { name: 'Folk', minutes: 487, percentage: 26 },
    { name: 'Electronic', minutes: 421, percentage: 23 },
    { name: 'Indie Folk', minutes: 327, percentage: 18 },
  ],
  topArtists: [
    { id: 'a1', minutes: 580 },
    { id: 'a2', minutes: 445 },
    { id: 'a3', minutes: 412 },
    { id: 'a4', minutes: 410 },
  ],
  listeningStreak: 14,
  favoriteTimeOfDay: 'Evening',
  mostActiveDay: 'Sunday',
  recentlyDiscovered: 8,
};

export function StatsPage() {
  const { favorites } = usePlayer();

  const formatHours = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="p-6 sm:p-8 max-w-5xl mx-auto">
      <header className="mb-8 pt-8 sm:pt-0">
        <div className="flex items-center gap-2 text-xs font-semibold text-sonora-accent uppercase tracking-wider mb-2">
          <BarChart3 size={14} /> Your Listening
        </div>
        <h1 className="font-display text-3xl font-semibold text-sonora-bark mb-2">
          Your Music Story
        </h1>
        <p className="text-sonora-stone text-sm">
          Insights into what you love. All data stays on your device.
        </p>
      </header>

      {/* Overview Cards */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <div className="bg-sonora-warm rounded-xl p-4">
          <Clock size={16} className="text-sonora-accent mb-2" />
          <p className="text-2xl font-semibold text-sonora-bark">{formatHours(listeningStats.totalMinutes)}</p>
          <p className="text-xs text-sonora-stone mt-1">Listened this month</p>
        </div>
        <div className="bg-sonora-warm rounded-xl p-4">
          <Music2 size={16} className="text-sonora-accent mb-2" />
          <p className="text-2xl font-semibold text-sonora-bark">{listeningStats.totalTracks}</p>
          <p className="text-xs text-sonora-stone mt-1">Tracks played</p>
        </div>
        <div className="bg-sonora-warm rounded-xl p-4">
          <TrendingUp size={16} className="text-sonora-accent mb-2" />
          <p className="text-2xl font-semibold text-sonora-bark">{listeningStats.listeningStreak}</p>
          <p className="text-xs text-sonora-stone mt-1">Day streak</p>
        </div>
        <div className="bg-sonora-warm rounded-xl p-4">
          <Sparkles size={16} className="text-sonora-accent mb-2" />
          <p className="text-2xl font-semibold text-sonora-bark">{listeningStats.recentlyDiscovered}</p>
          <p className="text-xs text-sonora-stone mt-1">New artists found</p>
        </div>
      </section>

      {/* Top Genres */}
      <section className="mb-8">
        <h2 className="font-display text-xl font-semibold text-sonora-bark mb-4">Top Genres</h2>
        <div className="bg-sonora-warm rounded-xl p-5">
          <div className="space-y-3">
            {listeningStats.topGenres.map(genre => (
              <div key={genre.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium text-sonora-bark">{genre.name}</span>
                  <span className="text-xs text-sonora-stone">{formatHours(genre.minutes)}</span>
                </div>
                <div className="h-2 bg-sonora-sand rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-sonora-accent to-sonora-clay rounded-full transition-all duration-1000"
                    style={{ width: `${genre.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Artists */}
      <section className="mb-8">
        <h2 className="font-display text-xl font-semibold text-sonora-bark mb-4">Top Artists</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {listeningStats.topArtists.map((item, i) => {
            const artist = artists.find(a => a.id === item.id);
            if (!artist) return null;
            return (
              <div key={item.id} className="flex items-center gap-3 bg-sonora-warm rounded-xl p-4">
                <div className="w-8 h-8 rounded-full bg-sonora-sand flex items-center justify-center text-sm font-semibold text-sonora-earth">
                  {i + 1}
                </div>
                <AlbumArt type="artist" id={artist.id} size="md" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-sonora-bark truncate">{artist.name}</p>
                  <p className="text-xs text-sonora-stone">{formatHours(item.minutes)} · {artist.genres[0]}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Listening Patterns */}
      <section className="mb-8">
        <h2 className="font-display text-xl font-semibold text-sonora-bark mb-4">Listening Patterns</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="bg-sonora-warm rounded-xl p-5">
            <p className="text-xs font-semibold text-sonora-stone uppercase tracking-wider mb-2">Favorite time</p>
            <p className="text-lg font-medium text-sonora-bark">{listeningStats.favoriteTimeOfDay}</p>
            <p className="text-xs text-sonora-stone mt-1">You listen most between 7–10 PM</p>
          </div>
          <div className="bg-sonora-warm rounded-xl p-5">
            <p className="text-xs font-semibold text-sonora-stone uppercase tracking-wider mb-2">Most active day</p>
            <p className="text-lg font-medium text-sonora-bark">{listeningStats.mostActiveDay}</p>
            <p className="text-xs text-sonora-stone mt-1">Your weekend listening sessions are longest</p>
          </div>
        </div>
      </section>

      {/* Liked Tracks */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-semibold text-sonora-bark flex items-center gap-2">
            <Heart size={18} className="text-sonora-accent" /> Liked Tracks
          </h2>
          <span className="text-sm text-sonora-stone">{favorites.size} tracks</span>
        </div>
        {favorites.size > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {tracks.filter(t => favorites.has(t.id)).slice(0, 8).map(track => (
              <div key={track.id} className="bg-sonora-warm rounded-xl p-3">
                <AlbumArt type="track" id={track.id} size="lg" className="mb-2" />
                <p className="text-sm font-medium text-sonora-bark truncate">{track.title}</p>
                <p className="text-xs text-sonora-stone truncate">{track.artist}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-sonora-warm rounded-xl p-8 text-center">
            <Heart size={32} className="text-sonora-sand mx-auto mb-3" />
            <p className="text-sm text-sonora-stone">Like tracks to see them here</p>
          </div>
        )}
      </section>

      {/* Privacy note */}
      <div className="bg-sonora-warm rounded-xl p-5 text-center">
        <p className="text-xs text-sonora-stone italic">
          All listening data is processed locally and never leaves your device. 
          You can disable tracking anytime in Settings.
        </p>
      </div>
    </div>
  );
}
