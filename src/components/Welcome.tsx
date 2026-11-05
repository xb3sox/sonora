import React, { useState } from 'react';
import { Headphones, ArrowRight, Check, Music2, Sparkles, Shield } from 'lucide-react';

interface WelcomeProps {
  onComplete: (preferences: WelcomePreferences) => void;
}

export interface WelcomePreferences {
  intents: string[];
  genres: string[];
  audioQuality: 'standard' | 'high' | 'lossless';
  importFrom?: string;
}

export function Welcome({ onComplete }: WelcomeProps) {
  const [step, setStep] = useState(0);
  const [preferences, setPreferences] = useState<WelcomePreferences>({
    intents: [],
    genres: [],
    audioQuality: 'lossless',
  });

  const intentOptions = [
    { id: 'calm', label: 'Calm & Reflect', desc: 'Meditative, ambient, slow-building', icon: '🌿' },
    { id: 'focus', label: 'Deep Focus', desc: 'Instrumental, minimal, concentration', icon: '🎯' },
    { id: 'discover', label: 'Discover New', desc: 'Fresh artists, unexpected connections', icon: '🧭' },
    { id: 'connect', label: 'Artist Stories', desc: 'Deep dives into creators and credits', icon: '✍️' },
    { id: 'energy', label: 'Movement', desc: 'Rhythmic, uplifting, active', icon: '⚡' },
  ];

  const genreOptions = [
    'Ambient', 'Folk', 'Electronic', 'Indie Folk', 'Classical',
    'Jazz', 'Singer-Songwriter', 'Post-Rock', 'Experimental', 'World'
  ];

  const toggleIntent = (id: string) => {
    setPreferences(prev => ({
      ...prev,
      intents: prev.intents.includes(id)
        ? prev.intents.filter(i => i !== id)
        : [...prev.intents, id]
    }));
  };

  const toggleGenre = (genre: string) => {
    setPreferences(prev => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter(g => g !== genre)
        : [...prev.genres, genre]
    }));
  };

  const steps = [
    // Step 0: Intro
    <div key="intro" className="text-center max-w-md mx-auto animate-fade-in">
      <div className="w-16 h-16 rounded-full bg-sonora-bark flex items-center justify-center mx-auto mb-6 animate-breathe">
        <Headphones size={28} className="text-sonora-cream" />
      </div>
      <h1 className="font-display text-4xl font-semibold text-sonora-bark mb-4">
        Welcome to Sonora
      </h1>
      <p className="text-sonora-earth text-base leading-relaxed mb-2">
        A calm music platform that helps you <em>discover less and love more</em>.
      </p>
      <p className="text-sonora-stone text-sm leading-relaxed mb-8">
        No algorithmic overwhelm. No dark patterns. Just thoughtful recommendations 
        with honest explanations, lossless audio, and transparent credits for every track.
      </p>
      <button
        onClick={() => setStep(1)}
        className="inline-flex items-center gap-2 px-6 py-3 bg-sonora-bark text-sonora-cream rounded-full text-sm font-medium hover:bg-sonora-night transition-calm"
      >
        Get started <ArrowRight size={16} />
      </button>
      <button
        onClick={() => onComplete(preferences)}
        className="block mx-auto mt-4 text-xs text-sonora-stone hover:text-sonora-bark transition-calm"
      >
        Skip setup
      </button>
    </div>,

    // Step 1: Intents
    <div key="intents" className="max-w-lg mx-auto animate-fade-in">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-sonora-accent uppercase tracking-wider mb-3">
          <Sparkles size={14} /> Step 1 of 3
        </div>
        <h2 className="font-display text-2xl font-semibold text-sonora-bark mb-2">
          How do you want to listen?
        </h2>
        <p className="text-sm text-sonora-stone">
          Choose one or more. We'll tailor recommendations accordingly.
        </p>
      </div>
      <div className="space-y-2 mb-8">
        {intentOptions.map(intent => (
          <button
            key={intent.id}
            onClick={() => toggleIntent(intent.id)}
            className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-calm text-left
              ${preferences.intents.includes(intent.id)
                ? 'border-sonora-bark bg-sonora-warm'
                : 'border-sonora-sand hover:border-sonora-stone'
              }`}
          >
            <span className="text-2xl">{intent.icon}</span>
            <div className="flex-1">
              <p className="text-sm font-medium text-sonora-bark">{intent.label}</p>
              <p className="text-xs text-sonora-stone">{intent.desc}</p>
            </div>
            {preferences.intents.includes(intent.id) && (
              <Check size={18} className="text-sonora-bark" />
            )}
          </button>
        ))}
      </div>
      <div className="flex items-center justify-between">
        <button
          onClick={() => setStep(0)}
          className="text-sm text-sonora-stone hover:text-sonora-bark transition-calm"
        >
          Back
        </button>
        <button
          onClick={() => setStep(2)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-sonora-bark text-sonora-cream rounded-full text-sm font-medium hover:bg-sonora-night transition-calm"
        >
          Continue <ArrowRight size={14} />
        </button>
      </div>
    </div>,

    // Step 2: Genres
    <div key="genres" className="max-w-lg mx-auto animate-fade-in">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-sonora-accent uppercase tracking-wider mb-3">
          <Music2 size={14} /> Step 2 of 3
        </div>
        <h2 className="font-display text-2xl font-semibold text-sonora-bark mb-2">
          What genres draw you in?
        </h2>
        <p className="text-sm text-sonora-stone">
          Select as many as you like. You can always change this later.
        </p>
      </div>
      <div className="flex flex-wrap gap-2 mb-8 justify-center">
        {genreOptions.map(genre => (
          <button
            key={genre}
            onClick={() => toggleGenre(genre)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-calm
              ${preferences.genres.includes(genre)
                ? 'bg-sonora-bark text-sonora-cream'
                : 'bg-sonora-warm text-sonora-earth hover:bg-sonora-sand'
              }`}
          >
            {genre}
          </button>
        ))}
      </div>
      <div className="flex items-center justify-between">
        <button
          onClick={() => setStep(1)}
          className="text-sm text-sonora-stone hover:text-sonora-bark transition-calm"
        >
          Back
        </button>
        <button
          onClick={() => setStep(3)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-sonora-bark text-sonora-cream rounded-full text-sm font-medium hover:bg-sonora-night transition-calm"
        >
          Continue <ArrowRight size={14} />
        </button>
      </div>
    </div>,

    // Step 3: Audio quality
    <div key="quality" className="max-w-lg mx-auto animate-fade-in">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-sonora-accent uppercase tracking-wider mb-3">
          <Shield size={14} /> Step 3 of 3
        </div>
        <h2 className="font-display text-2xl font-semibold text-sonora-bark mb-2">
          Choose your audio quality
        </h2>
        <p className="text-sm text-sonora-stone">
          Sonora streams in lossless by default. Adjust based on your needs.
        </p>
      </div>
      <div className="space-y-2 mb-8">
        {[
          { id: 'standard' as const, label: 'Standard', desc: '128 kbps — best for mobile data', icon: '📱' },
          { id: 'high' as const, label: 'High', desc: '320 kbps — balanced quality', icon: '🎵' },
          { id: 'lossless' as const, label: 'Lossless', desc: '24-bit/96kHz — studio quality', icon: '💎' },
        ].map(option => (
          <button
            key={option.id}
            onClick={() => setPreferences(prev => ({ ...prev, audioQuality: option.id }))}
            className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-calm text-left
              ${preferences.audioQuality === option.id
                ? 'border-sonora-bark bg-sonora-warm'
                : 'border-sonora-sand hover:border-sonora-stone'
              }`}
          >
            <span className="text-2xl">{option.icon}</span>
            <div className="flex-1">
              <p className="text-sm font-medium text-sonora-bark">{option.label}</p>
              <p className="text-xs text-sonora-stone">{option.desc}</p>
            </div>
            {preferences.audioQuality === option.id && (
              <Check size={18} className="text-sonora-bark" />
            )}
          </button>
        ))}
      </div>
      <div className="flex items-center justify-between">
        <button
          onClick={() => setStep(2)}
          className="text-sm text-sonora-stone hover:text-sonora-bark transition-calm"
        >
          Back
        </button>
        <button
          onClick={() => onComplete(preferences)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-sonora-bark text-sonora-cream rounded-full text-sm font-medium hover:bg-sonora-night transition-calm"
        >
          Start listening <ArrowRight size={14} />
        </button>
      </div>
    </div>,
  ];

  return (
    <div className="min-h-screen bg-sonora-cream flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        {/* Progress dots */}
        {step > 0 && (
          <div className="flex items-center justify-center gap-2 mb-8">
            {[1, 2, 3].map(n => (
              <div
                key={n}
                className={`h-1 rounded-full transition-all duration-300
                  ${n === step ? 'w-8 bg-sonora-bark' : n < step ? 'w-4 bg-sonora-earth' : 'w-4 bg-sonora-sand'}`}
              />
            ))}
          </div>
        )}
        {steps[step]}
      </div>
    </div>
  );
}
