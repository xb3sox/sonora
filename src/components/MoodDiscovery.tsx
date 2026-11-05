import React, { useState, useMemo } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { tracks, artists, albums } from '../data';
import { View } from '../types';
import { AlbumArt } from '../components/AlbumArt';
import { TrackRow } from '../components/TrackRow';
import { 
  Sparkles, ArrowRight, Play, X, 
  Sun, Moon, Cloud, Zap, Heart, Coffee
} from 'lucide-react';

interface MoodDiscoveryProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: View, id?: string) => void;
}

type Mood = 'energetic' | 'calm' | 'focus' | 'happy' | 'melancholic' | 'romantic';

const moods: { id: Mood; label: string; icon: React.ReactNode; color: string; description: string }[] = [
  { id: 'energetic', label: 'Energetic', icon: <Zap size={24} />, color: 'from-orange-400 to-red-500', description: 'High energy, upbeat tracks' },
  { id: 'calm', label: 'Calm', icon: <Cloud size={24} />, color: 'from-blue-400 to-cyan-500', description: 'Relaxing, peaceful music' },
  { id: 'focus', label: 'Focus', icon: <Sun size={24} />, color: 'from-yellow-400 to-orange-500', description: 'Concentration-boosting tracks' },
  { id: 'happy', label: 'Happy', icon: <Heart size={24} />, color: 'from-pink-400 to-rose-500', description: 'Uplifting, joyful songs' },
  { id: 'melancholic', label: 'Melancholic', icon: <Moon size={24} />, color: 'from-indigo-400 to-purple-500', description: 'Reflective, emotional music' },
  { id: 'romantic', label: 'Romantic', icon: <Coffee size={24} />, color: 'from-rose-400 to-pink-500', description: 'Love songs and ballads' },
];

// Mood-to-genre mapping for recommendations
const moodGenreMap: Record<Mood, string[]> = {
  energetic: ['Electronic', 'Folk'],
  calm: ['Ambient', 'Indie Folk'],
  focus: ['Ambient', 'Electronic'],
  happy: ['Folk', 'Indie Folk'],
  melancholic: ['Indie Folk', 'Ambient'],
  romantic: ['Indie Folk', 'Folk'],
};

export function MoodDiscovery({ isOpen, onClose, onNavigate }: MoodDiscoveryProps) {
  const { play } = usePlayer();
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);

  const recommendations = useMemo(() => {
    if (!selectedMood) return [];
    
    const targetGenres = moodGenreMap[selectedMood];
    
    // Get tracks matching the mood's genres
    const matchingTracks = tracks.filter(t => 
      targetGenres.includes(t.genre)
    );
    
    // Shuffle and limit to 8 tracks
    return matchingTracks
      .sort(() => Math.random() - 0.5)
      .slice(0, 8);
  }, [selectedMood]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-sonora-cream overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-sonora-cream/95 backdrop-blur-sm border-b border-sonora-sand z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles size={24} className="text-sonora-accent" />
            <h1 className="font-display text-2xl font-semibold text-sonora-bark">
              Mood Discovery
            </h1>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-sonora-warm text-sonora-stone hover:text-sonora-bark transition-calm"
            aria-label="Close mood discovery"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {!selectedMood ? (
          <>
            {/* Mood Selection */}
            <div className="mb-8">
              <h2 className="font-display text-xl font-semibold text-sonora-bark mb-2">
                How are you feeling?
              </h2>
              <p className="text-sm text-sonora-stone mb-6">
                Select your mood and we'll curate the perfect playlist for you
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {moods.map(mood => (
                  <button
                    key={mood.id}
                    onClick={() => setSelectedMood(mood.id)}
                    className="group relative overflow-hidden rounded-2xl p-6 text-left transition-all hover:scale-105 hover:shadow-xl"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${mood.color} opacity-20 group-hover:opacity-30 transition-opacity`} />
                    <div className="relative">
                      <div className="mb-3 text-sonora-bark">
                        {mood.icon}
                      </div>
                      <h3 className="text-lg font-semibold text-sonora-bark mb-1">
                        {mood.label}
                      </h3>
                      <p className="text-xs text-sonora-stone">
                        {mood.description}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Recommendations */}
            <div className="mb-6">
              <button
                onClick={() => setSelectedMood(null)}
                className="text-sm text-sonora-stone hover:text-sonora-bark transition-calm mb-4 flex items-center gap-2"
              >
                <ArrowRight size={16} className="rotate-180" />
                Change mood
              </button>
              
              <div className="flex items-center gap-3 mb-4">
                <div className="text-sonora-bark">
                  {moods.find(m => m.id === selectedMood)?.icon}
                </div>
                <div>
                  <h2 className="font-display text-2xl font-semibold text-sonora-bark">
                    {moods.find(m => m.id === selectedMood)?.label} Vibes
                  </h2>
                  <p className="text-sm text-sonora-stone">
                    {recommendations.length} tracks curated for your mood
                  </p>
                </div>
              </div>
            </div>

            {/* Track List */}
            <div className="space-y-0.5">
              {recommendations.map((track, i) => (
                <TrackRow
                  key={track.id}
                  track={track}
                  index={i}
                  onNavigate={onNavigate}
                />
              ))}
            </div>

            {/* Play All Button */}
            <div className="mt-8 flex justify-center">
              <button
                onClick={() => {
                  if (recommendations.length > 0) {
                    play(recommendations[0]);
                  }
                }}
                className="flex items-center gap-2 px-6 py-3 bg-sonora-bark text-sonora-cream rounded-full text-sm font-medium hover:bg-sonora-night transition-calm shadow-lg"
              >
                <Play size={16} className="ml-0.5" />
                Play All
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
